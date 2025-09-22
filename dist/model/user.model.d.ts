declare const userModel: {
    createUser: (name: string, email: string, password: string) => Promise<{
        id: string;
        name: string;
        email: string;
        password: string;
    }>;
    findByEmail: (email: string) => Promise<{
        id: string;
        name: string;
        email: string;
        password: string;
    } | null>;
};
export default userModel;
//# sourceMappingURL=user.model.d.ts.map