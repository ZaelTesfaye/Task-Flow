
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