import React, { Fragment, useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import buffer from "buffer";
import { Controller, useForm, useWatch } from "react-hook-form";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { AppService } from "../services/app.service";
import "../App.css";
import useStyles from "../style";
import Autocomplete from "@mui/material/Autocomplete";
import RawTxnTable from "../components/rawTxnTable";
import { RawTxnBackendResponseType } from "../models/apiModels";

declare const AlgoSigner: any;

type TxnIdsBackendResponseType = {
  success: boolean;
  message: string;
  txnids: string[];
};

type signArgs = {
  txnID: string | null;
  signerAddr: AddrType;
};

type AddrType = {
  address: string;
};

function App() {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<signArgs>({
    mode: "onChange",
    defaultValues: {
      txnID: undefined,
      signerAddr: {
        address: "",
      },
    },
  });

  const classes = useStyles();
  const [addrs, setAddrs] = useState<AddrType[]>([]);

  const { Buffer } = buffer;
  if (!window.Buffer) window.Buffer = Buffer;

  const appService = new AppService();

  useEffect(() => {
    AlgoSigner.connect()
      .then(() => {
        AlgoSigner.accounts({
          ledger: "TestNet",
        })
          .then((d: AddrType[]) => {
            setAddrs(d);
          })
          .catch((e: Error) => Promise.reject(e));
      })
      .catch((e: Error) => Promise.reject(e));
  }, []);

  const onSubmit = handleSubmit(async data => {
    let txnID = data.txnID;
    if (txnID == null) {
      return;
    }
    const getResponse = await appService.getRawTxn(txnID).catch((e: Error) => {
      alert("Cannot get RawTxn from backend. Error: " + e.message);
      console.error(e);
    });

    if (getResponse === undefined) {
      return;
    }

    console.log(getResponse);

    await AlgoSigner.connect();

    let signer = data.signerAddr;

    let base64MultisigTx = getResponse.txn.raw_transaction;
    console.log(base64MultisigTx);
    const addrs = getResponse.signers_addrs.map(e => {
      return e.signer_address;
    });

    const mparams = {
      version: getResponse.txn.version,
      threshold: getResponse.txn.signers_threshold,
      addrs: addrs,
    };

    let signedTxs = await AlgoSigner.signTxn([
      {
        txn: base64MultisigTx,
        msig: mparams,
        signers: [signer.address],
      },
    ]).catch((e: any) => {
      console.error("Error from ALgoSigner signTxn with parameters:");
      console.error(
        JSON.stringify({
          txn: base64MultisigTx,
          msig: mparams,
          signers: [signer.address],
        })
      );
      console.error(e);
    });

    try {
      let txID = signedTxs[0].txID;
      let signedTxn = signedTxs[0].blob;

      console.log(signedTxn);
      console.log(txID);
      const response = await appService.addSignedTxn(
        signer.address,
        signedTxn,
        txnID
      );

      if (response && response.success) {
        alert("Signed txn added to backend!");
        setValue("txnID", null);
      } else {
        alert("Error from backend: " + JSON.stringify(response));
      }
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  });

  const [optionsTxnId, setOptionsTxnId] = useState<readonly string[]>([]);
  const wSignerAddr = useWatch({ name: "signerAddr", control });
  const wTxnID = useWatch({ name: "txnID", control });
  const [rawTxn, setRawTxn] = useState<RawTxnBackendResponseType | null>();

  useEffect(() => {
    (async () => {
      const resp: TxnIdsBackendResponseType = await appService.getTxnIds(
        wSignerAddr.address
      );

      if (resp && resp.success) {
        setOptionsTxnId(resp.txnids);
      } else {
        setOptionsTxnId([]);
      }
      setValue("txnID", null);
    })();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wSignerAddr]);

  useEffect(() => {
    (async () => {
      if (wTxnID == null) {
        setRawTxn(null);
        return;
      }
      const resp: RawTxnBackendResponseType = await appService.getRawTxn(
        wTxnID
      );
      if (resp && resp.success) {
        setRawTxn(resp);
      } else {
        setRawTxn(null);
      }
    })();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wTxnID]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h2" className={classes.heading}>
          Multi-Sig Txn Signer
        </Typography>
        <Typography component="p" className={classes.paragraph}>
          <strong>Step 1</strong>: Enter the Address of the wallet you will be
          signing the txn with, this address is the address that you have opted
          to use for the multi-sig wallet
        </Typography>
        <Typography component="p" className={classes.paragraph}>
          <strong>Step 2</strong>: Enter the ID that has been passed to you for
          example: DeployContract1, this will query the backend and return you
          the TXN to sign
        </Typography>
        <form className={classes.form} onSubmit={onSubmit}>
          <div>
            <Controller
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  //{...props}
                  {...register("signerAddr", { required: true })}
                  onChange={(event, item) => {
                    onChange(item);
                  }}
                  value={value}
                  id="checkboxes-addrs"
                  options={addrs}
                  freeSolo={true}
                  //disableCloseOnSelect
                  getOptionLabel={(option: AddrType) =>
                    option.address.slice(0, 6) + "..."
                  }
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>{option.address}</li>
                  )}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Addreses from wallet"
                      placeholder="Wallet address"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
              )}
              name="signerAddr"
              control={control}
              rules={{ required: true }}
            />
          </div>
          <div>
            <Controller
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  {...register("txnID", { required: true })}
                  id="txnId"
                  onChange={(event, item) => {
                    onChange(item);
                  }}
                  value={value || null}
                  isOptionEqualToValue={(option, value) => option === value}
                  getOptionLabel={option => option}
                  options={optionsTxnId}
                  filterOptions={ops => ops}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="TnxID"
                      variant="outlined"
                      type="text"
                      margin="normal"
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <Fragment>{params.InputProps.endAdornment}</Fragment>
                        ),
                      }}
                    />
                  )}
                />
              )}
              name="txnID"
              control={control}
              rules={{ required: true }}
            />
          </div>
          {errors.txnID && <div className="error"> Enter txnID</div>}
          {rawTxn && <RawTxnTable txn={rawTxn} appService={appService} />}
          <Button
            className={classes.submit}
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
          >
            Sign Transaction
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default App;
