package model

type DoneTransaction struct {
	TxnId         string `json:"txn_id" gorm:"column:txn_id"`
	TransactionID string `json:"transaction_id" gorm:"column:transaction_id"`
}

func (dt *DoneTransaction) TableName() string {
	return "DoneTransaction"
}
