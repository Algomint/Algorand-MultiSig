package utils

import (
	"errors"
	"github.com/algorand/go-algorand-sdk/crypto"
	"github.com/algorand/go-algorand-sdk/encoding/msgpack"
	"github.com/algorand/go-algorand-sdk/types"
	"multisigdb-svc/db_utils"
)

func ValidateDuplicatePublicAddress(pubAddress, txnId string) bool {
	return db_utils.CheckIfAPubAddressFound(txnId, pubAddress)
}

// Validates received rawTxn agains it's parameters
// return (true, nil) if valid
// 		  (false, error) otherwise
func ValidateRawTxnAgainsParameters(txnId, rawTxnBase64 string, threshold, version uint8, signers []string) (bool, error) {
	rawTxn, err := Base64Decode(rawTxnBase64)

	if err != nil {
		return false, err
	}
	var unsignedTxRaw types.Transaction
	err = msgpack.Decode(rawTxn, &unsignedTxRaw)
	if err != nil {
		return false, err
	}

	if err != nil {
		return false, err
	}

	if int(threshold) > len(signers) {
		return false, errors.New("threshold size invalid")
	}

	multiSignAddr := unsignedTxRaw.Sender
	var signersAddrs []types.Address
	for _, a := range signers {
		da, err := types.DecodeAddress(a)
		if err != nil {
			return false, err
		}
		signersAddrs = append(signersAddrs, da)
	}

	shouldBeMultiSig, err := crypto.MultisigAccountWithParams(version, threshold, signersAddrs)

	if err != nil {
		return false, err
	}

	shouldBeAddr, err := shouldBeMultiSig.Address()

	if err != nil {
		return false, err
	}

	if multiSignAddr != shouldBeAddr {
		return false, errors.New("Multisign address mismatch")
	}

	return true, nil
}
