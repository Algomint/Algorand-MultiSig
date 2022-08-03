import React from 'react';
import WalletAuth from './pages/walletAuth'
import GenerateMultiSignAddr from './pages/generateMultiSignAddr'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet
} from "react-router-dom";
import {ProvideAuth, useWallet} from "./hooks/walletHook"
import DenseMenu from './components/menu';

import SignTxn from "./pages/signTxn";

function App() {
  return (
    <ProvideAuth>
    <Router>
    <DenseMenu />
      <Routes>
        <Route path="/" element={<WalletAuth />} />
        
        <Route element={<PrivateRoutes />}>
        <Route path="/genMulti" element={<GenerateMultiSignAddr  />} />
        <Route path="/genRawTxn" element={<GenerateMultiSignAddr  />} />
        <Route path="/signTxn" element={<SignTxn />} />
        </Route>
      
      
      </Routes>
    </Router>
    </ProvideAuth>
  );
}

<<<<<<< HEAD
const PrivateRoutes = () => {
  let auth = useWallet()
return (
    auth.authStatus ? <Outlet/> : <Navigate to='/'/>
  )
}


export default App;
=======
export default App;
>>>>>>> c2651c764c22240f5502e3fdcc705522b0e1e485
