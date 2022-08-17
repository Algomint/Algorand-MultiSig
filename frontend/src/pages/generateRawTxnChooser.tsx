import * as React from "react";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import useStyles from "../style";
import Typography from "@material-ui/core/Typography";
import { Button } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useState } from "react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import GenerateRawTxnNFT from "./generateRawTxnNFT";
import GenerateRawTxnPayment from "./generateRawTxnPayment";
import { useNavigate } from "react-router-dom";

function App() {
  const classes = useStyles();
  const nav = useNavigate();
  const nextIcon = <NavigateNextIcon />;
  const [selected, setSelected] = useState("");

  function handleClick(value: string) {
    setSelected(value);
  }
  function GetSelectedAsset() {
    let component: ReactJSXElement;
    switch (selected) {
      case "NFT":
        component = <GenerateRawTxnNFT />;
        break;
      case "PAY":
        component = <GenerateRawTxnPayment />;
        break;

      default:
        component = <></>;
        break;
    }

    return component;
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Generate Raw Transaction
        </Typography>
        <Typography component="h1" variant="h6" className={classes.paragraph}>
          <strong>Choose Asset type</strong>
        </Typography>
        <Button
          className={classes.submit}
          sx={{ mt: 2 }}
          color="primary"
          variant="contained"
          fullWidth
          type="button"
          endIcon={nextIcon}
          onClick={() => {
            handleClick("NFT");
          }}
        >
          NFT Asset
        </Button>
        <Button
          className={classes.submit}
          sx={{ mt: 2 }}
          color="primary"
          variant="contained"
          fullWidth
          type="button"
          endIcon={nextIcon}
          onClick={() => {
            handleClick("PAY");
          }}
        >
          Payment Asset
        </Button>
        <Button
          className={classes.submit}
          sx={{ mt: 2 }}
          color="primary"
          variant="contained"
          fullWidth
          type="button"
          endIcon={nextIcon}
          onClick={() => nav("/signTxn")}
        >
          Skip to to Sign transactions
        </Button>
      </div>
      <GetSelectedAsset />
    </Container>
  );
}

export default App;
