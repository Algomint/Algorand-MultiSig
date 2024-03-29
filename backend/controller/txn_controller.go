package controller

import (
	"github.com/gin-gonic/gin"
	"multisigdb-svc/dto"
	"multisigdb-svc/service"
	"net/http"
)

func AddRawTxn(ctx *gin.Context) {
	var rawTxn dto.RawTxn
	validateError := ctx.BindJSON(&rawTxn)
	if validateError != nil {
		resp := dto.Response{Success: false, Message: "Failed to process request send the valid data"}
		ctx.JSON(http.StatusBadRequest, resp)
		return
	}

	resp, err := service.CreateRawTransaction(rawTxn)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, resp)
		return
	}
	ctx.JSON(http.StatusOK, resp)
}

func AddSingedTxn(ctx *gin.Context) {
	var signedTxn dto.SignedTxn

	validateError := ctx.BindJSON(&signedTxn)
	if validateError != nil {
		resp := dto.Response{Success: false, Message: "Failed to process request send the valid data"}
		ctx.JSON(http.StatusBadRequest, resp)
		return
	}

	resp, err := service.CreateSignedTransaction(signedTxn)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, resp)
		return
	}
	ctx.JSON(http.StatusOK, resp)
}

func GetAllSignedTxn(ctx *gin.Context) {
	txnId := ctx.Query("id")
	if txnId == "" {
		resp := dto.Response{Success: false, Message: "Failed to process request send the valid data"}
		ctx.JSON(http.StatusBadRequest, resp)
		return
	}

	resp, err := service.GetAllSignedTransaction(txnId)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, resp)
		return
	}

	ctx.JSON(http.StatusOK, resp)
}

func GetSignedTxn(ctx *gin.Context) {
	txnId := ctx.Query("id")
	if txnId == "" {
		resp := dto.Response{Success: false, Message: "Failed to process request send the valid data"}
		ctx.JSON(http.StatusBadRequest, resp)
		return
	}

	resp, err := service.GetSignedTransaction(txnId)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, resp)
		return
	}

	ctx.JSON(http.StatusOK, resp)

}

func GetRawTxn(ctx *gin.Context) {
	txnId := ctx.Query("id")
	if txnId == "" {
		resp := dto.Response{Success: false, Message: "Failed to process request send the valid data"}
		ctx.JSON(http.StatusBadRequest, resp)
		return
	}

	resp, err := service.GetRawTransaction(txnId)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, resp)
		return
	}

	ctx.JSON(http.StatusOK, resp)
}
