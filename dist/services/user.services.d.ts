declare const userServices: {
    addUser: (name: string, email: string, password: string) => Promise<{
        id: string;
        name: string;
        email: string;
        password: string;
    }>;
};
export default userServices;
//# sourceMappingURL=user.services.d.ts.map