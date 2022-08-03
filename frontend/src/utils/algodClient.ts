import algosdk from "algosdk";

async function initiateAlgodClient() {
<<<<<<< HEAD
    const baseServer = 'https://testnet-algorand.api.purestake.io/ps2'
    const port = '';
    const token = { 'X-API-Key': 'qAMLbrOhmT9ewbvFUkUwD8kOOJ6ifFCz1boJoXyb' };
=======
  const baseServer = "https://testnet-algorand.api.purestake.io/ps2";
  const port = "";
  const token = { "X-API-Key": "ERJa19DtyE462CXdcoREb3mt9RQGEeM22i5CKXhz" };
>>>>>>> c2651c764c22240f5502e3fdcc705522b0e1e485

  const algodClient = new algosdk.Algodv2(token, baseServer, port);

  return algodClient;
}

<<<<<<< HEAD

export default initiateAlgodClient
=======
export default initiateAlgodClient;
>>>>>>> c2651c764c22240f5502e3fdcc705522b0e1e485
