import algosdk from "algosdk";

async function initiateAlgodClient() {
    const baseServer = 'https://testnet-algorand.api.purestake.io/ps2'
    const port = '';
    const token = { 'X-API-Key': 'qAMLbrOhmT9ewbvFUkUwD8kOOJ6ifFCz1boJoXyb' };

  const algodClient = new algosdk.Algodv2(token, baseServer, port);

  return algodClient;
}

export default initiateAlgodClient;
