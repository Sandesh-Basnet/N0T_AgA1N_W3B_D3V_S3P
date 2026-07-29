# Authentication & Deployment — Complete Guide

A reference guide covering everything you need to add user authentication to a full-stack app: password hashing, JSON Web Tokens, server-side auth middleware, client-side login/register flows, and deploying both services to Render.

---

## Table of Contents

1. [Authentication Concepts](#1-authentication-concepts)
2. [Password Hashing with bcrypt](#2-password-hashing-with-bcrypt)
3. [JSON Web Tokens (JWT)](#3-json-web-tokens-jwt)
4. [Sequelize Model Associations](#4-sequelize-model-associations)
5. [Auth Middleware (requireAuth)](#5-auth-middleware-requireauth)
6. [Client-Side Auth with Context](#6-client-side-auth-with-context)
7. [localStorage Token Persistence](#7-localstorage-token-persistence)
8. [ProtectedRoute Component](#8-protectedroute-component)
9. [Deployment to Render](#9-deployment-to-render)
10. [Full Auth Data Flow](#10-full-auth-data-flow)
11. [Common Errors & Troubleshooting](#11-common-errors--troubleshooting)
12. [Glossary](#12-glossary)

---

## 1. Authentication Concepts

### Authentication vs Authorization

| Concept         | What it answers               | Example                                             |
| --------------- | ----------------------------- | --------------------------------------------------- |
| **Authentication** | "Who are you?"             | Logging in with a username and password             |
| **Authorization**  | "What are you allowed to do?" | A user can only see/edit their own todos            |

Authentication happens first (login), then authorization is checked on every protected operation.

### Token-Based Authentication

Instead of sending a password on every request, the client logs in once, receives a **token** (a cryptographically signed string), and sends that token on every subsequent request via an `Authorization` header. The server verifies the token without needing to look up the password again.

```
Client                          Server
  │                               │
  │── POST /api/auth/login ──────>│  verify password
  │<──── { token } ───────────────│  issue JWT
  │                               │
  │── GET /api/todo (Authorization: Bearer <token>) ──>│  verify token
  │<──── { tasks } ────────────────────────────────────│  return data
```

### Session-Based vs Token-Based

| Aspect              | Session-based (cookies)              | Token-based (JWT)                            |
| ------------------- | ------------------------------------ | -------------------------------------------- |
| State               | Server stores session in memory/DB    | Server is stateless — token is self-contained |
| Scaling             | Need shared session store across servers | Any server can verify any token           |
| Client              | Browser manages cookie automatically  | Client must manually send `Authorization` header |
| Mobile apps         | Difficult (no cookie concept)         | Works naturally                              |

This course uses **token-based auth with JWTs** — no cookies involved.

---

## 2. Password Hashing with bcrypt

### Why hash passwords?

A password should **never** be stored in plain text. If the database is compromised, plain-text passwords expose every user's credentials. Hashing transforms the password into a fixed-length string that cannot be reversed.

### bcrypt

[bcrypt](https://github.com/kelektiv/node.bcrypt.js) is a password-hashing library designed to be **computationally expensive** — even with the hash, an attacker cannot quickly guess passwords by brute force.

```bash
npm install bcrypt
```

### Hashing a password

```js
import bcrypt from "bcrypt";

const passwordHash = await bcrypt.hash("user-password", 10);
```

- The second argument (`10`) is the **salt rounds** — higher values make hashing slower and more resistant to brute-force attacks. 10–12 is typical.
- `bcrypt.hash()` returns a promise — always `await` it.

### Verifying a password

```js
const valid = await bcrypt.compare("user-password", storedHash);
// true or false
```

`bcrypt.compare()` extracts the salt from the stored hash and re-hashes the candidate password the same way, then compares.

### What is stored in the database

The `passwordHash` column stores a single string like:

```
$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
```

This string contains: `$2b$` (algorithm), `10` (salt rounds), `N9qo...` (base64 salt + hash) — everything bcrypt needs to later verify a password attempt.

---

## 3. JSON Web Tokens (JWT)

### What is a JWT?

A JSON Web Token is a **self-contained** string that encodes a JSON payload (claims), signed by the server so it cannot be tampered with. Once issued, the server can verify the token without consulting a database — the token itself proves the user was authenticated.

### Installation

```bash
npm install jsonwebtoken
```

### JWT structure

A JWT has three parts separated by dots:

```
header.payload.signature
```

- **Header** — algorithm and token type (e.g. `{ "alg": "HS256", "typ": "JWT" }`)
- **Payload** — the claims (data) embedded in the token, e.g. `{ "userId": 1, "fullName": "Alice", "iat": 1700000000, "exp": 1700086400 }`
- **Signature** — cryptographic signature computed from the header + payload + secret

The whole token looks like:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImZ1bGxOYW1lIjoiQWxpY2UifQ.sflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

You can decode (but not verify) any JWT at [jwt.io](https://jwt.io) — the signature check needs the secret.

### Signing a token (issuing)

```js
import jwt from "jsonwebtoken";

const token = jwt.sign(
  { userId: user.id, fullName: `${user.firstName} ${user.lastName}` },
  process.env.JWT_SECRET,
  { expiresIn: "1d" },
);
```

- The **payload** (first argument) should contain whatever the server needs to identify the user — typically `userId` and optionally display info like `fullName`. Do **not** put the password in the payload.
- The **secret** (second argument) is a long random string stored in `.env`. It must never be committed or exposed to the client.
- **`expiresIn`** sets a time limit — after this the token is invalid even if it hasn't been tampered with.

### Verifying a token

```js
const payload = jwt.verify(token, process.env.JWT_SECRET);
// { userId: 1, fullName: "Alice", iat: 1700000000, exp: 1700086400 }
```

- Returns the decoded payload if the signature is valid and the token hasn't expired.
- Throws an error if the token is malformed, expired, or signed with a different secret.

### Common JWT errors

| Error                         | Cause                                                    |
| ----------------------------- | -------------------------------------------------------- |
| `jwt must be provided`        | The `Authorization` header is missing or malformed       |
| `jwt malformed`               | The token string doesn't have the correct three-part format |
| `invalid signature`           | Token was signed with a different secret                 |
| `jwt expired`                 | Token's `exp` time has passed                            |

---

## 4. Sequelize Model Associations

### One-to-Many relationship

A `User` has many `Todo` items, and each `Todo` belongs to one `User`:

```js
// src/models/index.js (or wherever you define associations)
import Todo from "./Todo.js";
import User from "./User.js";

User.hasMany(Todo, { foreignKey: "userId" });
Todo.belongsTo(User, { foreignKey: "userId" });

export { Todo, User };
```

### The foreign key

- `User.hasMany(Todo, { foreignKey: "userId" })` — adds a `userId` column to the `todos` table.
- `Todo.belongsTo(User, { foreignKey: "userId" })` — creates the reverse association.

### Querying with associations

```js
// Find all todos for the logged-in user
const tasks = await Todo.findAll({ where: { userId: req.userId } });

// Find a specific todo and verify ownership
const task = await Todo.findByPk(id);
if (!task || task.userId !== req.userId) {
  // return 404 — don't reveal whether the id exists
}

// Create a todo owned by the logged-in user
const task = await Todo.create({
  title,
  deadline,
  isUrgent,
  userId: req.userId, // stamp ownership at creation
});
```

### Ownership check pattern

Always return `404` (not `403`) when a todo doesn't exist or belongs to someone else. This avoids leaking whether a given id exists at all:

```js
if (!task || task.userId !== req.userId) {
  return res.status(404).json({ error: "Task not found" });
}
```

---

## 5. Auth Middleware (requireAuth)

### The middleware

A single reusable middleware that protects any route by verifying the JWT before the controller runs:

```js
import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    req.fullName = payload.fullName;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
```

### How to apply it

Apply globally to all routes in a router:

```js
router.use(requireAuth);

router.get("/", getTasks);
router.post("/", createTask);
// all routes above require auth
```

Or apply per-route:

```js
router.get("/", requireAuth, getTasks);
router.post("/", requireAuth, createTask);
```

### What the middleware does

1. Reads the `Authorization` header from the incoming request.
2. Extracts the token after `"Bearer "` (7 characters).
3. Verifies the token with `jwt.verify()` using the same `JWT_SECRET` from `.env`.
4. If valid — attaches `req.userId` and `req.fullName` so downstream controllers can identify the user.
5. If invalid or missing — responds `401` immediately, the controller never runs.

### Auth routes (no middleware)

The `register` and `login` routes must **not** be protected — the whole point is that an anonymous user can create an account or log in:

```js
router.post("/register", register);
router.post("/login", login);
```

These routes read the body, validate credentials, and **issue** a token. Everything else requires one.

---

## 6. Client-Side Auth with Context

### The problem

Without client-side auth state:
- Every page would need to check localStorage for a token
- Components wouldn't know if the user is logged in without repeating the same code
- Login/logout changes wouldn't propagate across the app

### Solution: AuthContext

A React Context that holds `user`, `token`, `login`, `register`, and `logout` — available to every component via a custom `useAuth()` hook.

### AuthProvider

Wrap the app (or a portion of it) in `AuthProvider` to make auth state available everywhere:

```jsx
import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  function persistSession(data) {
    const loggedInUser = {
      id: data.id,
      username: data.username,
      fullName: data.fullName,
    };
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setToken(data.token);
    setUser(loggedInUser);
  }

  async function register({ firstName, lastName, username, password }) {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: { firstName, lastName, username, password },
    });
    persistSession(data);
  }

  async function login({ username, password }) {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: { username, password },
    });
    persistSession(data);
  }

  async function logout() {
    try {
      await apiRequest("/auth/logout", { method: "POST", token });
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
```

### Wiring into App.jsx

```jsx
<BrowserRouter>
  <AuthProvider>
    <NavBar />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
    </Routes>
  </AuthProvider>
</BrowserRouter>
```

`AuthProvider` goes **inside** `BrowserRouter` (so it can use `useNavigate` if needed) but **wrapping** every route that needs auth state.

### Using useAuth in components

```jsx
import { useAuth } from "../context/AuthContext";

function SomeComponent() {
  const { user, token, login, logout } = useAuth();

  // Pass token to API calls
  const tasks = await getTasks(token);

  // Show user info
  return <p>Welcome, {user.fullName}</p>;
}
```

---

## 7. localStorage Token Persistence

### Why localStorage

When the app closes or the user refreshes the page, in-memory React state is lost. The token needs to survive in the browser so the user doesn't have to log in again on every page load.

### How it works

| Event                    | localStorage write                         | localStorage read            |
| ------------------------ | ------------------------------------------ | ---------------------------- |
| User registers/logs in   | `token` + `user` (JSON) saved              | —                            |
| Page refresh             | —                                          | `AuthProvider` reads `token` and `user`, restores state |
| User logs out            | Both keys removed                          | —                            |

### What to store

```js
localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify({
  id: data.id,
  username: data.username,
  fullName: data.fullName,
}));
```

- **`token`** — the raw JWT string, sent as `Authorization: Bearer <token>` on every API call.
- **`user`** — a serialized JSON object with `id`, `username`, `fullName`. This is saved alongside the token so the UI can show the user's name immediately without an extra API call.

### What NOT to store

- The password — never.
- The `passwordHash` — never leaves the server.
- Sensitive information — the user object is only display data.

### Session restore on app load

The `useEffect` in `AuthProvider` runs once when the app first renders:

```jsx
useEffect(() => {
  const savedToken = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");
  if (savedToken && savedUser) {
    setToken(savedToken);
    setUser(JSON.parse(savedUser));
  }
  setIsLoading(false); // always mark loading as done
}, []);
```

The `isLoading` flag prevents a flash of the login page: if `isLoading` is `true` and `user` happens to be `null` (because localStorage hasn't been read yet), a `ProtectedRoute` would redirect to `/login` unnecessarily.

---

## 8. ProtectedRoute Component

### What it does

Wraps components that require authentication. If the user is logged in, it renders its children. If not, it redirects to `/login`.

```jsx
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

### The loading guard

Without the `isLoading` check, this sequence would happen on page refresh:

1. User is logged in (token exists in localStorage)
2. App loads — `AuthProvider` starts, `user` is initially `null`
3. `ProtectedRoute` checks `user` — it's `null` — redirects to `/login`
4. `AuthProvider` finishes reading localStorage — sets `user` to the saved value
5. Too late — the user is already on `/login`

The `isLoading` check prevents this: as long as `AuthProvider` hasn't finished restoring the session, `ProtectedRoute` shows "Loading..." instead of redirecting.

### Usage

```jsx
<Route
  path="/"
  element={
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  }
/>
<Route path="/login" element={<Login />} />   {/* NOT protected */}
<Route path="/register" element={<Register />} /> {/* NOT protected */}
```

---

## 9. Deployment to Render

### Two services

A full-stack app needs two services on Render:

| Service type   | What it runs | Root Directory | Build Command     | Start Command / Publish Dir |
| -------------- | ------------ | -------------- | ----------------- | --------------------------- |
| **Web Service** | Express API  | `server`       | `npm install`     | `npm start`                 |
| **Static Site** | React/Vite   | `client`       | `npm install && npm run build` | `dist`          |

### Environment variables

**Server:**

| Variable        | Local value                    | Production value                        |
| --------------- | ------------------------------ | --------------------------------------- |
| `PORT`          | `3000`                         | Render auto-sets this                   |
| `DB_PATH`       | `./database.sqlite`            | `./database.sqlite` (same) |
| `CORS_ORIGIN`   | `http://localhost:5173`         | Your deployed client URL                |
| `CORS_METHOD`   | `GET,POST,PUT,DELETE`           | `GET,POST,PUT,DELETE`                   |
| `JWT_SECRET`    | dev secret                     | Fresh, long random secret               |

**Client (Vite):**

| Variable             | Local value             | Production value              |
| -------------------- | ----------------------- | ----------------------------- |
| `VITE_API_BASE_DEV`  | `http://localhost:3000`  | same (unused in prod)         |
| `VITE_API_BASE_PROD` | not set locally         | Your deployed server URL      |

### API base URL switching

In `api.js`, use Vite's built-in `import.meta.env.DEV` / `import.meta.env.PROD` flags:

```js
const API_BASE_URL = import.meta.env.DEV
  ? import.meta.env.VITE_API_BASE_DEV   // local dev: http://localhost:3000
  : import.meta.env.VITE_API_BASE_PROD; // production: https://your-app.onrender.com
```

- `import.meta.env.DEV` is `true` when running `npm run dev`
- `import.meta.env.PROD` is `true` after `npm run build` (production build)

### SQLite on Render

Render's filesystem is **ephemeral** — any file written to disk (including your SQLite database) is reset every time the service redeploys or restarts. This means:

- The database works fine for testing/demos
- Data **will not survive** a redeploy
- For persistent data, you would need a Render Disk or a hosted database (not covered in this course)

### Database sync

The SQLite file starts empty on Render. You need to run `sequelize.sync()` at least once to create the tables. Options:

- Have `server.js` call `sequelize.sync()` on every boot (simple, slightly slows startup)
- Run the sync script manually via Render's Shell tab
- Run `node src/scripts/syncDb.js` as a one-time build command

### Deployment checklist

- [ ] `.gitignore` includes `node_modules/`, `.env`, `dist/`, `database.sqlite`
- [ ] `server/.env.example` checked in (with dummy values)
- [ ] `client/package.json` has `build` and `preview` scripts
- [ ] `server/package.json` has `start` script (`node src/server.js`)
- [ ] `api.js` uses `import.meta.env.DEV` / `VITE_API_BASE_PROD` for the base URL
- [ ] CORS on the server reads from `CORS_ORIGIN` env variable (not hardcoded)
- [ ] Code pushed to GitHub
- [ ] Server deployed as **Web Service** with root `server`, start command `npm start`
- [ ] Client deployed as **Static Site** with root `client`, publish dir `dist`
- [ ] `CORS_ORIGIN` on server set to the deployed client URL
- [ ] Database synced at least once after deploy

---

## 10. Full Auth Data Flow

### Registration

```
React App                          Express Server
    │                                    │
    │  POST /api/auth/register           │
    │  { firstName, lastName,            │
    │    username, password }            │
    │ ────────────────────────────────>  │
    │                                    │  1. Validate fields
    │                                    │  2. Check username uniqueness
    │                                    │  3. bcrypt.hash(password, 10)
    │                                    │  4. User.create({ ... })
    │                                    │  5. jwt.sign({ userId, fullName })
    │  <──────────────────────────────── │
    │  { token, id, username, fullName } │
    │                                    │
    │  localStorage.set("token", token)  │
    │  localStorage.set("user", user)    │
    │  setUser(user), setToken(token)    │
    │  navigate("/")                     │
```

### Authenticated request

```
React App                          Express Server
    │                                    │
    │  GET /api/todo                     │
    │  Authorization: Bearer <token>     │
    │ ────────────────────────────────>  │
    │                                    │  1. requireAuth middleware
    │                                    │     - extract token from header
    │                                    │     - jwt.verify(token, secret)
    │                                    │     - attach req.userId, req.fullName
    │                                    │  2. Controller runs
    │                                    │     - Todo.findAll({ where: { userId } })
    │  <──────────────────────────────── │
    │  [ { id, title, deadline, ... } ]  │
    │                                    │
    │  setTasks(data)                    │
    │  done loading                      │
```

### Logout

```
React App                          Express Server
    │                                    │
    │  POST /api/auth/logout             │
    │  Authorization: Bearer <token>     │
    │ ────────────────────────────────>  │
    │                                    │  (server optionally blacklists token)
    │  localStorage.remove("token")      │
    │  localStorage.remove("user")       │
    │  setUser(null), setToken(null)     │
    │  navigate("/login")                │
```

### Page refresh (session restore)

```
1. App mounts
2. AuthProvider useEffect runs
3. Reads localStorage.getItem("token") and localStorage.getItem("user")
4. If both exist → setUser(parsedUser), setToken(savedToken)
5. If either missing → user stays null, token stays null
6. setIsLoading(false)
7. ProtectedRoute checks: isLoading? → "Loading..."  user? → render / redirect
```

---

## 11. Common Errors & Troubleshooting

### Server-side

| Error / Symptom                         | Likely cause                                        | Fix                                                      |
| --------------------------------------- | --------------------------------------------------- | -------------------------------------------------------- |
| `bcrypt` import fails                   | Missing `bcrypt` dependency                         | `npm install bcrypt`                                     |
| `jsonwebtoken` import fails             | Missing `jsonwebtoken` dependency                    | `npm install jsonwebtoken`                               |
| `JWT_SECRET is not defined`             | `.env` missing or not loaded                         | Add `JWT_SECRET` to `.env`; confirm `dotenv.config()` runs |
| `Cannot read properties of undefined`   | `req.body` is undefined before `register` handler    | Add `app.use(express.json())` before auth routes         |
| Token works locally but not on Render   | Different `JWT_SECRET` on Render                     | Check Render env vars; use the same secret or re-issue tokens |
| `SQLITE_ERROR: no such table: todos`    | Database not synced                                  | Run `npm run db:sync` or add `sequelize.sync()` to boot  |

### Client-side

| Error / Symptom                         | Likely cause                                        | Fix                                                      |
| --------------------------------------- | --------------------------------------------------- | -------------------------------------------------------- |
| `401 Not authenticated` on every request | Token missing from `Authorization` header           | Check `apiRequest` passes `token`; check `useAuth()` is called correctly |
| Flash redirect to `/login` on refresh   | `isLoading` not being checked in `ProtectedRoute`   | Add the `isLoading` guard before the `!user` check       |
| CORS error in browser console           | Server's `CORS_ORIGIN` doesn't match client origin  | Set `CORS_ORIGIN` to `http://localhost:5173` locally, client URL on Render |
| `localStorage is not defined`           | Code runs in SSR / non-browser environment          | Guard with `typeof window !== "undefined"` or use try/catch |
| Login succeeds but user data is stale   | `user` in localStorage has old fields               | Clear localStorage and log in again; check what the server returns |

---

## 12. Glossary

| Term                     | Definition                                                                             |
| ------------------------ | -------------------------------------------------------------------------------------- |
| **Authentication**       | Verifying a user's identity (e.g., login with username + password).                    |
| **Authorization**        | Verifying a user has permission to perform a specific action.                          |
| **bcrypt**               | A password-hashing library that is deliberately slow to resist brute-force attacks.    |
| **Salt rounds**          | A cost factor in bcrypt — higher values make hashing slower and more secure.           |
| **JWT (JSON Web Token)** | A self-contained, signed token that carries user claims.                               |
| **Payload (JWT)**        | The JSON data inside a JWT that identifies the user (e.g., `userId`, `fullName`).      |
| **Token signing**        | Creating a cryptographic signature for a JWT so tampering can be detected.             |
| **Token verification**   | Checking that a JWT's signature is valid and it hasn't expired.                         |
| **`Authorization` header** | An HTTP header that carries the token: `Authorization: Bearer <token>`.              |
| **Bearer token**         | A token-based authentication scheme where the token is sent in the `Authorization` header. |
| **Context (React)**      | A way to share state (like auth data) across components without prop drilling.         |
| **`localStorage`**       | Browser storage that survives page refreshes and browser restarts.                      |
| **Session restore**      | Reading saved `token` and `user` from `localStorage` when the app loads.               |
| **Protected route**      | A component that redirects to `/login` if the user isn't authenticated.                |
| **CORS**                 | Cross-Origin Resource Sharing — a browser security mechanism for cross-origin requests. |
| **Ephemeral filesystem** | A filesystem that resets when the server restarts — applies to Render's free tier.     |

---

## How This All Fits Together

1. **Task 1** adds authentication to the **server**: a `User` model, `register`/`login` routes that hash passwords and issue JWTs, `requireAuth` middleware that verifies tokens, and ownership checks on every todo route so users can only see their own data.

2. **Task 2** wires authentication into the **client**: an `apiRequest` helper that attaches the token, an `AuthContext` that manages `user`/`token` state and persists it to `localStorage`, `Login`/`Register` pages, a `ProtectedRoute` guard that redirects unauthenticated visitors, and updated components that pass the token to every service call.

3. **Task 3** deploys both services to **Render**: configuring environment variables for dev vs production, setting up CORS for the deployed client URL, running the database sync on a fresh deploy, and understanding SQLite's ephemeral nature on Render's free tier.

Together, these tasks take you from "my app has no concept of users" to "users can register, log in, see only their own data, and the whole thing is deployed and accessible on the internet" — the foundation for user accounts and session management in any full-stack application.
