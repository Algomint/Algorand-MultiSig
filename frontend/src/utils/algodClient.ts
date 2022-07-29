import algosdk from "algosdk";

async function initiateAlgodClient() {
  const baseServer = "https://testnet-algorand.api.purestake.io/ps2";
  const port = "";
  const token = { "X-API-Key": "ERJa19DtyE462CXdcoREb3mt9RQGEeM22i5CKXhz" };

  const algodClient = new algosdk.Algodv2(token, baseServer, port);

  return algodClient;
}

export default initiateAlgodClient;
