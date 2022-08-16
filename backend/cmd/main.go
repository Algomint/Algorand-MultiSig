package main

import (
	"github.com/robfig/cron/v3"
	"go.uber.org/zap"
	"multisigdb-svc/db"
	"multisigdb-svc/pkg/utils"
	"multisigdb-svc/router"
	"multisigdb-svc/service"

	"github.com/swaggo/files"
	"github.com/swaggo/gin-swagger"
	_ "multisigdb-svc/docs"
)

// @title           Multisig Backend API
// @version         1.0
// @description     Multisig Backend API server.
// @termsOfService  http://algorand.io/terms

// @contact.name   API Support
// @contact.url    http://www.algorand.io/support
// @contact.email  support@algorand.io

// @host      localhost:8081/
// @BasePath  ms-multisig-db/v1

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

	// api routes
	r, err := router.SetupRouter()
	if err != nil {
		logger.Error("Error while seting up router", zap.Error(err))
	}

	// route for api docs
	r.GET("/api-doc/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	if err = r.Run(":8081"); err != nil {
		logger.Error("Error while binding the port with the error message ", zap.Error(err))
	}

}
