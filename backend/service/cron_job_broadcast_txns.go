package service

import (
	"context"
	"fmt"
	"multisigdb-svc/client"
	"multisigdb-svc/config"
	"multisigdb-svc/db_utils"
	"multisigdb-svc/pkg/utils"
)

var logger = utils.GetLoggerInstance()

func BroadCastTheSignedTxn() {
	logger.Info("Crone Job Starting To Scan Signed Transactions")
	rawTxns := db_utils.FindAllTxnWithTxnStatusReady()
	if len(rawTxns) == 0 {
		logger.Info("No Transaction with status ready found")
		return
	}
	logger.Info(fmt.Sprintf("Total %v transactions found with status ready found now broadcasting it to network", len(rawTxns)))

	for _, value := range rawTxns {
		mergeTxns, txnId, err := MergeTransactions(value.TxnId)
		if err != nil {
			return
		}

		algodClient := client.AlgoRandClient()

		_, err = algodClient.SendRawTransaction(mergeTxns).Do(context.Background())
		if err != nil {
			if err.Error() == config.KnownTLSError {
				logger.Error(fmt.Sprintf("Failed to send transaction %s with TLS error trying in next round", txnId))
				return
			}
			db_utils.UpdateStatusOfTransaction(value.TxnId, "FAILED")
			logger.Error(fmt.Sprintf("Failed to send transaction %s with error message: %s", txnId, err))
			return
		}
		go waitForConfirmation(value.TxnId, txnId, algodClient)
	}
}
