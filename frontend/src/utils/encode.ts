function byteArrayToBase64(array: Uint8Array) {
  const buff = Buffer.from(array);
  return buff.toString("base64");
}

export default byteArrayToBase64;
