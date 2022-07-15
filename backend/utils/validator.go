package utils

import "multisigdb-svc/db_utils"

func ValidateDuplicatePublicAddress(pubAddress, txnId string) bool {
	return db_utils.CheckIfAPubAddressFound(txnId, pubAddress)
}
