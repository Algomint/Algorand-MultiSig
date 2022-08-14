import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import useStyles from "../style";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { RawTxnBackendResponseType } from "../models/apiModels";
import { useState } from "react";
import { decodeBase64RawTxnToTransaction } from "../utils/decode";
import algosdk from "algosdk";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function RawTxnTable(props: { txn: RawTxnBackendResponseType }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  let key = 1;

  function cut(str: string, cutLen: number) {
    return str.slice(0, cutLen) + "..." + str.slice(-cutLen);
  }

  function TxnStatus() {
    if (props.txn.txn.status === "BROADCASTED") {
      return <CheckCircleIcon color="success" />;
    } else {
      return <CircularProgress size={18} />;
    }
  }

  function GetAssetData() {
    const decodedRawTxn = decodeBase64RawTxnToTransaction(
      props.txn.txn.raw_transaction
    );
    return (
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
              <Typography gutterBottom component="div">
                Asset Data (From{" "}
                {cut(algosdk.encodeAddress(decodedRawTxn.from.publicKey), 25)})
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Asset Name</TableCell>
                    <TableCell>Asset Unit Name</TableCell>
                    <TableCell align="right">Asset URL</TableCell>
                    <TableCell align="right">Asset Manager Address</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {decodedRawTxn.assetName}
                    </TableCell>
                    <TableCell>{decodedRawTxn.assetUnitName}</TableCell>
                    <TableCell align="right">
                      {decodedRawTxn.assetURL}
                    </TableCell>
                    <TableCell align="right">
                      {cut(
                        algosdk.encodeAddress(
                          decodedRawTxn.assetManager.publicKey
                        ),
                        20
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableContainer component={Paper} className={classes.table}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={3} align="center">
              <strong>Selected Transaction details</strong>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Data</strong>
            </TableCell>
            <TableCell colSpan={2} align="left">
              <strong>Value</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key={key++}>
            <TableCell component="th" scope="row">
              Transaction Id
            </TableCell>
            <TableCell align="left" colSpan={2}>
              {props.txn.txn.txn_id}
            </TableCell>
          </TableRow>
          <TableRow key={key++}>
            <TableCell component="th" scope="row">
              Status
            </TableCell>
            <TableCell align="left">
              <TxnStatus />
            </TableCell>
            <TableCell>
              {props.txn.txn.status
                ? props.txn.txn.status
                : "PENDING: NO SIGNATURES YET"}
            </TableCell>
          </TableRow>
          <TableRow key={key++}>
            <TableCell component="th" scope="row">
              Raw Transaction
            </TableCell>
            <TableCell align="left">
              {cut(props.txn.txn.raw_transaction, 20)}
            </TableCell>
            <TableCell align="right">
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
          </TableRow>
          <GetAssetData />
          <TableRow key={key++}>
            <TableCell component="th" scope="row">
              n of m type
            </TableCell>
            <TableCell align="left" colSpan={2}>
              {props.txn.txn.signers_threshold} /{" "}
              {props.txn.txn.number_of_signs_total} (version{" "}
              {props.txn.txn.version})
            </TableCell>
          </TableRow>
          <TableRow key={key++}>
            <TableCell component="th" scope="row">
              remaining required signatures
            </TableCell>
            <TableCell align="left" colSpan={2}>
              {props.txn.txn.number_of_signs_required} of{" "}
              {props.txn.txn.signers_threshold}
            </TableCell>
          </TableRow>
          <TableRow key={key++}>
            <TableCell rowSpan={props.txn.signers_addrs.length + 1}>
              Signers addresses
            </TableCell>
          </TableRow>
          {props.txn.signers_addrs.map(e => (
            <TableRow key={key++}>
              <TableCell colSpan={2} align="left">
                {e.signer_address}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
