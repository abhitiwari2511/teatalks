export interface RegisterUser {
    fullName: string;
    userName: string;
    email: string;
    password: string;
}

export interface LoginUser {
    email: string;
    password: string;
}

export interface VerifyOTP {
    email: string;
    otp: string;
}

export interface ResendOTP {
    email: string;
}