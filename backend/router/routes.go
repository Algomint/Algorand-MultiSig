package router

import (
	"github.com/gin-gonic/gin"
	"multisigdb-svc/controller"
	"net/http"
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

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(CORS)

	txn := r.Group("ms-multisig-db/v1")
	{
		txn.POST("addrawtxn", controller.AddRawTxn)
		txn.GET("getrawtxn", controller.GetRawTxn)

		txn.POST("addsignedtxn", controller.AddSingedTxn)
		txn.GET("getallsignedtxn", controller.GetAllSignedTxn)
		txn.GET("getsignedtxn", controller.GetSignedTxn)
	}

	return r
}
