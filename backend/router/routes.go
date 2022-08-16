package router

import (
	"github.com/gin-gonic/gin"
	"multisigdb-svc/config"
	"multisigdb-svc/controller"
	"net/http"

	limiter "github.com/ulule/limiter/v3"
	mgin "github.com/ulule/limiter/v3/drivers/middleware/gin"
	// if redis store use those two imports else comment it
	// sredis "github.com/ulule/limiter/v3/drivers/store/redis"
	// libredis "github.com/go-redis/redis/v8"
	// if memory store use this import otherwise comment it
	"github.com/ulule/limiter/v3/drivers/store/memory"
)

func CORS(c *gin.Context) {

	// First, we add the headers with need to enable CORS
	// Make sure to adjust these headers to your needs
	c.Header("Access-Control-Allow-Origin", "*")
	c.Header("Access-Control-Allow-Methods", "*")
	c.Header("Access-Control-Allow-Headers", "*")
	c.Header("Content-Type", "application/json")

	// Second, we handle the OPTIONS problem
	if c.Request.Method != "OPTIONS" {

		c.Next()

	} else {

		// Everytime we receive an OPTIONS request,
		// we just return an HTTP 200 Status Code
		// Like this, Angular can now do the real
		// request using any other method than OPTIONS
		c.AbortWithStatus(http.StatusOK)
	}
}

func SetupRouter() (*gin.Engine, error) {
	rate, err := limiter.NewRateFromFormatted(config.LimiterRate)
	if err != nil {
		return nil, err
	}

	// Redis store
	// option, err := libredis.ParseURL(config.RedisUrl)
	// if err != nil {
	// 	 return nil, err
	// }
	// client := libredis.NewClient(option)
	//
	// store, err := sredis.NewStoreWithOptions(client, limiter.StoreOptions{
	// 	  Prefix:   config.RedisPrefix + "_limiter",
	// 	  MaxRetry: config.RedisMaxRetry,
	// })
	//
	// if err != nil {
	// 	return nil, err
	// }

	// In memory store
	store := memory.NewStore()

	limiter := mgin.NewMiddleware(limiter.New(store, rate))

	r := gin.Default()
	r.ForwardedByClientIP = true

	r.Use(limiter)
	r.Use(CORS)

	txn := r.Group("ms-multisig-db/v1")
	{
		txn.POST("addrawtxn", controller.AddRawTxn)
		txn.GET("getrawtxn", controller.GetRawTxn)

		txn.POST("addsignedtxn", controller.AddSingedTxn)
		txn.GET("getallsignedtxn", controller.GetAllSignedTxn)
		txn.GET("getsignedtxn", controller.GetSignedTxn)

		txn.GET("gettxnids", controller.GetTxnIdsFromAddr)

		txn.GET("getdonetxnid", controller.GetDoneTxn)
	}

	return r, nil
}
