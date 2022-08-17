import {
  RawTxnBackendResponseType,
  TokenResponseType,
  TransactionNetworkIdType,
} from "./../models/apiModels";

export class AppService {
  private static readonly endpoint = "http://localhost:8081";

  private static async getToken(): Promise<string> {
    const response = await fetch(AppService.endpoint + `/ms-multisig-db/v1/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const json: TokenResponseType = await response.json();
    return json.token;
  }

  public async getRawTxn(txID: string): Promise<RawTxnBackendResponseType> {
    const response = await fetch(
      AppService.endpoint + `/ms-multisig-db/v1/getrawtxn?id=` + txID,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    return await response.json();
  }
  //change to signed
  public async addSignedTxn(signer: any, txn: any, txid: any) {
    const token = await AppService.getToken();
    const response = await fetch(
      AppService.endpoint + `/ms-multisig-db/v1/addsignedtxn`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": token,
        },
        credentials: "include",
        body: JSON.stringify({
          signer_public_address: signer,
          signed_transaction: txn,
          txn_id: txid,
        }),
      }
    );
    return await response.json();
  }

  public async addRawTxn(
    txid: string,
    txn: string,
    numSign: number,
    version: number,
    addrs: string[]
  ) {
    const token = await AppService.getToken();
    const response = await fetch(
      AppService.endpoint + `/ms-multisig-db/v1/addrawtxn`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": token,
        },
        credentials: "include",
        body: JSON.stringify({
          txn_id: txid,
          transaction: txn,
          number_of_signs_required: Number(numSign),
          signers_addresses: addrs,
          version: version,
        }),
      }
    );
    return await response.json();
  }

  public async getTxnIds(addr: string) {
    const response = await fetch(
      AppService.endpoint + `/ms-multisig-db/v1/gettxnids?addr=` + addr,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    return await response.json();
  }

  public async getTransactionNetworkId(
    txnid: string
  ): Promise<TransactionNetworkIdType> {
    const response = await fetch(
      AppService.endpoint + `/ms-multisig-db/v1/getdonetxnid?id=` + txnid,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    return await response.json();
  }
}
