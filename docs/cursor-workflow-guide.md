# Building a Frontend UI with Cursor — Step-by-Step Guide

This guide walks you through the full workflow: starting from a concept document, generating a PRD, and building out a complete frontend UI — all inside Cursor using the AI agent.

---

## One-Time Setup (First Time Only)

You need two things installed on your Mac before Cursor can do the rest.

### 1. Node.js

This is what runs your app locally so you can see it in a browser. Check if it's already installed by opening Cursor's terminal (`Ctrl + backtick`) and typing:

```
node -v
```

If you see a version number, you're good. If not, go to [https://nodejs.org](https://nodejs.org), download the LTS version, and install it.

### 2. GitHub CLI

This lets Cursor push your code to GitHub. Check if it's installed:

```
gh --version
```

If installed, make sure you're logged in:

```
gh auth status
```

If it says you're not logged in, run `gh auth login` and follow the prompts (choose GitHub.com, HTTPS, and log in with browser).

### 3. Cloudflare Account (Free)

Cloudflare Pages will host your app at a live URL so anyone with the link can see it — no need to run anything on your computer.

1. Go to [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up) and create a free account
2. Verify your email address

That's all for now. You'll connect it to your GitHub repo later in the workflow.

---

That's it for setup. Cursor's agent handles everything else — installing packages, creating files, running commands.

---

## How Cursor Works (The Basics)

- The **agent chat panel** is on the right side of Cursor. This is where you give instructions.
- You type what you want, and the agent reads your files, writes code, runs terminal commands, and builds things for you.
- **You reference files with the `@` symbol.** For example, typing `@docs/PRD.md` tells the agent to read that specific file. You can also type `@` and browse for files.
- The agent will ask for permission to run commands and make changes. **Read what it's doing before approving.** You don't need to understand the code, but you should see that it's doing something that matches what you asked for.
- **Start a new conversation for each major step.** This keeps the agent focused. Click the `+` icon at the top of the chat panel to start a new one.

---

## The Workflow

This is the same process every time, for any project. The only things that change are your concept doc and the details in the prompts.

---

### Step 1: Create the PRD

The PRD (Product Requirements Document) breaks your concept into buildable phases. Each phase becomes one round of work with the agent.

**Start a new Cursor conversation** and paste this prompt (update the file path if your concept doc has a different name):

---

