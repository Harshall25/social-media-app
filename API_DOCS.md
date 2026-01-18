
# API Documentation

Base URL

```
http://localhost:3000/api/v1
```

Authentication

- Include JWT in header: `token: <JWT>`

Endpoints

## Auth

### POST /auth/signup

Request body (JSON):

```json
{ "name": "Alice", "email": "a@x.com", "password": "secret" }
```

Response: 201 Created

```json
{ "message": "Signed up successfully" }
```

### POST /auth/signin

Request body (JSON):

```json
{ "email": "a@x.com", "password": "secret" }
```

Response: 200 OK

```json
{ "token": "<JWT>" }
```

## Posts

### POST /posts/create (protected)

Headers: `token: <JWT>`

Body (JSON):

```json
{ "title": "...", "content": "...", "tags": ["t"], "imageUrl": "https://..." }
```

Response: 201 Created — returns the created `post` object.

### GET /posts/ (public)

Response: 200 OK

```json
{ "count": 10, "posts": [ /* post objects */ ] }
```

### GET /posts/:id (public)

Response: 200 OK — single `post` object.

### PATCH /posts/:id (protected, author only)

Headers: `token: <JWT>`

Body: any of `{ title?, content?, tags?, imageUrl? }`

Response: 200 OK — updated `post`.

### DELETE /posts/:id (protected, author only)

Headers: `token: <JWT>`

Response: 200 OK

```json
{ "message": "Post deleted successfully" }
```

## Comments

### POST /posts/:id/comments (protected)

Headers: `token: <JWT>`

Body: `{ "content": "Nice" }`

Response: 201 Created — returns `comment`.

### GET /posts/:id/comments (public)

Response: 200 OK — `{ count, comments }`.

## Likes

### POST /posts/:id/like (protected)

Headers: `token: <JWT>`

Response: 200 OK — `{ likesCount: <n> }`.

### DELETE /posts/:id/like (protected)

Headers: `token: <JWT>`

Response: 200 OK — `{ likesCount: <n> }`.

## Models (summary)

- User: `{ _id, name, email, password, createdAt }`
- Post: `{ _id, title, content, author, tags, imageUrl, likesCount, createdAt, updatedAt }`
- Comment: `{ _id, content, post, user, createdAt }`
- Like: `{ _id, post, user, createdAt }`

Validation & Errors

- Inputs validated with Zod; validation failures return `400` with details.
- Common status codes:
	- `400` Validation failed
	- `401` Unauthorized (token missing/invalid)
	- `403` Forbidden (ownership)
	- `404` Not found
	- `500` Internal server error

Notes

- Passwords hashed with `bcrypt`.
- JWT secret: `JWT_SECRET` in `.env`.
- Each `(post,user)` like is unique; likesCount is kept in sync.

Quick Start

```bash
npm install
cp .env.example .env # or update .env
npm start
```

Examples

Create post (curl):

```bash
curl -X POST http://localhost:3000/api/v1/posts/create \
	-H "Content-Type: application/json" \
	-H "token: $JWT" \
	-d '{"content":"Hello world"}'
```

Security

- Only authors can update/delete their posts.
- Inputs are validated and sanitized before save.

Contact

- Repository owner

✅ **Likes System**
- Like/unlike posts (authenticated)
- Prevent duplicate likes (unique constraint)
- Accurate like count synchronization
- Auto-delete likes when post is deleted

✅ **Security**
- Ownership validation for update/delete
- JWT authentication
- Password hashing
- Input validation with Zod

✅ **Error Handling**
- Try-catch blocks in all controllers
- Zod validation errors
- Proper HTTP status codes
- Detailed error messages
