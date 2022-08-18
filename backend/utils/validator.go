package utils

import (
	"bytes"
	"crypto/ed25519"
	"errors"
	"multisigdb-svc/db_utils"

	"github.com/algorand/go-algorand-sdk/crypto"
	"github.com/algorand/go-algorand-sdk/encoding/msgpack"
	"github.com/algorand/go-algorand-sdk/types"
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

// Validate Signed Txn for Jwt auth
func transactionToBytesToSign(tx types.Transaction) []byte {
	encodedTx := msgpack.Encode(tx)
	var txidPrefix = []byte("TX")
	// Prepend the hashable prefix
	msgParts := [][]byte{txidPrefix, encodedTx}
	return bytes.Join(msgParts, nil)
}

func verifySignature(tx types.Transaction, pk ed25519.PublicKey, sig types.Signature) bool {
	toBeSigned := transactionToBytesToSign(tx)
	return ed25519.Verify(pk, toBeSigned, sig[:])
}

func addrToED25519PublicKey(a types.Address) (pk ed25519.PublicKey) {
	pk = make([]byte, len(a))
	copy(pk, a[:])
	return pk
}

func checkSignature(stx types.SignedTxn) (bool, error) {

	if (stx.Sig != types.Signature{}) {
		if len(stx.Msig.Subsigs) != 0 || stx.Msig.Version != 0 || stx.Msig.Threshold != 0 {
			return false, errors.New("Txn not a single signature - msig is present")
		}
		if !stx.Lsig.Blank() {
			return false, errors.New("Txn not a single signature lsig present")
		}
		pk := addrToED25519PublicKey(stx.Txn.Sender)
		if !verifySignature(stx.Txn, pk, stx.Sig) {
			return false, errors.New("signature does not verify")
		}
		return true, nil
	}
	return false, errors.New("Transaction as no signature")
}

func CheckSignatureFromB64String(stxnStr string) (bool, error) {
	bstxn, err := Base64Decode(stxnStr)
	if err != nil {
		return false, err
	}
	var stx types.SignedTxn
	err = msgpack.Decode(bstxn, &stx)
	if err != nil {
		return false, err
	}
	result, err := checkSignature(stx)
	if err != nil {
		return false, err
	}
	return result, nil
}
