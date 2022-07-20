package service

import (
	"context"
	"fmt"
	"multisigdb-svc/client"
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
			logger.Error(fmt.Sprintf("Failed to send transaction with error message: %s\n", err))
			return
		}
		waitForConfirmation(txnId, algodClient)
	}
}
