import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import buffer from "buffer";
import { Controller, useForm, useWatch, useFieldArray } from "react-hook-form";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import "../App.css";
import useStyles from "../style";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import algosdk from "algosdk";
import type { mparamsType } from "../components/multiSigDialog";
import DialogMultiSig from "../components/multiSigDialog";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";

declare const AlgoSigner: any;

type AddrType = {
  address: string;
};

type multiAddrArgs = {
  threshold: number;
  totalAddr: number;
  walletAddrs: AddrType[];
  userAddrs: AddrType[];
};

function App() {
  
  const nav = useNavigate();
  
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<multiAddrArgs>({
    mode: "onChange",
    defaultValues: {
      threshold: 2,
      totalAddr: 3,
      walletAddrs: [],
      userAddrs: [],
    },
  });
  const classes = useStyles();

  const [addrs, setAddrs] = useState<AddrType[]>([]);
  const [mparams, setMprams] = useState<mparamsType>({
    version: 1,
    threshold: 2,
    addrs: [],
  });

  const [multiSignAddr, setMultiSignAddr] = useState("");

  const totalAddr = useWatch({
    control,
    name: "totalAddr",
  });

  const walletAddrs = useWatch({
    control,
    name: "walletAddrs",
  });

  const { fields, remove, append } = useFieldArray({
    name: "userAddrs",
    control,
  });

  //const userAddrs = useWatch({ control, name: "userAddrs" });

  useEffect(() => {
    if (fields) {
      const currentProp = totalAddr - walletAddrs.length;
      const previousProp = fields.length;
      if (currentProp > previousProp) {
        for (let i = previousProp; i < currentProp; i++) {
          append({ address: "" });
        }
      } else {
        for (let i = previousProp; i > currentProp; i--) {
          remove(i - 1);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalAddr, walletAddrs]);

  const { Buffer } = buffer;
  if (!window.Buffer) window.Buffer = Buffer;

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const nextIcon = <NavigateNextIcon />;

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

  function generateMultiSignAddrs(threshold: number, addrs: AddrType[]) {
    let accounts: string[] = [];
    addrs.forEach((e: AddrType) => {
      accounts.push(e.address);
    });
    const mparams: mparamsType = {
      version: 1,
      threshold: threshold,
      addrs: accounts,
    };
    setMprams(mparams);

    const multsigaddr = algosdk.multisigAddress(mparams);
    setMultiSignAddr(multsigaddr);
    console.log("Multisig Address: " + multsigaddr);
    console.log("Add funds to account using the TestNet Dispenser: ");
    console.log(
      "https://dispenser.testnet.aws.algodev.network?account=" + multsigaddr
    );
    localStorage.setItem("mparams", JSON.stringify(mparams));
    localStorage.setItem("multiSignAddr", JSON.stringify(multsigaddr));
  }

  const onSubmit = handleSubmit(async (data) => {
    //alert(JSON.stringify(data));
    const addrs: AddrType[] = data.walletAddrs.concat(data.userAddrs);
    generateMultiSignAddrs(data.threshold, addrs);
    handleClickOpen();
  });

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    nav("/genRawTxn");
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Generate Multi sign Address
        </Typography>
        <form className={classes.form} onSubmit={onSubmit}>
          <div>
            <Typography component="h1" variant="h6" className={classes.paragraph}>
            <strong>Step 1</strong>: Choose total of signing addresses
            </Typography>
            <TextField
              {...register("totalAddr", { required: true, min: 1 })}
              id="totalAddr"
              label="Number of signing addresess"
              type="number"
              variant="outlined"
              autoFocus
              margin="normal"
              defaultValue="3"
              InputProps={{ inputProps: { min: 1, max: 99 } }}
              fullWidth
            />
            {errors.totalAddr && (
              <div className="error">
                Enter a number of addresses to add to multisign account
              </div>
            )}
            <Typography component="h1" variant="h6"  className={classes.paragraph}>
              <strong>Step 2</strong>: Choose threshold
            </Typography>
            <TextField
              {...register("threshold", {
                required: true,
                min: 1,
                max: totalAddr,
              })}
              id="totalAddr"
              label="Number of signing addresess"
              type="number"
              variant="outlined"
              autoFocus
              margin="normal"
              InputProps={{ inputProps: { min: 1, max: totalAddr } }}
              fullWidth
            />
            {errors.threshold && (
              <div className="error">
                Enter a number of threshold addresses
              </div>
            )}
            <Typography component="h1" variant="h6" className={classes.paragraph}>
            <strong>Step 3</strong>: Choose up to {totalAddr} signing addresses from AlgoSigner
              Wallet
            </Typography>
            <Controller
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  //{...props}
                  {...register("walletAddrs", { required: true })}
                  onChange={(event, item) => {
                    onChange(item);
                  }}
                  value={value}
                  multiple
                  id="checkboxes-addrs"
                  options={addrs}
                  freeSolo={true}
                  //disableCloseOnSelect
                  getOptionDisabled={(options: AddrType) =>
                    walletAddrs.length >= totalAddr ? true : false
                  }
                  getOptionLabel={(option) =>
                    option.address.slice(1, 6) + "..."
                  }
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        //style={{ marginRight: 12 }}
                        checked={selected}
                      />
                      {option.address}
                    </li>
                  )}
                  renderInput={(params) => (
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
              name="walletAddrs"
              control={control}
              rules={{ required: true }}
            />
            {totalAddr - walletAddrs.length > 0 && (
              <Typography component="h1" variant="h6" className={classes.paragraph}>
                <strong>Step 4</strong>: Enter remaining {totalAddr - walletAddrs.length}{" "}
                addresses manualy
              </Typography>
            )}
            {totalAddr - walletAddrs.length > 0 &&
              fields.map((field, i) => (
                <TextField
                  required
                  label={"Add Addreses to complete " + (i + 1)}
                  placeholder="Wallet address"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  key={field.id}
                  {...register(`userAddrs.${i}.address` as const)}
                />
              ))}

            <Button
              className={classes.submit}
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
            >
              Generate multiSign address
            </Button>
          </div>
        </form>
        <Button
              className={classes.submit}
              color="primary"
              variant="contained"
              onClick={() => nav("/genRawTxn")}
              fullWidth
              type="button"
              endIcon={nextIcon}
            >
              Skip to generate raw transaction
            </Button>
        <DialogMultiSig
          open={open}
          handleClose={handleClose}
          multiSignAddr={multiSignAddr}
          mparams={mparams}
          inputCss={classes.submit}
        />
      </div>
    </Container>
  );
}

export default App;
