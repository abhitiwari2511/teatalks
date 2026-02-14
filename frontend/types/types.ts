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
  commentCount?: number;
  reactionCount?: {
    like: number;
    love: number;
    funny: number;
    angry: number;
  };
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
  bio?: string;
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
  updateBio: (bio: string) => Promise<void>;
  getUserProfile: (username: string) => Promise<UserProfileData | undefined>;
}

export interface Comment {
  _id: string;
  postId: string;
  content: string;
  authorId: string | PostAuthor;
  reactionCount?: {
    like: number;
    love: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Reaction {
  _id: string;
  type: string;
  userId: string | PostAuthor;
  targetId: string;
  targetType: "post" | "comment";
  reactionType: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyActivity {
  postsCreated: number;
  commentsMade: number;
}

export interface UserProfileData {
  success: boolean;
  user: User;
  posts: Post[];
  postCount: number;
  commentCount: number;
  weeklyActivity: WeeklyActivity;
}

export interface UserProfile {
  username: string;
}

export interface CommentsCardProps {
  comments: Comment[];
  commentText: string;
  isSubmitting: boolean;
  userId: string | undefined;
  commentReactionEmojis: Record<string, string>;
  userCommentReactions: Record<string, string | null>; // commentId -> reactionType
  onCommentTextChange: (text: string) => void;
  onSubmitComment: () => void;
  onDeleteComment: (commentId: string) => void;
  onCommentReactionClick: (
    commentId: string,
    reactionType: "like" | "love",
  ) => void;
  formatDate: (date: string) => string;
}

export interface PlatformStats {
  userCount: number;
  postCount: number;
  commentCount: number;
  dailyPostCount: number;
}
