package model

type RawTxn struct {
	RawTransaction        string `json:"raw_transaction" gorm:"column:raw_transaction"`
	TxnId                 string `json:"txn_id" gorm:"column:txn_id"`
	NumberOfSignsRequired int64  `json:"number_of_signs_required" gorm:"column:number_of_signs_required"`
	Status                string `json:"status" gorm:"status"`
}

func (s *RawTxn) TableName() string {
	return "RawTransaction"
}
