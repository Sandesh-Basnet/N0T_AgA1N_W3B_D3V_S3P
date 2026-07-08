# N0T_AgA1N_W3B_D3V_S3P

Web development practice repository with static HTML/CSS/JS exercises and one React/Vite todo app.

## Repository structure

| Path | Purpose |
|---|---|
| `week_1/` | Introductory HTML/CSS exercises (including standalone exercise files and assets) |
| `week_2/` | Intermediate layout/responsive/interactive exercises plus a vanilla JS todo app in `week_2/final/` |
| `week_3/` | React learning materials (`task*.md`, screenshots, `answers/`) and final app in `week_3/todo-app-final/` |
| `.github/copilot-instructions.md` | Repository-specific Copilot working instructions |
| `sessions/` | Session notes/history files |

## Running the projects

### Static exercises (`week_1`, `week_2`)

Open the relevant `.html` file directly in a browser.

### React app (`week_3/todo-app-final`)

```bash
cd week_3/todo-app-final
npm install
npm run dev
```

Useful scripts:

- `npm run build` — production build
- `npm run preview` — preview built app
- `npm run lint` — lint JS/JSX files

## Notes

- `week_1/4SEWD-Web-Application-Development/` is a separate embedded Git repository and should not be modified from this repo workflow.
- There is currently no automated test suite configured in this repository.
