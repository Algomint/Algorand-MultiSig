import React from "react";
import WalletAuth from "./pages/walletAuth";
import GenerateMultiSignAddr from "./pages/generateMultiSignAddr";
import SignTxn from "./pages/signTxn";
import GenerateRawTxnChooser from "./pages/generateRawTxnChooser";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ProvideAuth, useAuth } from "./hooks/walletHook";
import DenseMenu from "./components/menu";

function App() {
  return (
    <ProvideAuth>
      <Router>
        <DenseMenu />
        <Routes>
          <Route path="/" element={<WalletAuth />} />

          <Route element={<PrivateRoutes />}>
            <Route path="/genMulti" element={<GenerateMultiSignAddr />} />
            <Route path="/genRawTxn" element={<GenerateRawTxnChooser />} />
            <Route path="/signTxn" element={<SignTxn />} />
          </Route>
        </Routes>
      </Router>
    </ProvideAuth>
  );
}

const PrivateRoutes = () => {
  let auth = useAuth();
  return auth.authStatus ? <Outlet /> : <Navigate to="/" />;
};

export default App;
