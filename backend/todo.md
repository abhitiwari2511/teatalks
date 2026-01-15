# TeaTalks Backend - Development Roadmap

> A college-exclusive Reddit-like platform for students with `@abc.ac.in` email domain

---

## 📋 Current Status

### ✅ What's Done
- [x] Basic Express setup with TypeScript
- [x] MongoDB connection with Mongoose
- [x] User model with password hashing & JWT tokens
- [x] Basic route structure
- [x] Async handler utility
- [x] Dependencies installed (bcrypt, JWT, nodemailer, zod)

### ⚠️ Issues to Fix
- [ ] User model missing `export` statement
- [ ] `generateAccessToken` not returning the token

---

## 🔐 Phase 1: Authentication System (Priority: HIGH)

### 1.1 Fix Existing Code
- [ ] Fix User model - add missing `export`
- [ ] Fix `generateAccessToken` to return the token
- [ ] Add OTP-related fields to User model (`isVerified`, etc.)

### 1.2 Create New Models
- [ ] Create OTP model (`otp.model.ts`)
  - email (string)
  - otp (string, hashed)
  - expiresAt (Date)
  - createdAt (Date)

### 1.3 Create Config & Utils
- [ ] Create `config/constants.ts`
  - COLLEGE_EMAIL_DOMAIN = "abc.ac.in"
  - OTP_EXPIRY_MINUTES = 10
  - Other constants
- [ ] Create `utils/ApiError.ts` - Custom error class
- [ ] Create `utils/ApiResponse.ts` - Standardized response class

### 1.4 Create Email Service
- [ ] Create `services/email.service.ts`
  - Configure nodemailer transporter
  - `sendOTP(email, otp)` function
  - Email templates for OTP

### 1.5 Create Validators (Zod)
- [ ] Create `validators/auth.validator.ts`
  - Register schema (validate college email domain)
  - Login schema
  - OTP verification schema

### 1.6 Create Middleware
- [ ] Create `middlewares/auth.middleware.ts`
  - JWT verification middleware
  - Attach user to request
- [ ] Create `middlewares/validate.middleware.ts`
  - Zod validation middleware

### 1.7 Implement Auth Controller
- [ ] Create `controllers/auth.controller.ts`
  - `register` - Validate email domain → Send OTP
  - `verifyOTP` - Verify OTP → Create user account
  - `resendOTP` - Resend OTP to email
  - `login` - Authenticate → Return tokens
  - `logout` - Clear refresh token
  - `refreshToken` - Generate new access token

### 1.8 Create Auth Routes
- [ ] Create `routes/auth.route.ts`
  - POST `/register`
  - POST `/verify-otp`
  - POST `/resend-otp`
  - POST `/login`
  - POST `/logout`
  - POST `/refresh-token`

---

## 📝 Phase 2: Post System

### 2.1 Create Post Model
- [ ] Create `models/post.model.ts`
  - title (string, required)
  - content (string, required)
  - author (ObjectId → User)
  - reactionsCount (object: { like, dislike })
  - commentsCount (number)
  - timestamps

### 2.2 Create Post Validator
- [ ] Create `validators/post.validator.ts`
  - Create post schema
  - Update post schema

### 2.3 Create Post Controller
- [ ] Create `controllers/post.controller.ts`
  - `createPost` - Create new post
  - `getAllPosts` - Get paginated feed
  - `getPostById` - Get single post with comments
  - `updatePost` - Update own post
  - `deletePost` - Delete own post
  - `getUserPosts` - Get posts by user

### 2.4 Create Post Routes
- [ ] Create `routes/post.route.ts`
  - GET `/` - Get all posts (paginated)
  - POST `/` - Create post (protected)
  - GET `/:postId` - Get single post
  - PUT `/:postId` - Update post (owner only)
  - DELETE `/:postId` - Delete post (owner only)
  - GET `/user/:userId` - Get user's posts

---

## 💬 Phase 3: Comment System

### 3.1 Create Comment Model
- [ ] Create `models/comment.model.ts`
  - content (string, required)
  - author (ObjectId → User)
  - post (ObjectId → Post)
  - parentComment (ObjectId → Comment, for replies)
  - reactionsCount (object)
  - timestamps

