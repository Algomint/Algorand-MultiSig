package controller

import (
	"github.com/gin-gonic/gin"
	"multisigdb-svc/dto"
	"multisigdb-svc/service"
	"net/http"
)

// AddRawTxn godoc
// @Summary Adds a Raw Transaction
// @Description  Add a Raw Transaction from dto.RawTxn Model
// @Tags         RawTxn
// @Accept       json
// @Produce      json
// @Param        Body body dto.RawTxn true "RawTxn"
// @Success      200  {object}  dto.Response
// @Failure      400  {object}  dto.Response
// @Router       /addrawtxn [post]
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

// AddSignedTxn godoc
// @Summary Adds a Signed Transaction
// @Description  Add a Signed Transaction from dto.SignedTxn Model
// @Tags         SignedTxn
// @Accept       json
// @Produce      json
// @Param        Body body dto.SignedTxn true "SignedTxn"
// @Success      200  {object}  dto.Response
// @Failure      400  {object}  dto.Response
// @Router       /addsignedtxn [post]
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

// GetAllSignedTxn godoc
// @Summary Gets all signed txn in database for a given txn-id
// @Description Gets all signed transactions in database for a given transaction id (in database)
// @ID getallsignedtxn
// @Tags SignedTxn
// @Param id query string true "TxnID"
// @Success 200 {object} dto.GetAllSingedTxnResponse
// @Failure 400 {object} dto.GetAllSingedTxnResponse
// @Router /getallsignedtxn [get]
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

// GetSignedTxn godoc
// @Summary Gets latest signed txn in database for a given txn-id
// @Description Gets latest signed transactions in database for a given transaction id (in database)
// @ID getsignedtxn
// @Tags SignedTxn
// @Param id query string true "TxnID"
// @Success 200 {object} dto.GetSingedTxnResponse
// @Failure 400 {object} dto.GetSingedTxnResponse
// @Router /getsignedtxn [get]
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

// GetRawTxn godoc
// @Summary Gets RawTxn in database for a given txn-id
// @Description Gets raw transactions in database for a given transaction id (in database)
// @ID getrawTxn
// @Tags RawTxn
// @Param id query string true "TxnID"
// @Success 200 {object} dto.GetRawTxnResponse
// @Failure 400 {object} dto.GetRawTxnResponse
// @Router /getrawtxn [get]
func GetRawTxn(ctx *gin.Context) {
	txnId := ctx.Query("id")
	if txnId == "" {
		resp := dto.Response{Success: false, Message: "Failed to process request send valid id"}
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

// GetTxnIdsFromAddr godoc
// @Summary Gets TxnIds in database for a given address
// @Description Gets Transactions Ids in database for a given multisignature address
// @ID gettxnids
// @Tags TxnId
// @Param addr query string true "Address"
// @Success 200 {object} dto.GetTxnIdsResponse
// @Failure 400 {object} dto.GetRawTxnResponse
// @Router /gettxnids [get]
func GetTxnIdsFromAddr(ctx *gin.Context) {
	addr := ctx.Query("addr")

	if addr == "" {
		resp := dto.GetTxnIdsResponse{
			Success: false,
			Message: "Failed to process request send valid addr",
		}
		ctx.JSON(http.StatusBadRequest, resp)
		return
	}

	resp, err := service.GetTxnIdsWithAddr(addr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, resp)
		return
	}

	ctx.JSON(http.StatusOK, resp)
}

// GetDoneTxn godoc
// @Summary Gets broadcasted NetworkId for a given txn-id
// @Description Gets broadcasted NetworkId for a given transaction id in database
// @ID getdonetxnid
// @Tags TxnId
// @Param id query string true "TxnID"
// @Success 200 {object} dto.GetDoneTxnReponse
// @Failure 400 {object} dto.GetDoneTxnReponse
// @Router /getdonetxnid [get]
func GetDoneTxn(ctx *gin.Context) {
	txnId := ctx.Query("id")

	if txnId == "" {
		resp := dto.GetDoneTxnReponse{
			Success: false,
			Message: "Failed to process request send valid id",
		}
		ctx.JSON(http.StatusBadRequest, resp)
		return
	}

	resp, err := service.GetDoneTxn(txnId)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, resp)
		return
	}

	ctx.JSON(http.StatusOK, resp)
}
