package config

//TODO:: Mark all of them in viper config
const (
	BindPort    = "8081"
	AlgoAddress = "https://testnet-algorand.api.purestake.io/ps2"
	PsTokenKey  = "X-API-Key"
	PsToken     = "zBal8Ihbnj8Oik2HW8CddU728zMofGk9LjHM32ii"
	//TODO::Place it in a separate const directory temporay placed here
	KnownTLSError = "Post \"https://testnet-algorand.api.purestake.io/ps2/v2/transactions\": net/http: TLS handshake timeout"
)
