# 📖 The Ultimate Zero-to-Live Deployment Manual
**Project: AlgoPath LFA Builder**

This is a comprehensive, "hold-your-hand" guide to taking the AlgoPath project from your local computer to a live, professional-grade website accessible to anyone in the world.

**We will use the "Golden Stack" (Best Free Options):**
1.  **Neon** (Database) - Where your data lives (Forever Free Tier).
2.  **Render** (Backend) - Where your Python logic runs (Free Tier).
3.  **Vercel** (Frontend) - Where your React website lives (Free Tier).

---

## 🏗️ Understanding the Project Structure (Read This First)
*How does one repository become two different websites?*

Your project is set up as a **Monorepo** (Single Repository). This means both the Backend (Python) and Frontend (React) code live in the same Git repository, but in separate folders.

### The "Split" Strategy
When we deploy, we don't deploy the "whole thing" to one place. We tell the hosting services to only look at *their* specific folder.

*   **Render** will look ONLY at the `backend/` folder.
*   **Vercel** will look ONLY at the `frontend/` folder.

### Your Directory Structure
This is how your files are organized on GitHub, and how we map them to deployment:

```text
algopathv1/                  <-- ROOT of your Repository
├── backend/                 <-- DEPLOY THIS TO RENDER
│   ├── app/                 <-- Source code for API
│   ├── requirements.txt     <-- List of Python libraries to install
│   ├── uvicorn...           <-- Server start logic
│   └── ...
│
├── frontend/                <-- DEPLOY THIS TO VERCEL
│   ├── app/                 <-- Source code for Website
│   ├── package.json         <-- List of JS libraries to install
│   ├── next.config.js       <-- Next.js settings
│   └── ...
│
├── .gitignore               <-- Tells git what to ignore (like venv/)
├── README.md
└── deploy.md
```

### The "Magic Setting": Root Directory
In the steps below, you will see a setting called **Root Directory**. This is the most critical setting.
*   By setting Root Directory to `backend` on Render, it ignores the frontend folder completely.
*   By setting Root Directory to `frontend` on Vercel, it ignores the backend folder completely.

---

## ✅ Part 0: Prerequisites (The "Before We Start" Check)

Before doing anything online, verify your Codebase is ready.

1.  **Open your project folder** in VS Code or File Explorer.
2.  **Verify Git is connected:**
    *   Open your terminal/command prompt.
    *   Type: `git status`
    *   If it says "On branch updatedbackend" (or similar) and "nothing to commit", you are good.
    *   *If you have unsaved changes:*
        ```bash
        git add .
        git commit -m "Final check before deployment"
        git push origin updatedbackend
        ```
3.  **Verify your OpenAI Key:**
    *   Make sure you have your `sk-...` key written down in a safe Notepad file. You cannot get it back from the `.env` file if you didn't save it elsewhere (though you can copy it from there now if needed).
    *   *You will need this string later.*

---

## 🏛️ Part 1: The Database (Neon)
*We need a virtual "filing cabinet" for your LFA sessions.*

