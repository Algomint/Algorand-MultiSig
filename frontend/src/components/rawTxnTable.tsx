import React, { useState, useEffect } from "react";
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
import { decodeBase64RawTxnToTransaction } from "../utils/decode";
import algosdk from "algosdk";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { AppService } from "../services/app.service";
import Link from "@mui/material/Link";

export default function RawTxnTable(props: {
  txn: RawTxnBackendResponseType;
  appService: AppService;
}) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [networkIdUrl, setNetworkIdUrl] = useState("");

  let key = 1;

  function cut(str: string, cutLen: number) {
    return str.slice(0, cutLen) + "..." + str.slice(-cutLen);
  }

  useEffect(() => {
    const getNetworkTxnIdURL: () => Promise<void> = async () => {
      const resp = await props.appService.getTransactionNetworkId(
        props.txn.txn.txn_id
      );
      const url =
        "https://goalseeker.purestake.io/algorand/testnet/transaction/" +
        resp.done_txn.transaction_id;
      setNetworkIdUrl(url);
    };

    getNetworkTxnIdURL().catch((e: Error) => {
      console.error("Error geting networkId " + e);
    });
    return () => {
      setNetworkIdUrl("");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.txn.txn.txn_id]);

  function TxnStatus(): JSX.Element {
    if (props.txn.txn.status === "BROADCASTED") {
      return (
        <TableCell align="left" size="small" padding="none">
          <CheckCircleIcon color="success" />
          <Link href={networkIdUrl} target="_blank" rel="noopener noreferrer">
            check transaction in goal seeker
          </Link>
        </TableCell>
      );
    } else {
      return (
        <TableCell align="left">
          <CircularProgress size={18} />
        </TableCell>
      );
    }
  }

  function GetAssetData() {
    const decodedRawTxn = decodeBase64RawTxnToTransaction(
      props.txn.txn.raw_transaction
    );
    if (decodedRawTxn.type === algosdk.TransactionType.acfg) {
      return (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box>
                <Typography gutterBottom component="div">
                  Asset Data (From{" "}
                  {cut(algosdk.encodeAddress(decodedRawTxn.from.publicKey), 25)}
                  )
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

    if (decodedRawTxn.type === algosdk.TransactionType.pay) {
      return (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>From</TableCell>
                      <TableCell component="th" scope="row">
                        {cut(
                          algosdk.encodeAddress(decodedRawTxn.from.publicKey),
                          25
                        )}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>To </TableCell>
                      <TableCell>
                        {cut(
                          algosdk.encodeAddress(decodedRawTxn.to.publicKey),
                          25
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="left">Amount</TableCell>
                      <TableCell align="left">
                        {decodedRawTxn.amount} microAlgos
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="left">Note</TableCell>
                      <TableCell align="left">
                        {new TextDecoder().decode(decodedRawTxn.note)}
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

    return <></>;
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

            <TxnStatus />

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
