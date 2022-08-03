import React from "react";
//import { useEffect } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Alert from "@mui/material/Alert";
import "../App.css";
import useStyles from "../style";
import { useWallet } from "../hooks/walletHook";
import { useNavigate } from "react-router-dom";

function App() {
  const classes = useStyles();
  const auth = useWallet();
  const nav = useNavigate();


  function login() {
    auth.signin(() => {
      nav("/genMulti");
    });
  }

  /* useEffect for automatic signin on app load
  useEffect(() => {
    auth.signin();
    console.log("effect")
    // run once so [] instead of [auth]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  */
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Multi-Sig Txn Signer
        </Typography>

        <Typography component="h1" variant="h6">
          Authenticate using AlgoSigner Wallet
        </Typography>

        <Button
          className={classes.submit}
          color="primary"
          variant="contained"
          fullWidth
          type="button"
          onClick={login}
        >
          Connect to Wallet
        </Button>

        {!auth.authStatus && 
        (
          <Alert severity="error">
            <a href="https://chrome.google.com/webstore/detail/algosigner/kmmolakhbgdlpkjkcjkebenjheonagdm">
              AlgoSigner
            </a>
            &nbsp; connection not found. 
            <p>
            Check extension installation, verify it is
            activated and then click 'Connect to Wallet'.
            </p>
          </Alert>
        )}
      </div>
    </Container>
  );
}

export default App;
