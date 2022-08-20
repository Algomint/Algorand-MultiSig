// Package docs GENERATED BY SWAG; DO NOT EDIT
// This file was generated by swaggo/swag
package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "termsOfService": "http://algorand.io/terms",
        "contact": {
            "name": "API Support",
            "url": "http://www.algorand.io/support",
            "email": "support@algorand.io"
        },
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/": {
            "get": {
                "description": "Sends CSRF Token to dApp",
                "tags": [
                    "CSRF Token"
                ],
                "summary": "Sends CSRF Token to dApp",
                "operationId": "sendCsrfToken",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/dto.TokenResponse"
                        }
                    }
                }
            }
        },
        "/addrawtxn": {
            "post": {
                "description": "Add a Raw Transaction from dto.RawTxn Model",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "RawTxn"
                ],
                "summary": "Adds a Raw Transaction",
                "parameters": [
                    {
                        "description": "RawTxn",
                        "name": "Body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/dto.RawTxn"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/dto.Response"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/dto.Response"
                        }
                    }
                }
            }
        },
        "/addsignedtxn": {
            "post": {
                "description": "Add a Signed Transaction from dto.SignedTxn Model",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "SignedTxn"
                ],
                "summary": "Adds a Signed Transaction",
                "parameters": [
                    {
                        "description": "SignedTxn",
                        "name": "Body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/dto.SignedTxn"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/dto.Response"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/dto.Response"
                        }
                    }
                }
            }
        },
        "/getallsignedtxn": {
            "get": {
                "description": "Gets all signed transactions in database for a given transaction id (in database)",
                "tags": [
                    "SignedTxn"
                ],
                "summary": "Gets all signed txn in database for a given txn-id",
                "operationId": "getallsignedtxn",
                "parameters": [
                    {
                        "type": "string",
                        "description": "TxnID",
                        "name": "id",
                        "in": "query",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/dto.GetAllSingedTxnResponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/dto.GetAllSingedTxnResponse"
                        }
                    }
                }
            }
        },
        "/getdonetxnid": {
            "get": {
                "description": "Gets broadcasted NetworkId for a given transaction id in database",
                "tags": [
                    "TxnId"
                ],
                "summary": "Gets broadcasted NetworkId for a given txn-id",
                "operationId": "getdonetxnid",
                "parameters": [
                    {
                        "type": "string",
                        "description": "TxnID",
                        "name": "id",
                        "in": "query",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/dto.GetDoneTxnReponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/dto.GetDoneTxnReponse"
                        }
                    }
                }
            }
        },
        "/getrawtxn": {
            "get": {
                "description": "Gets raw transactions in database for a given transaction id (in database)",
                "tags": [
                    "RawTxn"
                ],
                "summary": "Gets RawTxn in database for a given txn-id",
                "operationId": "getrawTxn",
                "parameters": [
                    {
                        "type": "string",
                        "description": "TxnID",
                        "name": "id",
                        "in": "query",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/dto.GetRawTxnResponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/dto.GetRawTxnResponse"
                        }
                    }
                }
            }
        },
        "/getsignedtxn": {
            "get": {
                "description": "Gets latest signed transactions in database for a given transaction id (in database)",
                "tags": [
                    "SignedTxn"
                ],
                "summary": "Gets latest signed txn in database for a given txn-id",
                "operationId": "getsignedtxn",
                "parameters": [
                    {
                        "type": "string",
                        "description": "TxnID",
                        "name": "id",
                        "in": "query",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/dto.GetSingedTxnResponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/dto.GetSingedTxnResponse"
                        }
                    }
                }
            }
        },
        "/gettxnids": {
            "get": {
                "description": "Gets Transactions Ids in database for a given multisignature address",
                "tags": [
                    "TxnId"
                ],
                "summary": "Gets TxnIds in database for a given address",
                "operationId": "gettxnids",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Address",
                        "name": "addr",
                        "in": "query",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/dto.GetTxnIdsResponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/dto.GetRawTxnResponse"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "dto.GetAllSingedTxnResponse": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string"
                },
                "success": {
                    "type": "boolean"
                },
                "txn": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/model.SignedTxn"
                    }
                }
            }
        },
        "dto.GetDoneTxnReponse": {
            "type": "object",
            "properties": {
                "done_txn": {
                    "$ref": "#/definitions/model.DoneTransaction"
                },
                "message": {
                    "type": "string"
                },
                "success": {
                    "type": "boolean"
                }
            }
        },
        "dto.GetRawTxnResponse": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string"
                },
                "signers_addrs": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/model.SignerAddress"
                    }
                },
                "success": {
                    "type": "boolean"
                },
                "txn": {
                    "$ref": "#/definitions/model.RawTxn"
                }
            }
        },
        "dto.GetSingedTxnResponse": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string"
                },
                "success": {
                    "type": "boolean"
                },
                "txn": {
                    "$ref": "#/definitions/model.SignedTxn"
                }
            }
        },
        "dto.GetTxnIdsResponse": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string"
                },
                "success": {
                    "type": "boolean"
                },
                "txnids": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            }
        },
        "dto.RawTxn": {
            "type": "object",
            "required": [
                "number_of_signs_required",
                "signers_addresses",
                "transaction",
                "txn_id",
                "version"
            ],
            "properties": {
                "number_of_signs_required": {
                    "type": "integer"
                },
                "signers_addresses": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "transaction": {
                    "type": "string"
                },
                "txn_id": {
                    "type": "string"
                },
                "version": {
                    "type": "integer"
                }
            }
        },
        "dto.Response": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string"
                },
                "success": {
                    "type": "boolean"
                }
            }
        },
        "dto.SignedTxn": {
            "type": "object",
            "required": [
                "signed_transaction",
                "signer_public_address",
                "txn_id"
            ],
            "properties": {
                "signed_transaction": {
                    "type": "string"
                },
                "signer_public_address": {
                    "type": "string"
                },
                "txn_id": {
                    "type": "string"
                }
            }
        },
        "dto.TokenResponse": {
            "type": "object",
            "properties": {
                "success": {
                    "type": "boolean"
                },
                "token": {
                    "type": "string"
                }
            }
        },
        "model.DoneTransaction": {
            "type": "object",
            "properties": {
                "transaction_id": {
                    "type": "string"
                },
                "txn_id": {
                    "type": "string"
                }
            }
        },
        "model.RawTxn": {
            "type": "object",
            "properties": {
                "number_of_signs_required": {
                    "type": "integer"
                },
                "number_of_signs_total": {
                    "type": "integer"
                },
                "raw_transaction": {
                    "type": "string"
                },
                "signers_threshold": {
                    "type": "integer"
                },
                "status": {
                    "type": "string"
                },
                "txn_id": {
                    "type": "string"
                },
                "version": {
                    "type": "integer"
                }
            }
        },
        "model.SignedTxn": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer"
                },
                "signed_transaction": {
                    "type": "string"
                },
                "signer_public_address": {
                    "type": "string"
                },
                "txn_id": {
                    "type": "string"
                }
            }
        },
        "model.SignerAddress": {
            "type": "object",
            "properties": {
                "sign_txn_id": {
                    "type": "string"
                },
                "signer_address": {
                    "type": "string"
                }
            }
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "1.0",
	Host:             "localhost:8081/",
	BasePath:         "ms-multisig-db/v1",
	Schemes:          []string{},
	Title:            "Multisig Backend API",
	Description:      "Multisig Backend API server.",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
