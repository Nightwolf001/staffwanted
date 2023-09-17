
// Interface for auth
export interface Auth {
    jwt: string;
    user: {
        id: number;
        username: string;
        email: string;
        provider: string;
        confirmed: boolean;
        blocked: boolean;
        user_type: string;
        profile_id: number;
    }
}