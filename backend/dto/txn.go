package dto

type SignedTxn struct {
	SignerPublicAddress string `json:"signer_public_address" binding:"required"`
	SignedTransaction   string `json:"signed_transaction" binding:"required"`
	TxnId               string `json:"txn_id" binding:"required"`
}

type RawTxn struct {
	Transaction           string   `json:"transaction" binding:"required"`
	TxnId                 string   `json:"txn_id" binding:"required"`
	NumberOfSignsRequired int64    `json:"number_of_signs_required" binding:"required"`
	Version               uint8    `json:"version" binding:"required"`
	SignersAddreses       []string `json:"signers_addresses" binding:"required"`
}
