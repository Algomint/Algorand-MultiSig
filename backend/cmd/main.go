package main

import (
	"fmt"
	"multisigdb-svc/config"
	"multisigdb-svc/db"
	"multisigdb-svc/pkg/utils"
	"multisigdb-svc/router"
	"multisigdb-svc/service"
	"os"

	"github.com/robfig/cron/v3"
	"go.uber.org/zap"

	_ "multisigdb-svc/docs"

	"github.com/swaggo/files"
	"github.com/swaggo/gin-swagger"
	docs "multisigdb-svc/docs"
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
	
	//Database
	err = os.MkdirAll(config.DbFolder, os.ModePerm)
	if err != nil {
		logger.Error("Error creating database folder", zap.Error(err))
		return
	}
	db.DbConnection, err = db.InitiateDbClient()
	if err != nil {
		logger.Error("Error in opening the connection with Error Message ", zap.Error(err))
		return
	}
	
	// cron job
	broadCastTxnJob := cron.New()
	broadCastTxnJob.AddFunc(config.CronJobSpec, service.BroadCastTheSignedTxn)
	broadCastTxnJob.Start()

	// api routes
	r, err := router.SetupRouter()
	if err != nil {
		logger.Error("Error while seting up router", zap.Error(err))
	}

	// route for api docs
	docs.SwaggerInfo.Host = config.SwaggerHost
	r.GET("/api-doc/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	port := fmt.Sprintf(":%s", config.BindPort)
	if err = r.Run(port); err != nil {
		logger.Error("Error while binding the port with the error message ", zap.Error(err))
	}

}
