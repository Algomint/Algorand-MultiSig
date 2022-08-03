import React, { useState, useContext, createContext } from "react";

const initCtx = {
  authStatus: false,
  signin: (cb: () => void) => {
    cb();
  },
  signout: (cb: () => void) => {
    cb();
  },
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

  const signin = (cb: () => void) => {
    if (typeof AlgoSigner === "undefined") {
      setAuthStatus(false);
      console.log("AlgoSigner not found");
      return;
    }

    AlgoSigner.connect()
      .then((d: any) => {
        console.log(JSON.stringify(d));
        console.log("connected to AlgoSigner");
        setAuthStatus(true);
        cb();
        //return AlgoSigner;
      })
      .catch((e: Error) => {
        console.error(e);
        return null;
      });
  };

  const signout = (cb: () => void) => {
    setAuthStatus(false);
    cb();
  };



  return {
    authStatus,
    signin,
    signout,
  };
}
