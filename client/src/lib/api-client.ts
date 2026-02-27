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

  get = <T>(subPath?: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(this.url(subPath), config).then((r) => r.data);

  post = <T>(data?: unknown, subPath?: string) =>
    axiosInstance.post<T>(this.url(subPath), data).then((r) => r.data);

  patch = <T>(data?: unknown, subPath?: string) =>
    axiosInstance.patch<T>(this.url(subPath), data).then((r) => r.data);

  delete = <T>(subPath?: string) =>
    axiosInstance.delete<T>(this.url(subPath)).then((r) => r.data);
}

export default APIClient;

export const authAPI = new APIClient("/custom-auth");
export const userClient = new APIClient("/user");
export const projectClient = new APIClient("/project");
export const phaseClient = new APIClient("/phase");
export const taskClient = new APIClient("/task");
export const stripeClient = new APIClient("/stripe");
export const notificationClient = new APIClient("/notification");