### 3.2 Create Comment Validator
- [ ] Create `validators/comment.validator.ts`

### 3.3 Create Comment Controller
- [ ] Create `controllers/comment.controller.ts`
  - `addComment` - Add comment to post
  - `getComments` - Get comments for post
  - `replyToComment` - Add reply to comment
  - `updateComment` - Edit own comment
  - `deleteComment` - Delete own comment

### 3.4 Create Comment Routes
- [ ] Create `routes/comment.route.ts`
  - GET `/posts/:postId/comments`
  - POST `/posts/:postId/comments`
  - POST `/comments/:commentId/reply`
  - PUT `/comments/:commentId`
  - DELETE `/comments/:commentId`

---

## ❤️ Phase 4: Reaction System

### 4.1 Create Reaction Model
- [ ] Create `models/reaction.model.ts`
  - user (ObjectId → User)
  - targetType (enum: "post" | "comment")
  - targetId (ObjectId)
  - type (enum: "like" | "dislike")
  - timestamps

### 4.2 Create Reaction Controller
- [ ] Create `controllers/reaction.controller.ts`
  - `toggleReaction` - Add/remove/change reaction
  - `getReactions` - Get reactions for post/comment

### 4.3 Create Reaction Routes
- [ ] Create `routes/reaction.route.ts`
  - POST `/posts/:postId/react`
  - POST `/comments/:commentId/react`

---

## 📁 Final Folder Structure

```
backend/
├── src/
│   ├── app.ts
│   ├── index.ts
│   ├── types.ts
│   │
│   ├── config/
│   │   └── constants.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── post.controller.ts
│   │   ├── comment.controller.ts
│   │   └── reaction.controller.ts
│   │
│   ├── db/
│   │   └── db.ts
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   └── validate.middleware.ts
│   │
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── otp.model.ts
│   │   ├── post.model.ts
│   │   ├── comment.model.ts
│   │   └── reaction.model.ts
│   │
│   ├── routes/
│   │   ├── auth.route.ts
│   │   ├── post.route.ts
│   │   ├── comment.route.ts
│   │   └── reaction.route.ts
│   │
│   ├── services/
│   │   └── email.service.ts
│   │
│   ├── utils/
│   │   ├── asyncHandler.ts
│   │   ├── ApiError.ts
│   │   └── ApiResponse.ts
│   │
│   └── validators/
│       ├── auth.validator.ts
│       ├── post.validator.ts
│       └── comment.validator.ts
```

---

## 🔌 API Endpoints Summary

### Auth (`/api/v1/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ | Register with college email |
| POST | `/verify-otp` | ❌ | Verify OTP |
| POST | `/resend-otp` | ❌ | Resend OTP |
| POST | `/login` | ❌ | Login |
| POST | `/logout` | ✅ | Logout |
| POST | `/refresh-token` | ❌ | Refresh access token |

### Posts (`/api/v1/posts`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ❌ | Get all posts (paginated) |
| POST | `/` | ✅ | Create post |
| GET | `/:postId` | ❌ | Get single post |
| PUT | `/:postId` | ✅ | Update post (owner) |
| DELETE | `/:postId` | ✅ | Delete post (owner) |

### Comments (`/api/v1/comments`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/posts/:postId/comments` | ❌ | Get comments |
| POST | `/posts/:postId/comments` | ✅ | Add comment |
| POST | `/:commentId/reply` | ✅ | Reply to comment |
| PUT | `/:commentId` | ✅ | Edit comment |
| DELETE | `/:commentId` | ✅ | Delete comment |

### Reactions (`/api/v1/reactions`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/posts/:postId/react` | ✅ | React to post |
| POST | `/comments/:commentId/react` | ✅ | React to comment |

---

## 📝 Environment Variables Needed

```env
# Server
PORT=4000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRY=15m
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRY=7d

# Email (for OTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend
FRONTEND_URL=http://localhost:3000
```

---

## 🎯 Development Order

1. **Phase 1** → Complete authentication (foundation)
2. **Phase 2** → Posts (core feature)
3. **Phase 3** → Comments (engagement)
4. **Phase 4** → Reactions (interaction)

---

> **Note:** Update `COLLEGE_EMAIL_DOMAIN` in constants.ts with your actual college domain (e.g., `abc.ac.in`)
