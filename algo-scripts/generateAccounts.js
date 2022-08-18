const algosdk = require("algosdk");
const fmt = {
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  reset: "\x1b[0m",
};

// generate accounts

const numberOfAccounts = 5;

for (let index = 1; index < numberOfAccounts+1; index++) {
  const { sk: sk1, addr: addr1 } = algosdk.generateAccount();
  const mnemonic1 = algosdk.secretKeyToMnemonic(sk1);
  console.log(`
${fmt.bold}${index}:${fmt.reset}
${fmt.dim}Mnemonic:${fmt.reset} ${mnemonic1}
${fmt.dim}Address:${fmt.reset} ${addr1}
${fmt.dim}--------------------${fmt.reset}
`);
}

console.log(`
${fmt.bold}TIP:${fmt.reset} You can send funds to your accounts using the testnet and betanet dispensers listed below:
* https://bank.testnet.algorand.network
* https://bank.betanet.algodev.network/
`);
