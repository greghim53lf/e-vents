import fetch, { BodyInit, RequestInit } from "node-fetch";

type BaseApiFetchParams = {
  url: string;
  body?: BodyInit;
  args?: Record<string, any>;
  requestInit?: RequestInit;
};

class BaseApi {
  baseUrl: string;

  constructor(url: string) {
    this.baseUrl = url;
  }

  fetch = async ({ url, body, args, requestInit }: BaseApiFetchParams) => {
    try {
      const urlObj = new URL(url, this.baseUrl);

      if (args) {
        urlObj.search = new URLSearchParams(args).toString();
      }

      const requestOptions = { ...requestInit, body };

      const response = await fetch(urlObj.toString(), requestOptions);

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      if (response.status === 204) return;

      return response.json();
    } catch (error: any) {
      throw new Error("Bad request");
    }
  };

  get = ({ url, args, requestInit }: BaseApiFetchParams) =>
    this.fetch({ url, args, requestInit: { ...requestInit, method: "GET" } });
}

export default BaseApi;
