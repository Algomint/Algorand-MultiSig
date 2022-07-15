package client

import (
	"fmt"
	"github.com/algorand/go-algorand-sdk/client/v2/algod"
	"github.com/algorand/go-algorand-sdk/client/v2/common"
	"multisigdb-svc/config"
)

func AlgoRandClient() *algod.Client {
	commonClient, err := common.MakeClient(config.AlgoAddress, config.PsTokenKey, config.PsToken)
	if err != nil {
		fmt.Printf("failed to make common client: %s\n", err)
		return nil
	}
	return (*algod.Client)(commonClient)
}
