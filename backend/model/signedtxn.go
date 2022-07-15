package model

type SignedTxn struct {
	Id                  int64  `json:"id" gorm:"column:id"`
	SignerPublicAddress string `json:"signer_public_address" gorm:"column:signer_public_address"`
	SignedTransaction   string `json:"signed_transaction" gorm:"column:signed_transaction"`
	TxnId               string `json:"txn_id" gorm:"column:txn_id"`
}

func (s *SignedTxn) TableName() string {
	return "SignedTxn"
}
