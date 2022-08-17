import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { Buffer } from "buffer";
import { useForm } from "react-hook-form";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import "../App.css";
import useStyles from "../style";
import type { mparamsType } from "../components/multiSigDialog";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import initiateAlgodClient, {
  checkMultiSigAddrFunds,
} from "../utils/algodClient";
import { useNavigate } from "react-router-dom";
import algosdk from "algosdk";
import byteArrayToBase64 from "../utils/encode";
import { AppService } from "../services/app.service";
import RawTxnDialog from "../components/rawTxnDialog";
import base64ToArrayBuffer from "../utils/decode";
import { customAlphabet } from "nanoid";

type rawTxnArgs = {
  from: string;
  to: string;
  amount: number;
  note: string;
  txnId: string;
};

function App() {
  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nanoid = customAlphabet(alphabet, 21);
  const nav = useNavigate();
  const [mparams, setMprams] = useState<mparamsType>({
    version: 1,
    threshold: 2,
    addrs: [],
  });

  const [multiSignAddr, setMultiSignAddr] = useState("");

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<rawTxnArgs>({
    mode: "onChange",
    defaultValues: {
      from: "",
      to: "",
      amount: 0,
      note: "Payment note",
      txnId: nanoid(),
    },
  });
  const classes = useStyles();

  useEffect(() => {
    //Get data from localstorage
    let mparams: mparamsType = { version: 1, threshold: 2, addrs: [] };
    const lmparams = localStorage.getItem("mparams");
    if (lmparams) {
      mparams = JSON.parse(lmparams);
    }

    setMprams(mparams);
    let multsig: string = "";
    const lmultsig = localStorage.getItem("multiSignAddr");
    if (lmultsig) {
      multsig = JSON.parse(lmultsig);
    }
    setValue("from", multsig);
    setMultiSignAddr(multsig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [open, setOpen] = useState(false);
  const [txnId, setTxnIdState] = useState("");
  const [rawTxn, setRawTxn] = useState<algosdk.Transaction | undefined>(
    undefined
  );

  //const { Buffer } = buffer;
  if (!window.Buffer) window.Buffer = Buffer;

  const nextIcon = <NavigateNextIcon />;

  async function generateRawTxnFromFormData(data: rawTxnArgs) {
    const algodClient = await initiateAlgodClient();
    const params = await algodClient.getTransactionParams().do();

    setTxnIdState(data.txnId);

    const from = data.from;
    const to = data.to;
    const amount = data.amount;
    const note = new Uint8Array(Buffer.from(data.note, "utf8"));

    const txn = algosdk.makePaymentTxnWithSuggestedParams(
      from,
      to,
      amount,
      undefined,
      note,
      params
    );

    const binaryMultisigTx = txn.toByte();
    const base64MultisigTx = byteArrayToBase64(binaryMultisigTx);
    console.log("base64 Payment rawTxn: " + base64MultisigTx);
    const b = base64ToArrayBuffer(base64MultisigTx);

    const txnRaw = algosdk.decodeUnsignedTransaction(b);
    setRawTxn(txnRaw);

    const appService = new AppService();
    const response = await appService
      .addRawTxn(
        data.txnId,
        base64MultisigTx,
        mparams.threshold,
        mparams.version,
        mparams.addrs
      )
      .catch((e: Error) => {
        alert(
          "Backend error (did you run `go run ./cmd/main.go`?) \n message: " +
            e.message
        );
      });
    console.log(response);
    return response;
  }

  const onSubmit = handleSubmit(async data => {
    const r = await checkMultiSigAddrFunds(data.from);
    if (r) {
      //alert(JSON.stringify(data));
      const resp = await generateRawTxnFromFormData(data);
      if (resp && resp.success) {
        //setTxnIdState(data.txnId);
        handleClickOpen();
      }

      if (resp && resp.success === false) {
        alert("Failed to add rawTxn repsonse: " + JSON.stringify(resp));
      }
    } else {
      alert("Multisig account has not been founded");
    }
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    nav("/signTxn");
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <form className={classes.form} onSubmit={onSubmit}>
          <div>
            <Typography
              component="h1"
              variant="h6"
              className={classes.paragraph}
            >
              <strong>Step 1</strong>: Create NFT asset
            </Typography>
            <TextField
              {...register("from", { required: true })}
              id="from"
              label="Multisgn Addresss"
              type="text"
              variant="outlined"
              margin="normal"
              defaultValue=""
              fullWidth
            />
            <TextField
              {...register("to", {
                required: true,
              })}
              id="to addr"
              label="Address to send founds"
              type="text"
              variant="outlined"
              margin="normal"
              defaultValue=""
              fullWidth
            />
            {errors.to && <p className="error">{errors.to.message}</p>}
            <TextField
              {...register("amount", {
                required: true,
                min: {
                  value: 1,
                  message: "Amount must be 1 or more microAlgos",
                },
                valueAsNumber: true,
              })}
              id="amount"
              label="Amount in microAlgo"
              type="number"
              variant="outlined"
              margin="normal"
              defaultValue=""
              fullWidth
            />
            {errors.amount?.message && (
              <p className="error">{errors.amount?.message}</p>
            )}

            <TextField
              {...register("note", {
                required: true,
                maxLength: {
                  value: 100,
                  message: "Note too long (1000 bytes max)",
                },
              })}
              id="payment note"
              label="Payment note (name, lastname, reference id, ... )"
              type="text"
              variant="outlined"
              margin="normal"
              defaultValue=""
              fullWidth
            />
            {errors.note?.message && (
              <p className="error">{errors.note?.message}</p>
            )}
            <Typography
              component="h1"
              variant="h6"
              className={classes.paragraph}
            >
              <strong>Step 2</strong>: Enter Raw transaction Id (passed to
              backend service)
            </Typography>

            <TextField
              {...register("txnId", { required: true })}
              id="Raw transaction Id"
              label="Raw transaction Id"
              type="text"
              variant="outlined"
              margin="normal"
              defaultValue=""
              fullWidth
            />

            <Button
              className={classes.submit}
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
            >
              Generate Raw Transaction
            </Button>
          </div>
        </form>
        <Button
          className={classes.submit}
          color="primary"
          variant="contained"
          fullWidth
          type="button"
          endIcon={nextIcon}
          onClick={() => nav("/signTxn")}
        >
          Skip to sign transaction
        </Button>
        <RawTxnDialog
          open={open}
          handleClose={handleClose}
          mparams={mparams}
          multiSignAddr={multiSignAddr}
          inputCss={classes.submit}
          txnId={txnId}
          rawTxn={rawTxn}
        />
      </div>
    </Container>
  );
}

export default App;
