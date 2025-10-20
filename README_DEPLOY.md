# Deploying the Family Shopping List (static site)

This repository is a small static site (HTML/CSS/JS). You can deploy it to GitHub Pages, Netlify, or Vercel for free. This file contains quick, copy-paste steps to upload the three files and trigger automatic builds.

Prerequisites
- Git installed and configured with your GitHub account.
- A GitHub account for GitHub Pages (and to connect Netlify/Vercel if desired).

Common steps (create a repo and push)
1. From your project folder run:

```bash
git init
git add .
git commit -m "Initial commit - shopping list app"
git branch -M main
# create a GitHub repo via the website or GitHub CLI and then add the remote,
# for example if your repo is `https://github.com/you/shopping-list`:
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

GitHub Pages (simple)
- Option A (repository pages - works for public repos):
  1. In the GitHub repo settings → Pages, set Source to `main` branch and `/ (root)`.
  2. GitHub will build and provide a URL like `https://<your-username>.github.io/<your-repo>/`.

- Option B (using GitHub Actions, recommended for private repos or if you want to publish to the `gh-pages` branch):
  - See `.github/workflows/deploy-gh-pages.yml` (provided) — it will publish the `main` branch to GitHub Pages on push.

Netlify (drag-and-drop or Git integration)
- Drag-and-drop: go to Netlify → Sites → New site → Drag and drop your project folder (zip) into the UI.
- Git integration (recommended):
  1. Connect Netlify to your GitHub repo and pick the `main` branch.
  2. Build command: (none) — leave empty. Publish directory: `/` (project root).
  3. Deploys automatically on push.

Included files for Netlify: `netlify.toml` in this repo sets a simple build/publish behavior.

Vercel (easy for static sites)
- Web UI: Import Project → select GitHub repo → Framework Preset: `Other` → Build Command: none → Output Directory: `.`
- Vercel will deploy on each push and provide a URL.

Files added by me
- `.github/workflows/deploy-gh-pages.yml` — optional GH Actions workflow to publish to GitHub Pages.
- `netlify.toml` — Netlify config (optional but helpful).
- `vercel.json` — Vercel configuration to set static output.

If you want, I can also:
- Create a `package.json` with a `deploy` script.
- Create a one-click button or GitHub template repo for easy onboarding.

Tell me which provider(s) you want me to wire automatically (I can create the workflows and sample secrets), or if you'd prefer step-by-step manual instructions for each service.

Quick copy-paste commands for each provider

1) GitHub Pages (using the workflow)

```bash
# Make sure your repo is pushed to GitHub main
git add .
git commit -m "Prepare for GH Pages"
git push origin main

# The GitHub Actions workflow will run automatically and publish to the gh-pages branch.
# On the repo's Settings → Pages, pick `gh-pages` branch if required or wait for the action to set it.
```

Notes:
- If your repository is private, ensure the GitHub Actions runner has permission to create and push the `gh-pages` branch (repo settings → Actions → General).
- The action used is `JamesIves/github-pages-deploy-action@v4` which requires no extra secrets for public repos.

2) Netlify (via Git)

```bash
# Push your code to GitHub first (see above), then:
# In Netlify UI: New site → Import from Git → Connect to GitHub → select your repo
# Build command: leave blank
# Publish directory: . (project root)
```

Netlify will build & deploy on every push to the connected branch.

3) Vercel (via Git)

```bash
# Push your code to GitHub first (see above), then in Vercel:
# Import Project → From Git → select repo → Framework Preset: Other
# Build Command: (leave empty)  Output Directory: .
```

After this, pushes to `main` will trigger automatic deployments on the chosen platform.

Questions?
- Do you want me to create a single `deploy.sh` script to automate the `git` steps and optionally open the browser to each provider's dashboard?
- Or should I create GitHub repo and push these changes for you (I can create the changes locally here, but I cannot push to your GitHub account without credentials)?
