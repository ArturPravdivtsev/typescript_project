export abstract class HttpHelper {
  public static fetchAsJson<Response>(input: RequestInfo, init?: RequestInit): Promise<Response> {
    return fetch(input, init)
      .then((response) => {
        return response.text()
      })
      .then<Response>((responseText) => {
        return JSON.parse(responseText)
      })
  }
}
