import React from "react";
import SignTxn from "./pages/signTxn";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignTxn />} />
      </Routes>
    </Router>
  );
}

export default App;
