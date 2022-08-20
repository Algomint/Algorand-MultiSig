package service

import (
	"errors"
	"fmt"

	"log"
	"multisigdb-svc/config"
	"multisigdb-svc/utils"
	"time"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
)

type login struct {
	Signtxs []string `json:"signtxns" binding:"required"`
}

var IdentityKeyJwt = "id"

type User struct {
	addresses []string
}

func payloadFunc(data interface{}) jwt.MapClaims {
	if v, ok := data.(*User); ok {
		return jwt.MapClaims{
			IdentityKeyJwt: v.addresses,
		}
	}
	return jwt.MapClaims{}
}

func identityHandler(c *gin.Context) interface{} {
	claims := jwt.ExtractClaims(c)
	addrsi := claims[IdentityKeyJwt].([]interface{})
	addrs := make([]string, len(addrsi))
	for i, v := range addrsi {
		addrs[i] = v.(string)
	}
	return &User{
		addresses: addrs,
	}
}

func authenticator(c *gin.Context) (interface{}, error) {
	var loginVals login
	if err := c.ShouldBind(&loginVals); err != nil {
		logger.Error(fmt.Sprintf("incorrect signtxn error: %s", err.Error()))
		return nil, errors.New("missing signedTxns values")
	}
	signtxs := loginVals.Signtxs
	var user User
	for _, signtxn := range signtxs {
		r, e := utils.CheckSignatureFromB64String(signtxn)
		if e != nil {
			logger.Error(fmt.Sprintf("incorrect signtxn error: %s", e.Error()))
			return nil, errors.New("incorrect signedTxns")
		}
		if r {
			user.addresses = append(user.addresses, signtxn)
		} else {
			return nil, errors.New("incorrect signedTxns")
		}
	}

	if len(user.addresses) > 0 {
		return &user, nil
	}
	logger.Error("incorrect signtxn error: empty signtxn")
	return nil, errors.New("incorrect signedTxns")
}

func authorizator(data interface{}, c *gin.Context) bool {
	if v, ok := data.(*User); ok && len(v.addresses) > 0 {
		return true
	}
	return false
}

func unauthorized(c *gin.Context, code int, message string) {
	c.JSON(code, gin.H{
		"code":    code,
		"message": message,
	})
}

func AuthMiddleware() (*jwt.GinJWTMiddleware, error) {

	// the jwt middleware
	authMiddleware, err := jwt.New(&jwt.GinJWTMiddleware{
		Realm:           config.JwtRealm,
		Key:             []byte(config.JwtSecret),
		Timeout:         config.JwtTimeout,
		MaxRefresh:      config.JwtMaxRefresh,
		IdentityKey:     IdentityKeyJwt,
		PayloadFunc:     payloadFunc,
		IdentityHandler: identityHandler,
		Authenticator:   authenticator,
		Authorizator:    authorizator,
		Unauthorized:    unauthorized,
		TokenLookup:     config.JwtTokenLookup,
		TokenHeadName:   config.JwtTokenHeadName,
		// TimeFunc provides the current time. You can override it to use another time value.
		//This is useful for testing or if your server uses a different time zone than your tokens.
		TimeFunc: time.Now,
	})

	if err != nil {
		log.Fatal("JWT Error:" + err.Error())
		return nil, err
	}
	errInit := authMiddleware.MiddlewareInit()
	if errInit != nil {
		log.Fatal("authMiddleware.MiddlewareInit() Error:" + errInit.Error())
		return nil, errInit
	}

	return authMiddleware, nil
}
