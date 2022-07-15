package service

import (
	"fmt"
	"multisigdb-svc/db_utils"
	"multisigdb-svc/dto"
	"multisigdb-svc/model"
	"multisigdb-svc/utils"
)

func CreateRawTransaction(txn dto.RawTxn) (dto.Response, error) {

	rawTxn := model.RawTxn{RawTransaction: txn.Transaction, TxnId: txn.TxnId, NumberOfSignsRequired: txn.NumberOfSignsRequired}

	err := db_utils.AddRawTxn(rawTxn)
	if err != nil {
		return dto.Response{}, err
	}

	return dto.Response{Success: true, Message: "Transaction Added"}, nil

}

func CreateSignedTransaction(txn dto.SignedTxn) (dto.Response, error) {

	var response dto.Response
	var err error

	if db_utils.CheckIfATxnExistsAndSignsNeeded(txn.TxnId) == false {
		response.Message = "Transaction already signed or invalid Transaction id"
		response.Success = false
		return response, fmt.Errorf("Transaction not found")
	}

	if !utils.ValidateDuplicatePublicAddress(txn.SignerPublicAddress, txn.TxnId) {
		response.Message = "Transaction already signed by this public address"
		response.Success = false
		return response, fmt.Errorf("Transaction not found")
	}

	signedTxn := model.SignedTxn{
		SignedTransaction:   txn.SignedTransaction,
		TxnId:               txn.TxnId,
		SignerPublicAddress: txn.SignerPublicAddress,
	}

	err = db_utils.AddSignedTxn(signedTxn)
	if err != nil {
		response.Message = err.Error()
		response.Success = false
		return response, err
	}

	if db_utils.UpdateNumberOfSignsRequired(txn.TxnId) == false {
		response.Message = "Something went wrong while updating RawTxn Table"
		response.Success = false
		return response, err
	}

	currentSignCount, errMessage := db_utils.GetCurrentNumberOfSignature(txn.TxnId)
	if errMessage != nil {
		response.Message = "Something went wrong while updating RawTxn Table"
		response.Success = false
		return response, err
	}

	if currentSignCount == 0 {
		err = db_utils.UpdateStatusOfTransaction(txn.TxnId, "READY")
		if err != nil {
			response.Message = "Something went wrong while updating RawTxn Table"
			response.Success = false
			return response, err
		}
	} else {
		err = db_utils.UpdateStatusOfTransaction(txn.TxnId, "PENDING")
		if err != nil {
			response.Message = "Something went wrong while updating RawTxn Table"
			response.Success = false
			return response, err
		}
	}
	response.Message = "Signed Transaction Added"
	response.Success = true
	return response, nil
}

func GetAllSignedTransaction(txnId string) (dto.GetAllSingedTxnResponse, error) {
	return db_utils.GetAllSignedTxnOnTxnId(txnId)
}

func GetSignedTransaction(txnId string) (dto.GetSingedTxnResponse, error) {
	return db_utils.GetTxnOnTxnId(txnId)
}

func GetRawTransaction(txnId string) (dto.GetRawTxnResponse, error) {
	return db_utils.GetRawTxnOnTxnId(txnId)
}
