import axios, { type AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
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

  get = <R>(subPath?: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<R>(this.url(subPath), config).then((r) => r.data);

  post = <R>(data?: unknown, subPath?: string) =>
    axiosInstance.post<R>(this.url(subPath), data).then((r) => r.data);

  patch = <R>(data?: unknown, subPath?: string) =>
    axiosInstance.patch<R>(this.url(subPath), data).then((r) => r.data);

  delete = <R>(subPath?: string) =>
    axiosInstance.delete<R>(this.url(subPath)).then((r) => r.data);
}

export default APIClient;
