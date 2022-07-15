const fetch = require('node-fetch');
async function addRawTxn(txid, txn, numSign) {
    const response = await fetch(`http://localhost:8081/ms-multisig-db/v1/addrawtxn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txn_id: txid, transaction: txn, number_of_signs_required: numSign })
    })
    return await response.json();
}

module.exports = addRawTxn;
