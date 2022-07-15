import React from 'react';
import TextField from '@material-ui/core/TextField';
import buffer from 'buffer';
import { useForm } from 'react-hook-form';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { AppService } from '../services/app.service'
import '../App.css';
import useStyles from '../style';

declare const AlgoSigner: any;

type txnArgs = {
    txnID: string
    signerAddr: string
}

function App() {
    const { register, handleSubmit, formState: { errors } } = useForm<txnArgs>()
    const classes = useStyles();

    const { Buffer } = buffer;
    if (!window.Buffer) window.Buffer = Buffer;


    let account1 = "BBATM3HP22USXHXNKAMYGWQAK4CJFTKQFNTHSFQMDWL6LZGKORYPBDC73I"
    let account2 = "4VCA7W755EM5HBHSH3ZKVGV64MBE7S6OSNZUYGUIF45YX2NMIHWHSKYIEA"

    const mparams = {
        version: 1,
        threshold: 2,
        addrs: [
            account1,
            account2,
        ],
    };

    const onSubmit = handleSubmit(async (data) => {
        alert(JSON.stringify(data))

        const appService = new AppService();

        let txnID = data.txnID;

        const getResponse = await appService.getRawTxn(txnID);
        console.log(getResponse);

        await AlgoSigner.connect()

        let signer = data.signerAddr

        let base64MultisigTx = getResponse.txn.raw_transaction


        console.log(base64MultisigTx);

        let signedTxs = await AlgoSigner.signTxn([
            {
                txn: base64MultisigTx,
                msig: mparams,
                signers: [signer],
            }
        ]);

        let txID = signedTxs[0].txID;
        let signedTxn = signedTxs[0].blob;

        console.log(signedTxn)
        console.log(txID);

        const response = await appService.addSignedTxn(signer, signedTxn, txnID);
        console.log(response);

    })


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Multi-Sig Txn Signer
                </Typography>

                <Typography component="h1" variant="h6">
                    Step 1: Enter the Address of the wallet you will be signing the txn with, this address is the address that you have opted to use for the multi-sig wallet
                </Typography>
                <Typography component="h1" variant="h6">
                    Step 2: Enter the ID that has been passed to you for example: DeployContract1, this will query the backend and return you the TXN to sign
                </Typography>
                <form className={classes.form} onSubmit={onSubmit}>
                    <div>
                        <TextField {...register("signerAddr", { required: true })} name="signerAddr" margin="normal" label="signerAddr to sign" autoFocus variant="outlined" fullWidth type="text" />
                        {
                            errors.signerAddr && <div className="error"> Enter signerAddr</div>
                        }
                    </div>
                    <div>
                        <TextField {...register("txnID", { required: true })} name="txnID" margin="normal" label="txnID to sign" autoFocus variant="outlined" fullWidth type="text" />
                        {
                            errors.txnID && <div className="error"> Enter txnID</div>
                        }
                    </div>

                    <Button className={classes.submit} color="primary" variant="contained" fullWidth type="submit">Sign Transaction</Button>
                </form>
            </div>
        </Container>
    );
}

export default App;