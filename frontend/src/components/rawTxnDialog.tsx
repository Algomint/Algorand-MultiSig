import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@material-ui/core/Button";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import type {mparamsType} from "./multiSigDialog"
import algosdk from "algosdk";

type propsType = {
    open: boolean;
    handleClose: () => void;
    mparams: mparamsType;
    multiSignAddr: string;
    inputCss: string;
    txnId:string;
    rawTxn: algosdk.Transaction|undefined;
  };

const RawTxnDialog = (props: propsType): JSX.Element => {


    return(
<Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"MultiSign Address and mparams"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Raw transaction generated and sent to backend.
        </DialogContentText>
        <ul>
          <li>version: {props.mparams.version}</li>
          <li>threshold: {props.mparams.threshold}</li>
          <li>
            accounts:
            {props.mparams.addrs.map((e) => e.slice(1, 6) + "..., ")}
          </li>
        </ul>
        <p>Multisign address is:</p>
        <p>{props.multiSignAddr}</p>
        <p> Backend transaction id:
        </p>
        <p>
            {props.txnId}
        </p>
        <p>
          Raw transaction
        </p>
          <pre>{JSON.stringify(props.rawTxn, null, 2) }</pre> 
      </DialogContent>
      <DialogActions>
        <Button
          className={props.inputCss}
          endIcon={<NavigateNextIcon />}
          onClick={props.handleClose}
          autoFocus
        >
          Go to Sign transactions
        </Button>
      </DialogActions>
    </Dialog>

    );
}

export default RawTxnDialog