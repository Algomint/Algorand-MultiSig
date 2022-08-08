import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@material-ui/core/Button";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export type mparamsType = {
  version: number;
  threshold: number;
  addrs: string[];
};

type propsType = {
  open: boolean;
  handleClose: () => void;
  mparams: mparamsType;
  multiSignAddr: string;
  inputCss: string;
};

const MultisigDialog = (props: propsType): JSX.Element => {
  async function copyTextToClipboard(text: string) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      //fallback 
      return document.execCommand("copy", true, text);
    }
  }

  return (
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
          Generated multiSign address with:
        </DialogContentText>
        <ul>
          <li>version: {props.mparams.version}</li>
          <li>threshold: {props.mparams.threshold}</li>
          <li>
            accounts:
            {props.mparams.addrs.map(e => e.slice(1, 6) + "..., ")}
          </li>
        </ul>
        <p>Multisign address is:</p>
        <p>{props.multiSignAddr}</p>
        <Button
          className={props.inputCss}
          endIcon={<ContentCopyIcon />}
          onClick={() => copyTextToClipboard(props.multiSignAddr)}
          size="small"
        >
          Copy Multisign Address
        </Button>
        <p>
          Add funds to account using the TestNet Dispenser:
          <a href={"https://testnet.algoexplorer.io/dispenser"}>
            {"https://testnet.algoexplorer.io/dispenser"}
          </a>
        </p>
      </DialogContent>
      <DialogActions>
        <Button
          className={props.inputCss}
          endIcon={<NavigateNextIcon />}
          onClick={props.handleClose}
          autoFocus
        >
          Go to Generate Raw transaction
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MultisigDialog;
