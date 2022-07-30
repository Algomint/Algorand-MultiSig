# Algorand Multi-Sig Signer

This repo, includes all of the code necessary to facilitate the signing of multi-signature transactions without exposing SK's.

### Contributors

- [Umar Farooq](https://github.com/UmarFarooq-MP)
- [Ronan Clooney](https://github.com/clooneyr)
- [Owan Hunte](https://github.com/owanhunte)

## Set-up guide

## Design Flow

<img width="791" alt="Screen Shot 2022-07-15 at 5 29 56 pm" src="https://user-images.githubusercontent.com/73086339/179174428-20f708bf-8eaf-4f5a-959a-7fa03e857835.png">

### Backend

```
cd backend
```

```
go mod tidy
```

```
cd cmd
```

```
go run main.go
```

After the above commands have been executed you will have the backend service running on localhost:8081

Now you will have access to the following endpoints (note you will only need the ones with \* next to them):
Futher documentation of the following endpoints will be avaible in the backend folder

- http://localhost:8081/ms-multisig-db/v1/addrawtxn \*
- http://localhost:8081/ms-multisig-db/v1/getrawtxn?id= \*
- http://localhost:8081/ms-multisig-db/v1/addsignedtxn \*
- http://localhost:8081/ms-multisig-db/v1/getsignedtxn/?id=
- http://localhost:8081/ms-multisig-db/v1/getallsignedtxn/?id=

### Frontend

```
cd frontend
```

```
npm i or npm install
```

head to utils/algodClient.ts and update the X-API-Key key-pair with your purestake api key.

```
npm start
```

After the above commands have been executed you will have the frontend running on localhost:3000

### AlgorandSDK scripts

In this folder you are able to use the provided template to construct the TXN's you would like to be send to the backend to be signed.

```
cd algo-scripts
```

```
npm i or npm install
```

Create a .env file and store your purestake api in the following format

```
PURESTAKE_API_TOKEN='example'
```