> Read the app concept summary at `@docs/app-concept-summary.md` and create a Product Requirements Document. Save it as `docs/PRD.md`.
>
> Requirements:
> - Focus ONLY on the frontend and user interface — no backend, database, APIs, or deployment
> - Break the frontend work into 3–5 sequential build phases
> - **Phase 1** should always be: project setup, app shell/layout, navigation, and global styling
> - Each following phase should cover one major feature area of the UI (one screen or one related group of screens)
> - For each phase, list the exact pages, components, and UI elements to build
> - Include brief descriptions of what each screen looks like and how the user interacts with it
> - Specify the tech stack as **Next.js** with **Tailwind CSS**
> - Note where placeholder/mock data should be used (since there's no backend yet)
> - Each phase should produce something visually complete — a user should be able to open the app and see real-looking screens after every phase
>
> Do NOT write any code. Only produce the PRD document.

---

**What to do after:** Read through the PRD. Make sure the phases make sense to you and the screens described match what you envisioned. If something is missing or wrong, tell the agent in the same conversation: *"Add a screen for X"* or *"Move the closet gallery into Phase 2 instead of Phase 3."*

---

### Step 2: Build Phase 1 (Project Foundation)

Phase 1 creates the actual project, installs everything, and builds the app's skeleton — the layout, navigation, and overall look.

**Start a new conversation** and paste this prompt:

---

> Read the PRD at `@docs/PRD.md` and build **Phase 1**.
>
> This is a brand new project. You need to:
> 1. Set up the project using the tech stack from the PRD (Next.js + Tailwind CSS)
> 2. Install all necessary dependencies
> 3. Build everything described in Phase 1 — the app layout, navigation, global styles, and any screens listed
> 4. Use realistic placeholder/mock data so the UI looks populated and real (example names, photos from picsum.photos or similar, realistic numbers)
> 5. Make sure the design is modern, clean, and mobile-friendly
> 6. Make sure the app runs without errors
>
> When everything is working:
> - Initialize a git repository if one doesn't exist
> - Create a GitHub repository for this project using the GitHub CLI (`gh repo create`)
> - Make an initial commit with a clear message and push to GitHub
>
> When done, confirm Phase 1 is complete and tell me exactly how to view the app in my browser.

---

**What happens next:** The agent will spend a few minutes creating files, installing packages, and building. When it finishes, it will tell you something like: *"Run `npm run dev` and open http://localhost:3000."*

#### How to View Your App

After the agent finishes, you should see the app running. If not:

1. Open Cursor's terminal (`Ctrl + backtick`)
2. Type `npm run dev` and press Enter
3. Open your browser (Chrome, Safari, etc.) and go to **http://localhost:3000**

You should see your app. Leave the terminal running — it's your local server. If you close Cursor or the terminal, you'll need to run `npm run dev` again next time.

---

### Step 3: Build Each Remaining Phase

Repeat this for Phase 2, Phase 3, etc. **Start a new conversation for each phase.**

Paste this prompt and change the phase number:

---

> Read the PRD at `@docs/PRD.md` and build **Phase [NUMBER]**.
>
> The previous phases are already complete and working. Now build everything described in Phase [NUMBER].
>
> Requirements:
> - Follow the PRD specifications for this phase exactly
> - Use realistic placeholder/mock data wherever the UI would normally show real data
> - Keep the design consistent with what's already built — same colors, fonts, spacing, and style
> - Make sure the entire app still runs without errors after your changes
> - The UI should look polished and complete, not like a wireframe
>
> When everything is working:
> - Commit all changes to git with a clear message describing what was built
> - Push to GitHub
>
> Confirm when this phase is complete.

---

**Repeat until all phases are done.** After each phase, refresh your browser to see the new screens and features.

---

### Step 4: Design Iteration

Once all phases are built, the app is functionally complete on the frontend. Now you make it look exactly the way you want. This is the fun part — you just describe what you want changed in plain language.

**Start a new conversation** for design work. Here are examples of things you can say:

**Layout and spacing:**
- *"Add more space between the cards on the wardrobe page"*
- *"Make the sidebar narrower"*
- *"Center the content on the home page"*

**Colors and fonts:**
- *"Change the primary color to a dusty rose / sage green / etc."*
- *"Use a more modern font — something clean like Inter or Poppins"*
- *"Make the background a warm off-white instead of pure white"*

**Components and details:**
- *"Make the outfit cards show a larger image preview"*
- *"Add a subtle shadow to the navigation bar"*
- *"Make the buttons more rounded"*

**Reference other designs:**
- *"Make the wardrobe gallery look like a Pinterest board layout"*
- *"Style the chat interface like iMessage"*

**Using screenshots:** If you see something on another website that you like, take a screenshot and drag it into the Cursor chat. Then say: *"Make my header look similar to this."*

**After each design session, remember to commit:**
- *"Commit these design changes and push to GitHub"*

---

### Step 5: Deploy to a Live URL with Cloudflare Pages

Once your app looks good locally, you can put it on the internet with a real URL. Cloudflare Pages hosts it for free and will automatically update the live site every time you push changes to GitHub.

There are two parts: first the agent configures the project for deployment, then you connect it to Cloudflare through their dashboard.

#### Part A: Configure the project (in Cursor)

**Start a new conversation** and paste this prompt:

---

> The app is a Next.js frontend with no backend. Configure it for static deployment on Cloudflare Pages:
>
> 1. Set `output: 'export'` in the Next.js config so the build produces a static site
> 2. Set `images: { unoptimized: true }` in the Next.js config (required for static export)
> 3. Run `npm run build` to make sure the build succeeds with no errors
> 4. Commit and push these changes to GitHub
>
> Confirm when done and let me know if the build succeeded.

---

**What this does:** It tells Next.js to produce plain HTML/CSS/JS files (a "static export") instead of requiring a server. The build output goes into a folder called `out`, which is what Cloudflare will deploy.

#### Part B: Connect to Cloudflare Pages (in your browser)

This is the only part you do outside of Cursor. It takes about 2 minutes.

1. Go to [https://dash.cloudflare.com](https://dash.cloudflare.com) and log in
2. In the left sidebar, click **Workers & Pages**
3. Click the **Create** button
4. Select the **Pages** tab, then click **Connect to Git**
5. If this is your first time, click **Connect GitHub** and authorize Cloudflare to access your GitHub account
6. Find your project's repository in the list and select it
7. On the build settings screen, fill in these values:

| Setting | Value |
|---------|-------|
| **Production branch** | `main` |
| **Framework preset** | `Next.js (Static HTML Export)` |
| **Build command** | `npm run build` |
| **Build output directory** | `out` |

8. Click **Save and Deploy**

Cloudflare will pull your code from GitHub, build it, and deploy it. This first build usually takes 1–2 minutes.

#### Your live URL

When the deploy finishes, Cloudflare gives you a URL like:

```
https://your-project-name.pages.dev
```

This is your live site. Anyone with the link can open it in their browser — on their phone, laptop, anywhere.

#### Automatic updates

From this point on, every time you push to GitHub (which the agent does at the end of each phase or design session), Cloudflare will automatically rebuild and update the live site within a couple of minutes. You don't need to touch the Cloudflare dashboard again.

#### If the deploy fails

Start a new Cursor conversation and say:

> The Cloudflare Pages build failed. The error was: [paste the error message from the Cloudflare dashboard]. Please fix whatever is causing the build to fail, then commit and push so Cloudflare can rebuild.

You can see build logs by clicking on your project in the Cloudflare dashboard and then clicking on the failed deployment.

---

## Quick Reference

### Starting a new conversation
Click the **`+`** button at the top of the Cursor chat panel. Do this before each major step (new phase, design session, etc.).

### Viewing your app
1. Open the terminal in Cursor: **`Ctrl + backtick`** (the key above Tab)
2. Run: `npm run dev`
3. Open browser to: **http://localhost:3000**

If the server is already running (you'll see output scrolling in the terminal), just refresh your browser.

### Stopping the dev server
Click in the terminal and press **`Ctrl + C`**.

### Referencing files
Type **`@`** in the chat to browse and select files. The agent will read them before responding.

### Viewing your live site
Your Cloudflare Pages URL (something like `https://your-project-name.pages.dev`) updates automatically whenever you push to GitHub. Just refresh the page to see the latest version.

### If something breaks
Don't try to debug it yourself. Start a new conversation and say:

> The app is showing an error when I run `npm run dev`. Here's what I see: [paste the error or describe what happened]. Please fix it and make sure the app runs again. When fixed, commit and push to GitHub.

### If the agent seems confused or stuck
Start a **new conversation**. Long conversations lose focus. A fresh start with a clear prompt almost always works better.

---

## Putting It All Together

Here's the full sequence from start to finish:

| Step | What You Do | New Conversation? |
|------|------------|-------------------|
| 1 | Paste the PRD prompt with your concept doc | Yes |
| 2 | Review the PRD, request any changes | Same conversation |
| 3 | Paste the Phase 1 prompt | **Yes — new conversation** |
| 4 | View the app in your browser | — |
| 5 | Paste the Phase 2 prompt | **Yes — new conversation** |
| 6 | Refresh browser, check progress | — |
| 7 | Repeat for each remaining phase | **Yes — new conversation each time** |
| 8 | Iterate on design with plain-language requests | **Yes — new conversation** |
| 9 | Continue design tweaks as long as you want | Same or new, your call |
| 10 | Deploy to Cloudflare Pages (agent configures, you connect in dashboard) | **Yes — new conversation** |
| 11 | Share your live URL — site auto-updates on every push | — |

Each phase takes roughly 5–10 minutes for the agent to build. A 3–5 phase project can go from concept to full UI in under an hour. After deploying to Cloudflare Pages, every future push updates the live site automatically.

---

## For Future Projects

To start a completely new project using this same workflow:

1. Create a new folder on your computer for the project
2. Open it in Cursor (File → Open Folder)
3. Create a `docs` folder and put your concept summary in it (or have the agent create one from a transcript)
4. Follow this guide starting from **Step 1**

The prompts are the same every time. The only thing that changes is your concept document.
