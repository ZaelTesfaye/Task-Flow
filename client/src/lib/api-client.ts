import { AxiosRequestConfig } from "axios";
import httpClient from "./http-client";

export class APIClient {
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

export const authApiClient = new APIClient("/custom-auth");
export const userApiClient = new APIClient("/user");
export const projectApiClient = new APIClient("/project");
export const phaseApiClient = new APIClient("/phase");
export const taskApiClient = new APIClient("/task");
export const paymentApiClient = new APIClient("/stripe");
export const notificationApiClient = new APIClient("/notification");
