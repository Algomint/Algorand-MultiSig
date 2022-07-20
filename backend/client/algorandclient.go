package client

import (
	"github.com/algorand/go-algorand-sdk/client/v2/algod"
	"github.com/algorand/go-algorand-sdk/client/v2/common"
	"go.uber.org/zap"
	"multisigdb-svc/config"
)

var logger = zap.L()

func AlgoRandClient() *algod.Client {
	commonClient, err := common.MakeClient(config.AlgoAddress, config.PsTokenKey, config.PsToken)
	if err != nil {
		logger.Error("failed to make common client: with the message ", zap.Error(err))
		return nil
	}
	return (*algod.Client)(commonClient)
}
