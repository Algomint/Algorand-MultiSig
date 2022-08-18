# algo-multi-sig-manager
This repository contains the backend code for storing Multi sig transaction infor and responsible for broadcasting it to the blockchain once all signs are done

## How To Build the Project
You need executed the following commands.

This command will be executed only once to fetch all the dependencies.<br>
```console
foo@bar:~/backend$ go mod tidy
``` 

To the run the project run <br>
```console
foo@bar:~/backend$ go run cmd/main.go`
```