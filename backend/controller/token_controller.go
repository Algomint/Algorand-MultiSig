package controller

import (
	"multisigdb-svc/dto"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/csrf"
)

// SendCsrfToken godoc
// @Summary Sends CSRF Token to dApp
// @Description Sends CSRF Token to dApp
// @ID sendCsrfToken
// @Tags CSRF Token
// @Success 200 {object} dto.TokenResponse
// @Router / [get]
func SendCsrfToken(ctx *gin.Context) {
	resp :=  dto.TokenResponse{
		Success: true,
		Token:   csrf.Token(ctx.Request),
	}
	ctx.JSON(http.StatusOK, resp)
	return 
}