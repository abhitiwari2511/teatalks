export interface userModelType {
    fullName: string;
    userName: string;
    email: string;
    password: string;
    refreshToken: string;
    isVerified: boolean;
}

export interface userMethods {
    isPasswordMatched: (password: string) => Promise<boolean>;
    generateAccessToken: () => string;
    generateRefreshToken: () => string;
}