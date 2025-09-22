declare const authServices: {
    register: (name: string, email: string, password: string) => Promise<{
        id: string;
        name: string;
        email: string;
    }>;
    login: (email: string, password: string) => Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        token: string;
    }>;
};
export default authServices;
//# sourceMappingURL=auth.service.d.ts.map