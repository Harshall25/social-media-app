# Social Media Backend

A complete Node.js/Express REST API for a social media platform with user authentication, posts, comments, and likes functionality.

## Features

### User Authentication
- ✅ User registration with email/password
- ✅ Login with JWT token generation
- ✅ Password hashing with bcrypt
- ✅ Protected routes with auth middleware
- ✅ Zod validation for inputs

### Post Management
- ✅ Create posts (authenticated users only)
- ✅ Get all posts (public)
- ✅ Get single post by ID (public)
- ✅ Update posts (only post author)
- ✅ Delete posts (only post author)
- ✅ Ownership security verification

### Comments System
- ✅ Add comments to posts (authenticated)
- ✅ Get all comments for a post (public)
- ✅ Auto-delete comments when post is deleted

### Likes System
- ✅ Like a post (authenticated)
- ✅ Unlike a post (authenticated)
- ✅ Accurate like count synchronization
- ✅ Prevent duplicate likes (unique constraint)
- ✅ Auto-delete likes when post is deleted

### Error Handling & Validation
- ✅ Try-catch blocks in all controllers
- ✅ Zod validation with detailed error messages
- ✅ Proper HTTP status codes
- ✅ Global error handling middleware

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Password:** bcrypt
- **Validation:** Zod
- **Middleware:** CORS

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd social-media-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/social-media
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   ```



5. **Run the server**
   
   Development mode:
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

## Project Structure

```
social-media-backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   └── postController.js    # Post, comment, like controllers
├── middlewares/
│   └── userAuth.js          # JWT authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   └── post.js              # Post, comment, like routes
├── schema.js                # Mongoose models
├── server.js                # Express app setup
├── .env                     # Environment variables
├── .gitignore               # Git ignore file
├── package.json             # Dependencies
├── API_DOCUMENTATION.md     # Complete API docs
└── readme.md                # This file
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/signin` - Login user

### Posts
- `POST /api/v1/posts/create` - Create post (protected)
- `GET /api/v1/posts/` - Get all posts (public)
- `GET /api/v1/posts/:id` - Get single post (public)
- `PATCH /api/v1/posts/:id` - Update post (protected, author only)
- `DELETE /api/v1/posts/:id` - Delete post (protected, author only)

### Comments
- `POST /api/v1/posts/:id/comments` - Add comment (protected)
- `GET /api/v1/posts/:id/comments` - Get comments (public)

### Likes
- `POST /api/v1/posts/:id/like` - Like post (protected)
- `DELETE /api/v1/posts/:id/like` - Unlike post (protected)



## Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### Post Model
```javascript
{
  title: String,
  content: String,
  author: ObjectId (ref: User),
  tags: [String],
  imageUrl: String,
  likesCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model
```javascript
{
  content: String,
  post: ObjectId (ref: Post),
  user: ObjectId (ref: User),
  createdAt: Date
}
```

### Like Model
```javascript
{
  post: ObjectId (ref: Post),
  user: ObjectId (ref: User),
  createdAt: Date
}
// Compound unique index on (post, user)
```

## Security Features

- Password hashing with bcrypt (salt rounds: 5)
- JWT token-based authentication
- Ownership verification for update/delete operations
- Protected routes requiring authentication
- Input validation with Zod
- Unique constraint on user likes (prevents duplicate likes)

## Error Handling

All endpoints include comprehensive error handling:
- 400: Validation errors
- 401: Authentication errors
- 403: Authorization errors (ownership)
- 404: Resource not found
- 500: Internal server errors

## Future Enhancements

- Image upload with Cloudinary integration
- User profiles with follow/unfollow
- Post search and filtering
- Pagination for posts and comments
- Rate limiting
- Email verification
- Password reset functionality
- Admin role and permissions



