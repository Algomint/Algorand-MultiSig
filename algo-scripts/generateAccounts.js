const algosdk = require("algosdk");
const {promises: fs} = require("fs");
const filePath = "./addresses.txt";

async function write(data){
  await fs.appendFile(filePath, data, (err) => {
    if (err) {
      console.error(err);
    }
});
}

// generate accounts
const numberOfAccounts = 5;
(async () => {
for (let index = 1; index < numberOfAccounts + 1; index++) {
  const { sk: sk1, addr: addr1 } = algosdk.generateAccount();
  const mnemonic1 = algosdk.secretKeyToMnemonic(sk1);
  const data = `${index}:
  Mnemonic: ${mnemonic1}
  Address: ${addr1}
  --------------------\n`;
  console.log(data);
  await write(data)
}

const end = `
TIP: You can send funds to your accounts using the testnet and betanet dispensers listed below:
* https://bank.testnet.algorand.network
* https://bank.betanet.algodev.network/
`
console.log(end);
await write(end);
})();