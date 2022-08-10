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

type rawTxnArgs = {
  creator: string;
  defaultFrozen: boolean;
  unitName: string;
  assetName: string;
  assetURL: string;
  note: string;
  manager: string;
  reserve: string;
  freeze: string;
  clawback: string;
  assetMetadataHash: string;
  total: number;
  decimals: number;
  txnId: string;
};

function App() {
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
      creator: "",
      defaultFrozen: false,
      unitName: "NFT test",
      assetName: "NFT test",
      assetURL: "https://www.algomint.io/",
      note: "NFT note",
      manager: "",
      reserve: "",
      freeze: "",
      clawback: "",
      assetMetadataHash: "",
      total: 1,
      decimals: 0,
      txnId: "txn-id",
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
    setValue("creator", multsig);
    setValue("manager", multsig);
    setValue("reserve", multsig);
    setValue("freeze", multsig);
    setValue("clawback", multsig);

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

  //const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  //const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const nextIcon = <NavigateNextIcon />;

  async function generateRawTxnFromFormData(data: rawTxnArgs) {
    const algodClient = await initiateAlgodClient();
    const params = await algodClient.getTransactionParams().do();

    setTxnIdState(data.txnId);

    const creator = data.creator;
    const defaultFrozen = data.defaultFrozen;
    const unitName = data.unitName;
    const assetName = data.assetName;
    const assetURL = data.assetURL;
    const note = new Uint8Array(Buffer.from(data.note, "utf8"));
    const manager = data.manager;
    const reserve = data.reserve;
    const freeze = data.freeze;
    const clawback = data.clawback;
    const assetMetadataHash = data.assetMetadataHash;
    const total = data.total;
    const decimals = data.decimals;

    const txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
      creator,
      note,
      total,
      decimals,
      defaultFrozen,
      manager,
      reserve,
      freeze,
      clawback,
      unitName,
      assetName,
      assetURL,
      assetMetadataHash,
      params
    );

    const binaryMultisigTx = txn.toByte();
    const base64MultisigTx = byteArrayToBase64(binaryMultisigTx);
    console.log("base64 rawTxn: " + base64MultisigTx);
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
    const r = await checkMultiSigAddrFunds(data.creator);
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
        <Typography component="h1" variant="h5">
          Generate Raw Transaction
        </Typography>
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
              {...register("creator", { required: true })}
              id="creator"
              label="Creator addresss"
              type="text"
              variant="outlined"
              autoFocus
              margin="normal"
              defaultValue=""
              fullWidth
            />
            <TextField
              {...register("assetName", {
                required: true,
                maxLength: {
                  value: 32,
                  message: "Asset Name too long (32 bytes max)",
                },
              })}
              id="asset name"
              label="NFT asset name"
              type="text"
              variant="outlined"
              autoFocus
              margin="normal"
              defaultValue=""
              fullWidth
            />
            {errors.assetName?.message && (
              <p className="error">{errors.assetName?.message}</p>
            )}
            <TextField
              {...register("unitName", {
                required: true,
                maxLength: {
                  value: 8,
                  message: "Unit Name too long (8 bytes max)",
                },
              })}
              id="unit name"
              label="NFT unit name"
              type="text"
              variant="outlined"
              autoFocus
              margin="normal"
              defaultValue=""
              fullWidth
            />
            {errors.unitName?.message && (
              <p className="error">{errors.unitName?.message}</p>
            )}
            <TextField
              {...register("assetURL", {
                required: true,
                maxLength: {
                  value: 96,
                  message: "Asset URL too long (96 bytes max)",
                },
              })}
              id="asset url"
              label="NFT asset url"
              type="text"
              variant="outlined"
              autoFocus
              margin="normal"
              defaultValue=""
              fullWidth
            />
            {errors.assetURL?.message && (
              <p className="error">{errors.assetURL?.message}</p>
            )}

            <TextField
              {...register("note", {
                required: true,
                maxLength: {
                  value: 100,
                  message: "Note too long (1000 bytes max)",
                },
              })}
              id="nft note"
              label="NFT note"
              type="text"
              variant="outlined"
              autoFocus
              margin="normal"
              defaultValue=""
              fullWidth
            />
            {errors.note?.message && (
              <p className="error">{errors.note?.message}</p>
            )}

            <TextField
              {...register("manager", { required: true })}
              id="nft manager"
              label="NFT manager"
              type="text"
              variant="outlined"
              autoFocus
              margin="normal"
              defaultValue=""
              fullWidth
            />
            <TextField
              {...register("reserve", { required: true })}
              id="nft reserve"
              label="NFT reserve"
              type="text"
              variant="outlined"
              autoFocus
              margin="normal"
              defaultValue=""
              fullWidth
            />
            <TextField
              {...register("clawback", { required: true })}
              id="nft clawback"
              label="NFT clawback"
              type="text"
              variant="outlined"
              autoFocus
              margin="normal"
              defaultValue=""
              fullWidth
            />
            <TextField
              {...register("freeze", { required: true })}
              id="nft freeze"
              label="NFT freeze"
              type="text"
              variant="outlined"
              autoFocus
              margin="normal"
              defaultValue=""
              fullWidth
            />
            <TextField
              {...register("assetMetadataHash")}
              id="nft Metadata hash"
              label="NFT Metadata Hash"
              type="text"
              variant="outlined"
              autoFocus
              margin="normal"
              defaultValue=""
              fullWidth
            />
            <TextField
              {...register("total", {
                required: true,
                min: 1,
                valueAsNumber: true,
              })}
              id="number of nft"
              label="Number of NFT"
              type="number"
              variant="outlined"
              autoFocus
              margin="normal"
              defaultValue=""
              fullWidth
            />
            <TextField
              {...register("decimals", {
                required: true,
                min: 0,
                valueAsNumber: true,
              })}
              id="nft decimals"
              label="NFT decimals"
              type="number"
              variant="outlined"
              autoFocus
              margin="normal"
              defaultValue=""
              fullWidth
            />

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
              autoFocus
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
