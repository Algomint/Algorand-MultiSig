package main

import (
	"github.com/robfig/cron/v3"
	"go.uber.org/zap"
	"multisigdb-svc/db"
	"multisigdb-svc/pkg/utils"
	"multisigdb-svc/router"
	"multisigdb-svc/service"
)

func main() {
	var err error
	logger := utils.GetLoggerInstance()

	logger.Info("Multi-sig go service starting ...")

	db.DbConnection, err = db.InitiateDbClient()
	if err != nil {
		logger.Error("Error in opening the connection with Error Message ", zap.Error(err))
		return
	}

	broadCastTxnJob := cron.New()
	broadCastTxnJob.AddFunc("@every 1m", service.BroadCastTheSignedTxn)
	broadCastTxnJob.Start()

	r := router.SetupRouter()
	if err = r.Run(":8081"); err != nil {
		logger.Error("Error while binding the port with the error message ", zap.Error(err))
	}

}
