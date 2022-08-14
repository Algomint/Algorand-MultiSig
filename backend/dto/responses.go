package dto

import "multisigdb-svc/model"

type Response struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type GetAllSingedTxnResponse struct {
	Success bool              `json:"success"`
	Message string            `json:"message"`
	Txn     []model.SignedTxn `json:"txn"`
}

type GetSingedTxnResponse struct {
	Success bool            `json:"success"`
	Message string          `json:"message"`
	Txn     model.SignedTxn `json:"txn"`
}

type GetRawTxnResponse struct {
	Success      bool                  `json:"success"`
	Message      string                `json:"message"`
	Txn          model.RawTxn          `json:"txn"`
	SignersAddrs []model.SignerAddress `json:"signers_addrs"`
}

type GetRawTxnSignersAddrsResponse struct {
	Success bool                  `json:"success"`
	Message string                `json:"message"`
	Addrs   []model.SignerAddress `json:"signersAddrs"`
}

type GetTxnIdsResponse struct {
	Success bool     `json:"success"`
	Message string   `json:"message"`
	TxnIds  []string `json:"txnids"`
}
