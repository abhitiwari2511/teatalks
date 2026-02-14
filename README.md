# 🍵 TeaTalks

A modern social media platform where users can share posts, engage with reactions, and participate in discussions through comments. Built with Next.js and Express.js, TeaTalks features a beautiful neo-brutalism design and real-time interactions.

## ✨ Features

### 🔐 Authentication & Authorization
- User registration with email verification (OTP)
- Secure login/logout with JWT tokens
- Token refresh mechanism
- Protected routes and middleware

### 📝 Posts Management
- Create and read posts
- Rich text content with title and body
- View all posts or individual post details
- User-specific post history

### 💬 Comments System
- Add comments to any post
- Delete your own comments
- Real-time comment count updates
- Nested comment reactions

### 👍 Reactions
- React to posts with 4 emoji types: 👍 (Like), 💝 (Love), 😂 (Funny), 😡 (Angry)
- React to comments with 2 emoji types: 👍 (Like), 💝 (Love)
- One reaction per user (automatically switches if changed)
- Real-time reaction count updates
- Visual highlighting of selected reactions

### 👤 User Profiles
- Personalized user profiles
- Editable bio section
- View user's post history
- Display user statistics (post count, comment count)
- Weekly activity tracking
- Profile visit functionality

### 🎨 UI/UX
- Neo-brutalism design with bold borders and shadows
- Responsive layout for all devices
- Smooth animations with Framer Motion
- Loading states and error handling
- Optimistic UI updates

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion (Motion)
- **HTTP Client:** Axios
- **UI Components:** Custom components with Radix UI primitives
- **Icons:** Lucide React

### Backend
- **Framework:** Express.js 5
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Zod
- **Password Hashing:** Bcrypt
- **Email Service:** Resend
- **CORS:** Enabled for cross-origin requests

## 📁 Project Structure

```
teatalks/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App router pages
│   │   ├── (pages)/        # Pages group
│   │   │   ├── home/       # Home feed
│   │   │   ├── login/      # Login page
│   │   │   └── register/   # Registration page
│   │   ├── (user)/         # User pages group
│   │   │   └── profile/    # User profile pages
│   │   └── post/           # Individual post pages
│   ├── components/          # React components
│   │   ├── auth/           # Authentication components
│   │   ├── homePage/       # Home page components
│   │   ├── landingPage/    # Landing page components
│   │   ├── post/           # Post-related components
│   │   ├── profile/        # Profile components
│   │   └── ui/             # Reusable UI components
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts      # Authentication hook
│   │   ├── useComments.ts  # Comments management
│   │   ├── usePostPage.ts  # Post page logic
│   │   ├── usePosts.ts     # Posts management
│   │   ├── useReactions.ts # Reactions management
│   │   └── useUserProfile.ts # User profile logic
│   ├── lib/                # Utility libraries
│   │   └── api/            # API client functions
│   └── types/              # TypeScript type definitions
│
├── backend/                 # Express.js backend application
│   └── src/
│       ├── config/          # Configuration files
│       ├── controllers/     # Route controllers
│       │   ├── comments.ts  # Comment operations
│       │   ├── post.ts      # Post operations
│       │   ├── reactions.ts # Reaction operations
│       │   └── users.ts     # User operations
│       ├── db/              # Database connection
│       ├── middlewares/     # Express middlewares
│       │   ├── auth.ts      # JWT verification
│       │   └── validate.ts  # Zod validation
│       ├── models/          # Mongoose schemas
│       │   ├── comments.ts  # Comment model
│       │   ├── otp.ts       # OTP model
│       │   ├── posts.ts     # Post model
│       │   ├── reactions.ts # Reaction model
│       │   └── user.ts      # User model
│       ├── routes/          # API routes
│       ├── types/           # TypeScript types
│       └── utils/           # Utility functions
│           ├── asyncHandler.ts # Error handling
│           ├── email.ts        # Email utilities
│           ├── otpHandler.ts   # OTP generation
│           └── *Schema.ts      # Zod schemas
│
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/teatalks.git
   cd teatalks
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret_key
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_EXPIRY=7d
   CORS_ORIGIN=http://localhost:3000
   
   # Email Configuration
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   RESEND_API_KEY=your_resend_api_key
   ```

   Build and start the backend:
   ```bash
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

   Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_BASE_URL=http://localhost:5000
   ```

   Start the development server:
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📡 API Endpoints

### Authentication
```
POST   /api/users/register          # Register new user
POST   /api/users/verify-otp        # Verify OTP
POST   /api/users/resend-otp        # Resend OTP
POST   /api/users/login             # Login user
POST   /api/users/logout            # Logout user (protected)
POST   /api/users/refresh-token     # Refresh access token
GET    /api/users/me                # Get current user (protected)
```

### User Profile
```
GET    /api/users/profile/:username # Get user profile (protected)
PATCH  /api/users/update-bio        # Update user bio (protected)
```

### Posts
```
GET    /api/posts                   # Get all posts
GET    /api/posts/:postId           # Get post by ID
POST   /api/posts                   # Create post (protected)
PUT    /api/posts/:postId           # Update post (protected)
DELETE /api/posts/:postId           # Delete post (protected)
```

### Comments
```
GET    /api/posts/:postId/comments  # Get comments for a post
POST   /api/posts/:postId/comments  # Create comment (protected)
DELETE /api/comments/:commentId     # Delete comment (protected)
```

### Reactions
```
POST   /api/posts/:postId/reactions    # Toggle post reaction (protected)
GET    /api/posts/:postId/reactions    # Get post reactions
POST   /api/comments/:commentId/reactions # Toggle comment reaction (protected)
GET    /api/comments/:commentId/reactions # Get comment reactions
```

## 🔧 Available Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Backend
```bash
npm run dev      # Start development server with nodemon
```

## 🎯 Key Features Implementation

### Custom Hooks
The application uses custom React hooks for state management and API calls:
- `useAuth` - Handles authentication logic
- `usePosts` - Manages posts data
- `useComments` - Handles comment operations
- `useReactions` - Manages reaction functionality
- `usePostPage` - Encapsulates post page logic
- `useUserProfile` - Handles user profile state

### Component Architecture
- Separated presentational and container components
- Reusable UI components in `components/ui/`
- Feature-specific components organized by domain
- Custom hooks for business logic separation

### State Management
- React Context for global authentication state
- Local state with custom hooks for feature-specific data
- Optimistic UI updates for better UX

### Styling
- Neo-brutalism design system
- Utility-first with Tailwind CSS
- Custom shadow and border utilities
- Responsive design patterns

## 🔒 Security Features

- JWT-based authentication with refresh tokens
- HTTP-only cookies for token storage
- Password hashing with bcrypt
- Email verification with OTP
- Protected API routes with middleware
- Input validation with Zod schemas
- CORS configuration

## 🎨 Design System

### Colors
- **Background:** Custom dark theme
- **Primary:** Teal (#B4E7E7)
- **Secondary:** Pink (#FFB5D5)
- **Accent:** Orange (#FF9B7C)
- **Highlight:** Cream (#FFF8DC)

### Typography
- Bold, black font weights for headings
- 4px black borders on all cards
- Hard shadows (8px_8px_0px_0px_rgba(0,0,0,1))
- Hover effects with shadow reduction

## 👨‍💻 Author

Built with ❤️ by the TeaTalks team

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for deployment solutions
- MongoDB for database services

---

**Happy TeaTalking! ☕️**