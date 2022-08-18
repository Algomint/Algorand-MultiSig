package router

import (
	"fmt"
	"multisigdb-svc/config"
	"multisigdb-svc/controller"
	"multisigdb-svc/service"
	"net/http"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"

	limiter "github.com/ulule/limiter/v3"
	mgin "github.com/ulule/limiter/v3/drivers/middleware/gin"

	// if redis store use those two imports else comment it
	// sredis "github.com/ulule/limiter/v3/drivers/store/redis"
	// libredis "github.com/go-redis/redis/v8"
	// if memory store use this import otherwise comment it
	"github.com/ulule/limiter/v3/drivers/store/memory"

	"github.com/gorilla/csrf"
	adapter "github.com/gwatts/gin-adapter"
)

func CORS(c *gin.Context) {

	// First, we add the headers with need to enable CORS
	// Make sure to adjust these headers to your needs
	//c.Header("Access-Control-Allow-Origin", "*")
	//c.Header("Access-Control-Allow-Methods", "*")
	//c.Header("Access-Control-Allow-Headers", "*")
	c.Header("Content-Type", "application/json")

	c.Header("Access-Control-Allow-Origin", "http://localhost:3000")
	c.Header("Access-Control-Allow-Credentials", "true")
	c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
	c.Header("Access-Control-Allow-Methods", "POST,HEAD,PATCH, OPTIONS, GET, PUT")

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

func CSRF() gin.HandlerFunc {
	var csrfMd func(http.Handler) http.Handler
	csrfMd = csrf.Protect([]byte(config.CsrfSecret),
		csrf.MaxAge(0), //session only Cookie
		csrf.Secure(true),
		csrf.RequestHeader("X-CSRF-Token"),
		csrf.ErrorHandler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusForbidden)
			w.Write([]byte(fmt.Sprintf(`{"message": "Forbidden -  %s"}`, csrf.FailureReason(r))))
		})),
	)
	return adapter.Wrap(csrfMd)
}

func SetupRouter() (*gin.Engine, error) {
	// setup rate limiter
	rate, err := limiter.NewRateFromFormatted(config.LimiterRate)
	if err != nil {
		return nil, err
	}

	// Redis store code
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

	// Jwt Auth Middleware
	authMiddleware, err := service.AuthMiddleware()

	if err != nil {
		return nil, err
	}
	//login route just sends signtxn to verify 
	r.POST("/login", authMiddleware.LoginHandler)
	auth := r.Group("/auth")
	// Refresh time can be longer than token timeout
	auth.GET("/refresh_token", authMiddleware.RefreshHandler)
	
	txn := r.Group("ms-multisig-db/v1").Use(CSRF()).Use(authMiddleware.MiddlewareFunc())
	{
		txn.GET("/", controller.SendCsrfToken)

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


func helloHandler(c *gin.Context) {
	claims := jwt.ExtractClaims(c) // from auth
	c.JSON(200, gin.H{
		"addrs":   claims[service.IdentityKeyJwt],
	})
}