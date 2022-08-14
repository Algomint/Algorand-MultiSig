package service

import (
	"fmt"
	"multisigdb-svc/db_utils"
	"multisigdb-svc/dto"
	"multisigdb-svc/model"
	"multisigdb-svc/utils"

	"go.uber.org/zap"
)

func CreateRawTransaction(txn dto.RawTxn) (dto.Response, error) {
	logger.Info(fmt.Sprintf("received txn: %+v ", txn))
	signersAddrs := []model.SignerAddress{}

	for _, addr := range txn.SignersAddreses {
		obj := model.SignerAddress{
			SignTxnId:     txn.TxnId,
			SignerAddress: addr,
		}
		signersAddrs = append(signersAddrs, obj)
	}

	isValidRawtxn, err := utils.ValidateRawTxnAgainsParameters(txn.TxnId, txn.Transaction, uint8(txn.NumberOfSignsRequired), txn.Version, txn.SignersAddreses)

	if !isValidRawtxn {
		logger.Error("Error in AddRawTxn with the message : ", zap.Error(err))
		return dto.Response{
			Success: false,
			Message: "Error validation RawTxn " + err.Error(),
		}, err
	}

	rawTxn := model.RawTxn{RawTransaction: txn.Transaction, TxnId: txn.TxnId,
		NumberOfSignsRequired: txn.NumberOfSignsRequired,
		SignersThreshold:      txn.NumberOfSignsRequired,
		NumberOfSignsTotal:    int64(len(txn.SignersAddreses)), Version: txn.Version}
	err = db_utils.AddRawTxn(rawTxn)

	if err != nil {
		logger.Error("Error in AddRawTxn with the message: ", zap.Error(err))
		return dto.Response{
			Success: false,
			Message: "Error adding RawTxn to db:" + err.Error(),
		}, err
	}

	err = db_utils.AddSignersAddrs(signersAddrs)
	if err != nil {
		logger.Error("Error in AddSignersAddrs with the message: ", zap.Error(err))
		return dto.Response{
			Success: false,
			Message: "Error adding signers to db: " + err.Error(),
		}, err
	}

	return dto.Response{Success: true, Message: "Transaction Added"}, nil
}

func CreateSignedTransaction(txn dto.SignedTxn) (dto.Response, error) {

	var response dto.Response
	var err error

	if db_utils.CheckIfATxnExistsAndSignsNeeded(txn.TxnId) == false {
		response.Message = "Transaction already signed or invalid Transaction id"
		response.Success = false
		logger.Error("Error in CheckIfATxnExistsAndSignsNeeded with the message : Transaction already signed or invalid Transaction id")
		return response, fmt.Errorf("Transaction not found")
	}

	if !utils.ValidateDuplicatePublicAddress(txn.SignerPublicAddress, txn.TxnId) {
		logger.Error("Error in utils.ValidateDuplicatePublicAddress with the message : Transaction already signed by this public address")
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
		logger.Error("Error in CheckIfATxnExistsAndSignsNeeded with the message : ", zap.Error(err))

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
		logger.Error("Error in db_utils.GetCurrentNumberOfSignature with the message : ", zap.Error(errMessage))

		response.Message = "Something went wrong while updating RawTxn Table"
		response.Success = false
		return response, err
	}

	if currentSignCount == 0 {
		err = db_utils.UpdateStatusOfTransaction(txn.TxnId, "READY")
		if err != nil {
			logger.Error("Error in db_utils.UpdateStatusOfTransaction with the message : ", zap.Error(err))

			response.Message = "Something went wrong while updating RawTxn Table"
			response.Success = false
			return response, err
		}
	} else {
		err = db_utils.UpdateStatusOfTransaction(txn.TxnId, "PENDING")
		if err != nil {
			logger.Error("Error in db_utils.UpdateStatusOfTransaction with the message : ", zap.Error(err))

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

func GetTxnIdsWithAddr(addr string) (dto.GetTxnIdsResponse, error) {
	return db_utils.GetTxnIdOnAddr(addr)
}

func GetDoneTxn(txnId string) (dto.GetDoneTxnReponse, error) {
	doneTxn, err := db_utils.GetDoneTxn(txnId)

	if err != nil {
		return dto.GetDoneTxnReponse{
			Success: false,
			Message: "Error retreiving done transaction",
		}, err
	}

	return dto.GetDoneTxnReponse{
		Success:  true,
		Message:  "Done Transaction Found",
		DoneTxns: doneTxn,
	}, nil

}
