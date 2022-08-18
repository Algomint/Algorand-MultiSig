# Algo-Scripts

```console
$ cd algo-scripts
$ npm i or npm install
```

Create a .env file and store your purestake api in the following format

```
PURESTAKE_API_TOKEN='example'
```

Some scripts to use help you use frontend.
## index.js
Generates a Unsigned RawTxn multsign NFT asset encoded base64.
You should use frontend app to generate this.
```console
foo@bar:~/algo-scripts$ node ./index.js
-----RawTxn base64 -----
iKRhcGFyiK (...) beztdWwx4akdHlwZaRhY2Zn
-----txtID-----
test-id-txn
-----numSign-----
2

```

## generateAccounts.js

Generates a list of Algorand accounts (5 by default) .
Outputs mnemonics and public addresses to console and ./addresses.txt file
```console
foo@bar:~/algo-scripts$ node ./generateAccounts.js
1:
  Mnemonic:  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx 
  Address: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  --------------------
  (... More ...)
  --------------------
  5:
   Mnemonic:  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx  xxxx 
  Address: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  --------------------
  TIP: You can send funds to your accounts using the testnet and betanet dispensers listed below:
* https://bank.testnet.algorand.network
* https://bank.betanet.algodev.network/
```

Do not forget send funds to them !

In ALgorand blockchain any transaction that leaves the account with less than 100 000 microAlgos = 0.1 Algos will be rejected.