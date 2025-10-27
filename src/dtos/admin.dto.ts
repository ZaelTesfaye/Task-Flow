export interface GetAllUsers {
  page: number;
  limit: number;
}

export interface RemoveUser {
  userId: string;
}

export interface UpdateUserPassword {
  userId: string;
  password: string;
}

export interface AddAdmin {
  username: string;
  name: string;
  password: string;
}

export interface AdminLogin {
  email: string;
  password: string;
}
