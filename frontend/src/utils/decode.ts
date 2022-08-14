import algosdk from "algosdk";

function base64ToArrayBuffer(base64: string) {
  const buf = Buffer.from(base64, "base64");
  return buf;
}

export function decodeBase64RawTxnToTransaction(
  base64RawTxn: string
): algosdk.Transaction {
  const b = base64ToArrayBuffer(base64RawTxn);
  return algosdk.decodeUnsignedTransaction(b);
}

export default base64ToArrayBuffer;
