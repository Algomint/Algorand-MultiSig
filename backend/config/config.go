package config

//TODO:: Mark all of them in viper config
const (
	BindPort    = "8081"
	AlgoAddress = "https://testnet-algorand.api.purestake.io/ps2"
	PsTokenKey  = "X-API-Key"
	PsToken     = "qAMLbrOhmT9ewbvFUkUwD8kOOJ6ifFCz1boJoXyb"
	//TODO::Place it in a separate const directory temporay placed here
	KnownTLSError = "Post \"https://testnet-algorand.api.purestake.io/ps2/v2/transactions\": net/http: TLS handshake timeout"
)
