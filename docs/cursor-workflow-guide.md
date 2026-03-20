# Building a Frontend UI with Cursor — Step-by-Step Guide

This guide walks you through the full workflow: starting from a concept document, generating a PRD, creating a build plan, and building out a complete frontend UI — all inside Cursor using the AI agent.

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

### Step 2: Generate the Build Plan

The build plan takes your PRD and turns it into a single checklist file. Each checkbox is one round of work you'll hand to a fresh agent. You work through the list from top to bottom — same prompt every time, no editing required.

**Start a new conversation.** At the bottom of the chat input, click the mode selector and switch to **Plan** mode. Then paste this prompt:

---

> Read the PRD at `@docs/PRD.md` and create a step-by-step build plan. Save it as `docs/build-plan.md`.
>
> Requirements:
> - Convert every phase from the PRD into one or more checklist tasks using markdown checkboxes (`- [ ]`)
> - Each task should be a self-contained unit of work that one agent session can complete in a single conversation
> - Each task must include enough detail that a fresh agent can complete it **without** reading the PRD — list the specific pages, components, mock data, and UI elements to build
> - **Task 1** must include: setting up the Next.js + Tailwind CSS project, installing all dependencies, building everything described in Phase 1 of the PRD, initializing a git repository, and creating a GitHub repository using the GitHub CLI (`gh repo create`)
> - **Every task** must end with this exact instruction: *"When everything is working and the app runs without errors, commit all changes to git with a clear message describing what was built, and push to GitHub."*
> - Include notes about using realistic placeholder/mock data (example names, images from picsum.photos or similar, realistic numbers) — the app should look populated and real after every task
> - Each task should produce something visually complete — a user should be able to open the app and see polished, real-looking screens after every task
> - Order the tasks so each one builds on the previous ones
>
> Do NOT write any code. Only produce the build plan document.

---

**What to do after:** Read through the build plan. Each checkbox is one round of work. Make sure the tasks flow logically and nothing from the PRD was left out. If you want to adjust anything, tell the agent in the same conversation: *"Break that task into two smaller ones"* or *"Add a task for the settings page."*

---

### Step 3: Build the App (One Task at a Time)

Now you work through the build plan, one checkbox at a time. **You use the exact same prompt every time — no editing, no swapping out phase numbers.**

**Start a new conversation** (switch back to **Agent** mode if you're still in Plan mode) and paste this prompt:

---

> Read the build plan at `@docs/build-plan.md`. Find the first unchecked task (the first line starting with `- [ ]`) and complete everything it describes.
>
> Requirements:
> - Build exactly what the task specifies
> - Use realistic placeholder/mock data wherever the UI would normally show real data
> - Keep the design consistent with what's already built — same colors, fonts, spacing, and style
> - Make sure the entire app runs without errors after your changes
> - Follow the commit and push instructions included in the task
> - After committing and pushing, mark the task as complete by changing its `- [ ]` to `- [x]` in `docs/build-plan.md`
>
> Confirm when the task is complete and tell me how to view the app in my browser.

---

**This is the only prompt you need for the entire build.** Paste the exact same thing in a new conversation for every task. The agent reads the plan, finds the next unchecked box, builds it, pushes the code to GitHub, and checks it off. You never have to edit the prompt.

#### How to View Your App

After the first task completes (the one that sets up the project), the agent will tell you how to run the app. From then on:

1. Open Cursor's terminal (`Ctrl + backtick`)
2. Type `npm run dev` and press Enter
3. Open your browser (Chrome, Safari, etc.) and go to **http://localhost:3000**

Leave the terminal running — it's your local server. After each subsequent task, just refresh your browser to see the new screens. If you close Cursor or the terminal, you'll need to run `npm run dev` again next time.

#### Tracking Your Progress

Open `docs/build-plan.md` at any time to see where you stand — checked boxes are done, unchecked boxes are what's left. **Repeat until all boxes are checked.**

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

From this point on, every time you push to GitHub (which the agent does at the end of each task or design session), Cloudflare will automatically rebuild and update the live site within a couple of minutes. You don't need to touch the Cloudflare dashboard again.

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
| 3 | Switch to Plan mode, paste the build plan prompt | **Yes — new conversation** |
| 4 | Review the plan, request any changes | Same conversation |
| 5 | Switch to Agent mode, paste the build prompt | **Yes — new conversation** |
| 6 | View the app in your browser | — |
| 7 | Paste the **same** build prompt for each remaining task | **Yes — new conversation each time** |
| 8 | Refresh browser after each task, check your progress | — |
| 9 | Iterate on design with plain-language requests | **Yes — new conversation** |
| 10 | Deploy to Cloudflare Pages (agent configures, you connect in dashboard) | **Yes — new conversation** |
| 11 | Share your live URL — site auto-updates on every push | — |

Each task takes roughly 5–10 minutes for the agent to build. A typical project has 5–8 tasks and can go from concept to full UI in under an hour. After deploying to Cloudflare Pages, every future push updates the live site automatically.

---

## For Future Projects

To start a completely new project using this same workflow:

1. Create a new folder on your computer for the project
2. Open it in Cursor (File → Open Folder)
3. Create a `docs` folder and put your concept summary in it (or have the agent create one from a transcript)
4. Follow this guide starting from **Step 1**

The prompts are the same every time. The only thing that changes is your concept document.
