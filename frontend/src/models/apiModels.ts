export type rawTxnType = {
  raw_transaction: string;
  txn_id: string;
  number_of_signs_required: number;
  signers_threshold: number;
  number_of_signs_total: number;
  version: number;
  status: string;
};

export type signersAddrsType = {
  sign_txn_id: string;
  signer_address: string;
};

export type RawTxnBackendResponseType = {
  success: boolean;
  message: string;
  txn: rawTxnType;
  signers_addrs: signersAddrsType[];
};

export type TransactionNetworkIdType = {
  success: boolean;
  message: string;
  done_txn: {
    txn_id: string;
    transaction_id: string;
  };
};

export type TokenResponse = {
  success: boolean;
  token: string;
}
