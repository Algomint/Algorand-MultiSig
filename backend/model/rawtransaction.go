package model

type RawTxn struct {
	RawTransaction        string `json:"raw_transaction" gorm:"column:raw_transaction"`
	TxnId                 string `json:"txn_id" gorm:"column:txn_id"`
	NumberOfSignsRequired int64  `json:"number_of_signs_required" gorm:"column:number_of_signs_required"`
	SignersThreshold      int64  `json:"signers_threshold" gorm:"column:signers_threshold"`
	NumberOfSignsTotal    int64  `json:"number_of_signs_total" gorm:"column:number_of_signs_total"`
	Version               uint8  `json:"version" gorm:"column:version"`
	Status                string `json:"status" gorm:"status"`
}

type SignerAddress struct {
	SignTxnId     string `json:"sign_txn_id" gorm:"column:sign_txn_id"`
	SignerAddress string `json:"signer_address" gorm:"column:signer_address"`
}

func (s *RawTxn) TableName() string {
	return "RawTransaction"
}

func (a *SignerAddress) TableName() string {
	return "SignerAddress"
}
