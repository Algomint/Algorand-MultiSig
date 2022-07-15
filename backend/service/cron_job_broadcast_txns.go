package service

import (
	"context"
	"fmt"
	"multisigdb-svc/client"
	"multisigdb-svc/db_utils"
)

func BroadCastTheSignedTxn() {
	fmt.Println("Crone Job Running looking for signed transactions with all signs done")
	rawTxns := db_utils.FindAllTxnWithTxnStatusReady()
	if len(rawTxns) == 0 {
		fmt.Println("No Transaction with status ready found")
		return
	}
	fmt.Println("Transaction with status ready found now broadcasting it to network")

	for _, value := range rawTxns {
		mergeTxns, txnId, err := MergeTransactions(value.TxnId)
		if err != nil {
			fmt.Sprintf("Error on TxnId : %v with Error Message :%v", value.TxnId, err)
			return
		}

		algodClient := client.AlgoRandClient()
		_, err = algodClient.SendRawTransaction(mergeTxns).Do(context.Background())
		if err != nil {
			fmt.Printf("failed to send transaction: %s\n", err)
			return
		}
		waitForConfirmation(txnId, algodClient)
	}
}
