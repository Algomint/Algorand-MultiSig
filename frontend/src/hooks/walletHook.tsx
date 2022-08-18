import algosdk from "algosdk";
import React, { useState, useContext, createContext } from "react";
import { AddrType } from "../pages/generateMultiSignAddr";
import { AuthService } from "../services/auth.service";
import initiateAlgodClient from "../utils/algodClient";

const initCtx = {
  authStatus: false,
  authJwt: "",
  signin: (cb: () => void) => {
    cb();
  },
  signout: (cb: () => void) => {
    cb();
  },
  getJwtData: () => {
     return {
     jwt_token: "",
     jwt_expire: "" 
    }
  }
};

const authContext = createContext(initCtx);
declare const AlgoSigner: any;

export function ProvideAuth({ children }: any): JSX.Element {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// useAuth Custom Hook
export const useWallet = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [authStatus, setAuthStatus] = useState(false);
  const [authJwt, setAuthJwt] = useState("");

  const signin = async (cb: () => void) => {
    try {
      if (typeof AlgoSigner === "undefined") {
        setAuthStatus(false);
        console.log("AlgoSigner not found");
        return;
      }

      await AlgoSigner.connect();
      console.log("connected to AlgoSigner");
      const accounts: AddrType[] = await AlgoSigner.accounts({
        ledger: "TestNet",
      });
      const signTxns = await generateSignTxns(accounts);

      const authService = new AuthService();
      const json = await authService.login(signTxns);
      setAuthStatus(true);
      setAuthJwt(json.token);
      setJwtLocalStorage(json.token)
      setJwtExpLocalStorage(json.expire)
      cb();
    } catch (e) {
      console.error("Auth Hook error:");
      console.error(e);
    }
  };

  const signout = (cb: () => void) => {
    setAuthStatus(false);
    setAuthJwt("")
    removeJwtLocalStorage()
    removeJwtExpLocalStorage()   
    cb();
  };

  const getJwtData = () => {
    return {
      jwt_token: getJwtLocalStorage(),
      jwt_expire: getJwtExpLocalStorage()
    }
  }

  return {
    authStatus,
    authJwt,
    signin,
    signout,
    getJwtData
  };
}

async function generateSignTxns(addrs: AddrType[]): Promise<string[]> {
  let signtxns: string[] = [];
  for (let index = 0; index < addrs.length; index++) {
    const addr = addrs[index].address;
    const b64Txn = await generateSignTxn(addr);
    signtxns.push(b64Txn);
  }
  return signtxns;
}

async function generateSignTxn(addrFrom: string) {
  let client = await initiateAlgodClient();
  let suggestedParams = await client.getTransactionParams().do();
  suggestedParams.flatFee = true
  suggestedParams.fee = 0

  // Use the JS SDK to build a Transaction
  let sdkTx = new algosdk.Transaction({
    to: addrFrom,
    from: addrFrom,
    amount: 0,
    ...suggestedParams,
  });

  // Get the binary and base64 encode it
  let binaryTx = sdkTx.toByte();
  let base64Tx = AlgoSigner.encoding.msgpackToBase64(binaryTx);

  let signedTxs: { txID: string; blob: string }[] = await AlgoSigner.signTxn([
    {
      txn: base64Tx,
    },
  ]);

  return signedTxs[0].blob;
}

function setJwtLocalStorage(value: string){
  localStorage.setItem("jwtToken", value)
}

function setJwtExpLocalStorage(value: string){
  localStorage.setItem("jwtTokenExpires", value)
}

function getJwtLocalStorage(): string{
  return localStorage.getItem("jwtToken") || ""
}

function getJwtExpLocalStorage(): string{
  return localStorage.getItem("jwtTokenExpires") || "" 
}

function removeJwtLocalStorage() {
  localStorage.removeItem("jwtToken") 
}

function removeJwtExpLocalStorage() {
  localStorage.removeItem("jwtTokenExpires")  
}
