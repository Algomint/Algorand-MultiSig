function byteArrayToBase64(array: Uint8Array) {
  const buffer = Buffer.from(array);
  return buffer.toString("base64");
}

export default byteArrayToBase64;
