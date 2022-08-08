package utils

import (
	"errors"
	"fmt"
	"multisigdb-svc/db_utils"
	"multisigdb-svc/pkg/utils"

	"github.com/algorand/go-algorand-sdk/crypto"
	"github.com/algorand/go-algorand-sdk/encoding/msgpack"
	"github.com/algorand/go-algorand-sdk/types"
	"go.uber.org/zap"
)

var logger = utils.GetLoggerInstance()

func ValidateDuplicatePublicAddress(pubAddress, txnId string) bool {
	return db_utils.CheckIfAPubAddressFound(txnId, pubAddress)
}

// Validates received rawTxn agains it's parameters
// return true, nil if valid
// false, error otherwise 
func ValidateRawTxnAgainsParameters(txnId, rawTxnBase64 string, threshold, version uint8, signers []string) (bool, error) {
	rawTxn, err := Base64Decode(rawTxnBase64)

	if err != nil {
		logger.Error("Error Found in Decoding the raw transaction with the error message ", zap.Error(err))
		return false, err
	}
	var unsignedTxRaw types.Transaction
	err = msgpack.Decode(rawTxn, &unsignedTxRaw)
	if err != nil {
		logger.Error("Error Found in Decoding the raw transaction with the error message ", zap.Error(err))
		return false, err
	}
	
	//logger.Info(fmt.Sprintf("Recieved Raw Transaction: %+v.", unsignedTxRaw.Sender))

	if err != nil {
		logger.Error("Error Found retrieving Signers Adrrs ", zap.Error(err))
		return false, err
	}

	if int(threshold) > len(signers) {
		logger.Error(fmt.Sprintf("Recieved a threshold of %d greater than %d total possible signers.", threshold, len(signers)))
		return false, errors.New("threshold size invalid")
	}

	multiSignAddr := unsignedTxRaw.Sender
	var signersAddrs []types.Address
	for _, a := range signers {
		da, err := types.DecodeAddress(a)
		logger.Info(fmt.Sprintf("signers addr: %+v \n", a))
		if err != nil {
			logger.Error("Error Found decoding a Signers Adrr: ", zap.Error(err))
			return false, err
		}
		signersAddrs = append(signersAddrs, da)
	}

	shouldBeMultiSig, err := crypto.MultisigAccountWithParams(version, threshold, signersAddrs)

	if err != nil {
		logger.Error("Error Found creating multisign Address with params ", zap.Error(err))
		return false, err
	}

	shouldBeAddr, err := shouldBeMultiSig.Address()

	if err != nil {
		logger.Error("Error Found creating multisign Address ", zap.Error(err))
		return false, err
	}


	if multiSignAddr != shouldBeAddr {
		logger.Error(fmt.Sprintf("Recieved a multisign address mismatch should be %+v recieved %+v.", multiSignAddr, shouldBeAddr))
		return false, errors.New("Multisign address mismatch")
	}

	return true, nil
}
