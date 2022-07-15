package service

import (
	"context"
	"fmt"
	"github.com/algorand/go-algorand-sdk/client/v2/algod"
	"github.com/algorand/go-algorand-sdk/crypto"
	"multisigdb-svc/db_utils"
	"multisigdb-svc/utils"
)

func MergeTransactions(txnId string) ([]byte, string, error) {
	response, err := db_utils.GetAllSignedTxnOnTxnId(txnId)
	if err != nil {
		return nil, "", err
	}

	var mergedSignedTxns [][]byte
	for index, _ := range response.Txn {
		decodedTxn, err := utils.Base64Decode(response.Txn[index].SignedTransaction)
		if err != nil {
			fmt.Println("Error Found in Decoding the transaction with the error message ", err)
			return nil, "", err
		}
		mergedSignedTxns = append(mergedSignedTxns, decodedTxn)
	}
	txnId, signedTxns, err := crypto.MergeMultisigTransactions(mergedSignedTxns...)
	if err != nil {
		fmt.Println("Error Found in Crypto Merge Multisig Transaction with the error message ", err)
		return nil, "", err
	}
	return signedTxns, txnId, nil
}

func waitForConfirmation(txID string, client *algod.Client) {
	status, err := client.Status().Do(context.Background())
	if err != nil {
		fmt.Printf("error getting algod status: %s\n", err)
		return
	}
	lastRound := status.LastRound
	for {
		pt, _, err := client.PendingTransactionInformation(txID).Do(context.Background())
		if err != nil {
			fmt.Printf("error getting pending transaction: %s\n", err)
			db_utils.UpdateStatusOfTransaction(txID, "DECLINED")
			return
		}
		if pt.ConfirmedRound > 0 {
			fmt.Printf("Transaction confirmed in round %d\n", pt.ConfirmedRound)
			break
		}
		fmt.Printf("Waiting for confirmation...\n")
		lastRound++
		status, err = client.StatusAfterBlock(lastRound).Do(context.Background())
	}
	db_utils.UpdateStatusOfTransactionToDone(txID)
}
