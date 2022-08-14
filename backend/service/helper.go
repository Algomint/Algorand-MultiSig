package service

import (
	"context"
	"fmt"
	"github.com/algorand/go-algorand-sdk/client/v2/algod"
	"github.com/algorand/go-algorand-sdk/crypto"
	"go.uber.org/zap"
	"multisigdb-svc/db_utils"
	"multisigdb-svc/utils"
)

func MergeTransactions(txnId string) ([]byte, string, error) {
	response, err := db_utils.GetAllSignedTxnOnTxnId(txnId)
	if err != nil {
		return nil, "", err
	}

	var mergedSignedTxns [][]byte
	for index := range response.Txn {
		decodedTxn, err := utils.Base64Decode(response.Txn[index].SignedTransaction)
		if err != nil {
			logger.Error("Error Found in Decoding the transaction with the error message ", zap.Error(err))
			return nil, "", err
		}
		mergedSignedTxns = append(mergedSignedTxns, decodedTxn)
	}
	txnId, signedTxns, err := crypto.MergeMultisigTransactions(mergedSignedTxns...)
	if err != nil {
		logger.Error("Error Found in Crypto Merge Multisig Transaction with the error message ", zap.Error(err))
		return nil, "", err
	}
	return signedTxns, txnId, nil
}

func waitForConfirmation(txID, networkTxID string, client *algod.Client) {
	status, err := client.Status().Do(context.Background())
	if err != nil {
		logger.Error(fmt.Sprintf("error getting algod status: %s\n", err))
		return
	}
	lastRound := status.LastRound
	for {
		pt, _, err := client.PendingTransactionInformation(networkTxID).Do(context.Background())
		if err != nil {
			logger.Error(fmt.Sprintf("error getting pending transaction: %s\n", err))
			ok := db_utils.UpdateStatusOfTransaction(txID, "DECLINED")
			if ok != nil {
				logger.Error("Error while updating the status of transaction with the error message :", zap.Error(ok))
			}
			return
		}
		if pt.ConfirmedRound > 0 {
			err := db_utils.AddDoneTxn(txID, networkTxID)
			if err != nil {
				logger.Error("Error adding transaction to done transactions database with error message :", zap.Error(err))
				break
			}
			ok := db_utils.UpdateStatusOfTransaction(txID, "BROADCASTED")
			if ok != nil {
				logger.Error("Error while updating the status of transaction to success with the error message :", zap.Error(ok))
				break
			}
			logger.Info(fmt.Sprintf("Transaction %s confirmed in round %d\n", networkTxID, pt.ConfirmedRound))
			break
		}
		logger.Info("Waiting for confirmation...")
		lastRound++
		status, err = client.StatusAfterBlock(lastRound).Do(context.Background())
	}
}
