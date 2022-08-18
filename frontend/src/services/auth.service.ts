type JwtAuthResponse = {
  code: number;
  expire: string;
  token: string;
};

export class AuthService {
  private static readonly endpoint = "http://localhost:8081";

  public async login(signTxns : string[]): Promise<JwtAuthResponse> {
    const response = await fetch(
      AuthService.endpoint + `/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          signtxns: signTxns,
        }),
      }
    );

    const json: JwtAuthResponse = await response.json();
    return json
  }
}
