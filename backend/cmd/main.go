package main

import (
	"fmt"
	"github.com/robfig/cron/v3"
	"multisigdb-svc/db"
	"multisigdb-svc/router"
	"multisigdb-svc/service"
)

func main() {
	var err error
	db.DbConnection, err = db.InitiateDbClient()
	if err != nil {
		fmt.Println("Error in opening the connection")
		return
	}

	broadCastTxnJob := cron.New()
	broadCastTxnJob.AddFunc("@every 1m", service.BroadCastTheSignedTxn)
	broadCastTxnJob.Start()

	r := router.SetupRouter()
	if err = r.Run(":8081"); err != nil {
	}

}
