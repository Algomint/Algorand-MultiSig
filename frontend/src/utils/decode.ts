
function base64ToArrayBuffer(base64 :string) {
    const buf = Buffer.from(base64, 'base64');
    return buf;
}



export default base64ToArrayBuffer