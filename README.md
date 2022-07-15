# Algorand Multi-Sig Signer

This repo, includes all of the code necessary to facilitate the signing of multi-signature transactions without exposing SK's.


## Set-up guide

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

Now you will have access to the following endpoints (note you will only need the ones with * next to them):
Futher documentation of the following endpoints will be avaible in the backend folder
- http://localhost:8081/ms-multisig-db/v1/addrawtxn *
- http://localhost:8081/ms-multisig-db/v1/getrawtxn?id= *
- http://localhost:8081/ms-multisig-db/v1/addsignedtxn *
- http://localhost:8081/ms-multisig-db/v1/getsignedtxn/?id=
- http://localhost:8081/ms-multisig-db/v1/getallsignedtxn/?id=


### Frontend

```
cd frontend
```
```
npm i or npm install
```
```
npm start
```
After the above commands have been executed you will have the frontend running on localhost:3000/sign