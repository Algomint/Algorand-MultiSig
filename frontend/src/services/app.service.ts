export class AppService {


    public async getTxn(txID: any): Promise<any> {
        const response = await fetch('http://localhost:8081/ms-multisig-db/v1/gettxn/?id=' + txID);
        return await response.json();
    }

    public async getRawTxn(txID: any): Promise<any> {
        const response = await fetch('http://localhost:8081/ms-multisig-db/v1/getrawtxn?id=' + txID);
        return await response.json();
    }
    //change to signed
    public async addSignedTxn(signer: any, txn: any, txid: any) {
        const response = await fetch(`http://localhost:8081/ms-multisig-db/v1/addsignedtxn`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ signer_public_address: signer, signed_transaction: txn, txn_id: txid })
        })
        return await response.json();
    }

    public async addRawTxn(txid: any, txn: any, numSign: any) {
        const response = await fetch(`http://localhost:8081/ms-multisig-db/v1/addrawtxn`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ txn_id: txid, transaction: txn, number_of_signs_required: numSign })
        })
        return await response.json();
    }



}
