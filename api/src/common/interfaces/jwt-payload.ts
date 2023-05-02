export interface IJWTPayload {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    businesses: number[];
    roles: string[];
    employedAt: number[];
}