### Step 1: Create Account
1.  Go to [https://console.neon.tech/register](https://console.neon.tech/register).
2.  Click **"Sign up with GitHub"**.
3.  Authorize Neon to access your GitHub account.

### Step 2: Create Project
1.  Once logged in, you will see a "Create a project" screen.
2.  **Name:** `algopath-db`
3.  **Postgres Version:** Default (e.g., 15 or 16) is fine.
4.  **Region:** Select the region closest to where your users are (e.g., `Singapore`, `US East`).
5.  Click **"Create Project"**.

### Step 3: Get the Connection String
1.  You will be shown a popup titled **"Connection Details"**.
2.  Look for a long string starting with `postgres://...`.
3.  **Click the "Copy" icon** next to it.
4.  **Action:** Paste this into your Notepad. Label it: `[NEON DATABASE URL]`.
5.  **Critical Fix:** Look at the string you pasted.
    *   If it starts with `postgres://`, change it to `postgresql://`.
    *   *Example:* `postgres://neondb...` ➔ `postgresql://neondb...`
    *   (This is required for the Python code to work).

---

## ⚙️ Part 2: The Backend (Render)
*This is the "Brain" of your application. It processes the AI requests.*

### Step 1: Create Account
1.  Go to [https://dashboard.render.com/register](https://dashboard.render.com/register).
2.  Click **"Sign up with GitHub"**.

### Step 2: Create Web Service
1.  On the Dashboard, find the **"New +"** button (top right).
2.  Click it and select **"Web Service"**.
3.  Under "Connect a repository", ensure "Public Repositories" is selected (or connect your GitHub account if private).
4.  Find/Select your repo: `algopathv1`.
    *   *If you don't see it, click "Connect account" under GitHub on the right side.*

### Step 3: Configure the Service
Fill out the form exactly as follows. **Do not guess.**

*   **Name:** `algopath-backend`
*   **Region:** Same as your Database (e.g., Singapore).
*   **Branch:** `updatedbackend` (This is the branch we pushed code to).
*   **Root Directory:** `backend`  **<-- THIS IS CRITICAL**
    *   *Why?* We are telling Render: "Ignore everything else. Only look inside the 'backend' folder."
*   **Runtime:** `Python 3`
*   **Build Command:** `pip install -r requirements.txt`
    *   *Why?* Render looks for `requirements.txt` inside the `backend` folder to know what to install.
*   **Start Command:** `uvicorn app.api.server:app --host 0.0.0.0 --port $PORT`
    *   *Why?* This launches the specific server file located at `backend/app/api/server.py`.
*   **Instance Type:** Select **"Free"**.

### Step 4: Environment Variables (The Keys)
Scroll down to the "Environment Variables" section. You need to add **3** variables.

1.  **Click "Add Environment Variable"**:
    *   Key: `OPENAI_API_KEY`
    *   Value: Paste your `sk-...` key here.
2.  **Click "Add Environment Variable"**:
    *   Key: `DATABASE_URL`
    *   Value: Paste your **Modified Neon URL** (the one starting with `postgresql://`).
3.  **Click "Add Environment Variable"**:
    *   Key: `PYTHON_VERSION`
    *   Value: `3.11.9`
    *   *Why?* Ensures compatibility with modern libraries.

### Step 5: Deploy
1.  Click the blue **"Create Web Service"** button.
2.  **Wait.** You will be taken to a logs screen.
    *   You will see lines like `Collecting fastapi...` (Installing).
    *   Wait for about 3-5 minutes.
3.  **Success:** Look for a line that says `Application startup complete` or specific success flags.
    *   Top left, under "algopath-backend", you will see a URL.
    *   Example: `https://algopath-backend.onrender.com`
    *   **Action:** Copy this URL. Paste into Notepad as `[BACKEND URL]`.

---

## 🎨 Part 3: The Frontend (Vercel)
*This is the "Face" of your application. The website users visit.*

### Step 1: Create Account
1.  Go to [https://vercel.com/signup](https://vercel.com/signup).
2.  Click **"Continue with GitHub"**.

### Step 2: Import Project
1.  On the Vercel Dashboard, click **"Add New..."** ➔ **"Project"**.
2.  You will see a list of your GitHub repos.
3.  Find `algopathv1` and click **"Import"**.

### Step 3: Configure Project
1.  **Project Name:** `algopath-builder` (or similar).
2.  **Framework Preset:** `Next.js` (Should be auto-detected).
3.  **Root Directory:**
    *   It typically defaults to `./`. **This is wrong for us.**
    *   Click **"Edit"**.
    *   Select the `frontend` folder.
    *   *Why?* We are telling Vercel: "The website code lives here. Don't try to build the python backend code."
    *   Click "Continue".

### Step 4: Environment Variables
1.  Click to expand the **"Environment Variables"** section.
2.  Add the variable that tells the Frontend where the Backend lives:
    *   **Key:** `NEXT_PUBLIC_API_URL`
    *   **Value:** Paste your `[BACKEND URL]` from Part 2.
    *   *Important:* Do **not** put a trailing slash `/` at the end.
        *   ✅ Right: `https://algopath-backend.onrender.com`
        *   ❌ Wrong: `https://algopath-backend.onrender.com/`

### Step 5: Deploy
1.  Click **"Deploy"**.
2.  **Wait.** You will see a terminal building your site.
3.  After ~1-2 minutes, you will see a full-screen "Congratulations!" animation.
4.  **Action:** Click the "Visit" button or click on the domain preview (e.g., `algopath-builder.vercel.app`).
5.  **Copy this URL.** Paste into Notepad as `[FRONTEND URL]`.

---

## 🔌 Part 4: Connecting the Wires (CORS)
*Right now, the Backend doesn't trust the Frontend. Let's introduce them.*

1.  Go back to your **Render Dashboard**.
2.  Click on your `algopath-backend` service.
3.  Click the **"Environment"** tab on the left sidebar.
4.  Click **"Add Environment Variable"**.
5.  **Key:** `FRONTEND_URL`
6.  **Value:** Paste your `[FRONTEND URL]` (e.g., `https://algopath-builder.vercel.app`).
    *   *Again, no trailing slash.*
7.  Click **"Save Changes"**.
8.  Render will automatically restart your backend service. This takes about **60 seconds**.

---

## 🚀 Part 5: Final Testing
*Let's prove it works.*

1.  Open your **Frontend URL** in a generic browser tab (e.g., Chrome).
2.  **Enter Input:** Type "A vocational training program for women in rural India".
3.  **Click "Start Session"**.
4.  **Observe:**
    *   The button should say "Processing..." or "Thinking...".
    *   **Wait:** The backend (running on free tier) might be "sleeping". The first request can take **45-60 seconds**. *Be patient.*
5.  **Result:**
    *   If you see a list of 10-15 clarifying questions appear ➔ **SUCCESS!** 🎉
    *   Answer a few questions and click "Generate".
    *   verify the diagrams appear.

---

## 🆘 Troubleshooting Manual

**Issue 1: "It just spins forever on the first click."**
*   **Cause:** Render Free Tier puts apps to sleep after inactivity.
*   **Fix:** Wait at least 60 seconds on the first try. Reload the page and try again.

**Issue 2: "Network Error" or "Failed to Fetch" popup.**
*   **Check:** Did you set `NEXT_PUBLIC_API_URL` correctly in Vercel?
*   **Check:** Is the Render backend actually running (green "Live" dot)?
*   **Check:** Open Developer Tools (F12) ➔ Console. If it says `CORS error`, you didn't do Part 4 correctly.

**Issue 3: "Internal Server Error" (500).**
*   **Cause:** Usually the Database or OpenAI key.
*   **Fix:** Check Render Logs.
    *   If log says `authentication failed`, your `DATABASE_URL` is wrong.
    *   If log says `Incorrect API key`, your `OPENAI_API_KEY` is wrong.

**Issue 4: Deployment fails on Vercel.**
*   **Cause:** Usually "Root Directory" was not set.
*   **Fix:** Go to Vercel Settings ➔ General ➔ Root Directory ➔ Edit ➔ Select `frontend`. Redeploy.

---

**You have now successfully deployed a full-stack AI application.**
*   **Management:** No maintenance needed.
*   **Cost:** $0.00/month.
