import axios, { type AxiosRequestConfig } from "axios";

const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

class APIClient {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  private url = (subPath?: string) =>
    subPath ? `${this.endpoint}/${subPath}` : this.endpoint;

  get = <T>(subPath?: string, config?: AxiosRequestConfig) =>
    httpClient.get<T>(this.url(subPath), config).then((r) => r.data);

  post = <T>(data?: unknown, subPath?: string) =>
    httpClient.post<T>(this.url(subPath), data).then((r) => r.data);

  patch = <T>(data?: unknown, subPath?: string) =>
    httpClient.patch<T>(this.url(subPath), data).then((r) => r.data);

  delete = <T>(subPath?: string) =>
    httpClient.delete<T>(this.url(subPath)).then((r) => r.data);
}

export default APIClient;
