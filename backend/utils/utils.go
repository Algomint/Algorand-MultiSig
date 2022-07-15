package utils

import (
	b64 "encoding/base64"
	"github.com/goccy/go-json"
)

func Base64Encode(txn []byte) (string, error) {
	data, err := json.Marshal(&txn)
	if err != nil {
		return "", err
	}
	sEnc := b64.StdEncoding.EncodeToString(data)
	return sEnc, nil
}

func Base64Decode(txn string) ([]byte, error) {
	sDec, err := b64.StdEncoding.DecodeString(txn)
	if err != nil {
		return nil, err
	}
	return []byte(sDec), nil
}
