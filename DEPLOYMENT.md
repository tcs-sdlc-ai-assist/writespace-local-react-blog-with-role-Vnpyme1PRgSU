# Deployment Guide — WriteSpace

This document covers deploying WriteSpace to [Vercel](https://vercel.com).

---

## Connecting Your GitHub Repository to Vercel

1. Sign in to [vercel.com](https://vercel.com) with your GitHub account.
2. Click **"Add New… → Project"** from the Vercel dashboard.
3. Select the **writespace** repository from the list of your GitHub repos.
4. Vercel will automatically detect the framework as **Vite** and pre-fill the build settings.
5. Click **Deploy**.

Once connected, every push to the `main` branch (or your configured production branch) will trigger an automatic deployment.

---

## Build Settings

Vercel auto-detects Vite projects. The following settings are used:

| Setting            | Value            |
| ------------------ | ---------------- |
| **Framework**      | Vite (auto-detected) |
| **Build Command**  | `npm run build`  |
| **Output Directory** | `dist`         |
| **Install Command** | `npm install`   |
| **Node.js Version** | 18.x or 20.x (default) |

> **Note:** You typically do not need to override any of these — Vercel's auto-detection handles them correctly. If you ever need to customize, go to **Project Settings → General → Build & Development Settings**.

---

## SPA Rewrites — `vercel.json`

WriteSpace is a single-page application (SPA). All routing is handled client-side by React Router. When a user navigates directly to a URL like `/editor` or `/about`, the server must return `index.html` instead of a 404 error.

The `vercel.json` file at the project root configures this:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### How it works

- **Static assets** (JS, CSS, images in `dist/assets/`) are served normally because Vercel matches static files before applying rewrites.
- **All other routes** (e.g., `/editor`, `/settings`, `/any/nested/path`) are rewritten to `/index.html`, allowing React Router to handle them on the client side.
- Without this rewrite rule, refreshing the browser on any route other than `/` would result in a **404 Not Found** error from Vercel.

---

## Environment Variables

WriteSpace currently does **not** require any environment variables. There are no API keys, backend URLs, or secrets to configure.

If environment variables are added in the future, they must:

1. Be prefixed with `VITE_` to be exposed to the client-side bundle (e.g., `VITE_API_URL`).
2. Be added in Vercel under **Project Settings → Environment Variables**.
3. Be accessed in code via `import.meta.env.VITE_VARIABLE_NAME` — never `process.env`.

---

## Troubleshooting

### Direct URL access returns 404

**Symptom:** Navigating directly to a route like `https://your-app.vercel.app/editor` shows a Vercel 404 page.

**Cause:** The `vercel.json` rewrite rule is missing or misconfigured.

**Fix:**
1. Ensure `vercel.json` exists in the project root (not inside `src/`).
2. Verify it contains the rewrite rule shown above.
3. Redeploy after making changes.

### Build fails with missing dependencies

**Symptom:** The Vercel build log shows `Module not found` or `Cannot resolve` errors.

**Fix:**
1. Run `npm install` and `npm run build` locally to confirm the build succeeds.
2. Ensure all dependencies are listed in `package.json` under `dependencies` or `devDependencies` (not installed globally).
3. Push the updated `package.json` and `package-lock.json`.

### Blank page after deployment

**Symptom:** The deployment succeeds but the page is blank.

**Fix:**
1. Open the browser developer console and check for errors.
2. Verify that `base` in `vite.config.js` is not set to a subdirectory (it should be `'/'` or omitted for root deployment).
3. Confirm the output directory is set to `dist` in Vercel.

### Stale deployment

**Symptom:** Changes pushed to GitHub are not reflected on the live site.

**Fix:**
1. Check the **Deployments** tab in Vercel to confirm a new deployment was triggered.
2. If not, verify the branch you pushed to matches the configured production branch.
3. Try a manual redeploy: **Deployments → ⋮ menu → Redeploy**.

---

## CI/CD Notes

### Automatic deployments

- **Production:** Every push to the `main` branch triggers a production deployment.
- **Preview:** Every push to any other branch (or any pull request) creates a unique preview deployment with its own URL. This is useful for reviewing changes before merging.

### Skipping deployments

To skip a deployment for a specific commit, include `[skip ci]` or `[vercel skip]` in the commit message:

```
git commit -m "update README [skip ci]"
```

### Build caching

Vercel caches `node_modules` between deployments. If you encounter stale dependency issues:

1. Go to **Project Settings → General**.
2. Scroll to **Build Cache** and click **Clear**.
3. Trigger a new deployment.

### Branch protection recommendations

For team projects, consider:

- Enabling **required status checks** on the `main` branch so preview deployments must succeed before merging.
- Using Vercel's **GitHub integration comments** which automatically post preview URLs on pull requests.

---

## Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Vercel Rewrites Configuration](https://vercel.com/docs/projects/project-configuration#rewrites)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)