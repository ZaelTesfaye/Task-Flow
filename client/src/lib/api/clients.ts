import APIClient from "./api-client";

export const authApiClient = new APIClient("/custom-auth");
export const userApiClient = new APIClient("/user");
export const projectApiClient = new APIClient("/project");
export const phaseApiClient = new APIClient("/phase");
export const taskApiClient = new APIClient("/task");
export const paymentApiClient = new APIClient("/stripe");
export const notificationApiClient = new APIClient("/notification");
