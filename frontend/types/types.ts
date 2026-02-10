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

export interface PostPayload {
  title: string;
  content: string;
}

export interface PostAuthor {
  _id: string;
  userName: string;
  fullName: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  authorId: string | PostAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedPostsResponse {
  data: Post[];
  page: number;
  totalPages: number;
  totalPosts: number;
}

export interface User {
  _id: string;
  fullName: string;
  userName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  tempCredentials: { email: string; password: string } | null;
  register: (data: RegisterUser) => Promise<void>;
  login: (data: LoginUser) => Promise<void>;
  verifyOTP: (data: VerifyOTP) => Promise<void>;
  resendOTP: (data: ResendOTP) => Promise<void>;
  getCurrentUser: () => Promise<void>;
  logout: () => void;
}