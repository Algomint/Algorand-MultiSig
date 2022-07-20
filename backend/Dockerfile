FROM golang:1.16.4

ENV GIN_MODE=release
ENV PORT=8081

ADD . /go/src/multisig-svc

WORKDIR /go/src/multisig-svc

RUN go mod download

RUN go build -o bin/multisig-svc cmd/main.go

EXPOSE $PORT
ENTRYPOINT ./bin/multisig-svc
