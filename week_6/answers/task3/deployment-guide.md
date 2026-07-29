# Deployment Guide: Todo App (Client + Server) to Render

## Prerequisites

- GitHub account, Render account, git installed locally
- Project running locally with SQLite (ephemeral on Render)

---

## 1. Prepare the repo

- **Root `.gitignore`**: add `node_modules/`, `.env`, `.env.local`, `dist/`, `build/`
- **Server `.env.example`**: list `PORT`, `DB_PATH`, `CORS_ORIGIN`, `CORS_METHOD`, `JWT_SECRET`
- **Client `.env.example`**: list `VITE_API_BASE_DEV`, `VITE_API_BASE_PROD`
- **Build scripts**: server needs `"start": "node src/server.js"`; client needs `"build": "vite build"`
- **API base URL**: in `client/src/api.js`, use `import.meta.env.DEV ? VITE_API_BASE_DEV : VITE_API_BASE_PROD`
- **CORS config**: server reads `CORS_ORIGIN` / `CORS_METHOD` env vars

## 2. Push to GitHub

```bash
git init && git add . && git commit -m "Initial commit"
# Create repo on github.com/new
git remote add origin https://github.com/<username>/todo-app.git
git branch -M main && git push -u origin main
```

## 3. Deploy server (Express) as Web Service

- Render Dashboard → **New +** → **Web Service**
- Connect repo, set **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Env vars**: `PORT` (Render auto-sets), `DB_PATH=./database.sqlite`, `CORS_ORIGIN` (fill after client deploys), `CORS_METHOD`, `JWT_SECRET` (fresh random string)
- URL: `https://todo-server.onrender.com`

### DB sync

Run `sequelize.sync()` on boot or set **Build Command** to `npm install && node src/scripts/syncDb.js` once.

## 4. Deploy client (React/Vite) as Static Site

- Render Dashboard → **New +** → **Static Site**
- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Env vars**: `VITE_API_BASE_PROD=https://todo-server.onrender.com`
- URL: `https://todo-client.onrender.com`

## 5. Connect: update server CORS

- Server → **Environment** → set `CORS_ORIGIN=https://todo-client.onrender.com`
- Render auto-redeploys server

## 6. Verify

- Open client URL, register, login, create todos
- Check DevTools → Network tab for 2xx responses
- CORS errors? Check `CORS_ORIGIN` matches exactly (no trailing slash)

## Ongoing deploys

```bash
git add . && git commit -m "message" && git push
```

Render auto-deploys both services from `main`.

## Environment Variables Summary

| Scope  | Key                | Local Value                    | Production Value                    |
| ------ | ------------------ | ------------------------------ | ----------------------------------- |
| Server | `PORT`             | `3000`                         | auto-set by Render                  |
| Server | `DB_PATH`          | `./database.sqlite`            | `./database.sqlite` (ephemeral)     |
| Server | `CORS_ORIGIN`      | `http://localhost:5173`        | `https://todo-client.onrender.com`  |
| Server | `CORS_METHOD`      | `GET,POST,PUT,DELETE`          | `GET,POST,PUT,DELETE`               |
| Server | `JWT_SECRET`       | dev secret                     | fresh random secret                 |
| Client | `VITE_API_BASE_DEV`  | `http://localhost:3000`      | unused in production                |
| Client | `VITE_API_BASE_PROD` | (unused locally)             | `https://todo-server.onrender.com`  |

> SQLite data resets on every redeploy (ephemeral filesystem). For persistent data, add a Render Disk or switch to a hosted database.
