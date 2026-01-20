# AlgoPath LFA Builder - Complete Deployment Guide

## FOR ABSOLUTE BEGINNERS - NO DEVOPS EXPERIENCE REQUIRED

This guide will walk you through deploying your LFA Builder application step-by-step. Even if you've never deployed anything before, you'll be able to follow along.

---

## Table of Contents

1. [What You're Deploying](#1-what-youre-deploying)
2. [What You'll Need Before Starting](#2-what-youll-need-before-starting)
3. [Understanding the Architecture](#3-understanding-the-architecture)
4. [Step 1: Get Your OpenAI API Key](#step-1-get-your-openai-api-key)
5. [Step 2: Set Up Free PostgreSQL Database (Neon)](#step-2-set-up-free-postgresql-database-neon)
6. [Step 3: Deploy Backend to Render](#step-3-deploy-backend-to-render)
7. [Step 4: Deploy Frontend to Vercel](#step-4-deploy-frontend-to-vercel)
8. [Step 5: Connect Everything Together](#step-5-connect-everything-together)
9. [Step 6: Test Your Deployment](#step-6-test-your-deployment)
10. [Troubleshooting Common Issues](#troubleshooting-common-issues)
11. [Monitoring Your Application](#monitoring-your-application)
12. [Updating Your Application](#updating-your-application)
13. [Cost Breakdown](#cost-breakdown)
14. [Security Best Practices](#security-best-practices)
15. [Glossary of Terms](#glossary-of-terms)

---

## 1. What You're Deploying

### Your Application Has Three Parts:

```mermaid
graph LR
    subgraph "Your Users"
        USER[("Users")]
    end

    subgraph "Frontend - What Users See"
        FE["Next.js Website<br/>(Vercel - FREE)"]
    end

    subgraph "Backend - The Brain"
        BE["Python FastAPI<br/>(Render - FREE)"]
    end

    subgraph "Database - Memory"
        DB[("PostgreSQL<br/>(Neon - FREE)")]
    end

    subgraph "AI Service"
        AI["OpenAI GPT-4<br/>(Pay per use)"]
    end

    USER -->|"visits website"| FE
    FE -->|"sends requests"| BE
    BE -->|"stores data"| DB
    BE -->|"generates LFA"| AI

    style FE fill:#00d4ff,color:#000
    style BE fill:#ff6b6b,color:#000
    style DB fill:#4ecdc4,color:#000
    style AI fill:#ffe66d,color:#000
```

### In Simple Terms:

| Part | What It Does | Where We'll Put It | Cost |
|------|-------------|-------------------|------|
| **Frontend** | The website your users see and interact with | Vercel | FREE |
| **Backend** | The "brain" that processes requests and talks to AI | Render | FREE |
| **Database** | Stores user sessions and generated LFA documents | Neon | FREE |
| **OpenAI** | The AI that generates the LFA content | OpenAI | ~$0.01-0.10 per LFA |

---

## 2. What You'll Need Before Starting

### Required Accounts (All Free to Create):

1. **GitHub Account** - To store your code
   - Go to: https://github.com
   - Click "Sign up" and follow the steps

2. **Vercel Account** - To host your frontend
   - Go to: https://vercel.com
   - Click "Sign up" (use your GitHub account)

3. **Render Account** - To host your backend
   - Go to: https://render.com
   - Click "Get Started" (use your GitHub account)

4. **Neon Account** - For your database
   - Go to: https://neon.tech
   - Click "Sign up" (use your GitHub account)

5. **OpenAI Account** - For AI features
   - Go to: https://platform.openai.com
   - Click "Sign up" and add payment method
   - You'll get $5-18 free credits for new accounts

### Time Required:
- First-time setup: 45-60 minutes
- Future deployments: 5-10 minutes (automatic)

---

## 3. Understanding the Architecture

### How Everything Connects:

```mermaid
flowchart TB
    subgraph INTERNET["THE INTERNET"]
        USER["User's Browser"]
    end

    subgraph VERCEL["VERCEL (Frontend Hosting)"]
        direction TB
        VF["Your Next.js App"]
        VD["Vercel's Servers<br/>Location: Global CDN"]
    end

    subgraph RENDER["RENDER (Backend Hosting)"]
        direction TB
        RF["Your Python API"]
        RD["Render's Servers<br/>Location: Oregon, USA"]
    end

    subgraph NEON["NEON (Database)"]
        direction TB
        NF[("PostgreSQL Database")]
        ND["Neon's Servers<br/>Location: US East"]
    end

    subgraph OPENAI["OPENAI"]
        direction TB
        OF["GPT-4o Model"]
    end

    USER -->|"1. Opens website"| VF
    VF -->|"2. User submits program description"| RF
    RF -->|"3. Saves session"| NF
    RF -->|"4. Asks AI to generate LFA"| OF
    OF -->|"5. Returns generated LFA"| RF
    RF -->|"6. Saves LFA to database"| NF
    RF -->|"7. Sends LFA to frontend"| VF
    VF -->|"8. Shows LFA to user"| USER

    style USER fill:#f9f,stroke:#333,stroke-width:2px
    style VF fill:#00d4ff,color:#000
    style RF fill:#ff6b6b,color:#000
    style NF fill:#4ecdc4,color:#000
    style OF fill:#ffe66d,color:#000
```

### The Data Flow - Step by Step:

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (Vercel)
    participant B as Backend (Render)
    participant D as Database (Neon)
    participant A as AI (OpenAI)

    Note over U,A: Step 1: User Describes Their Program
    U->>F: Types program description
    F->>B: POST /api/start
    B->>A: "Analyze this program"
    A-->>B: Returns structured brief + questions
    B->>D: Save session
    B-->>F: Return questions
    F-->>U: Display questions to answer

    Note over U,A: Step 2: User Answers Questions
    U->>F: Submits answers
    F->>B: POST /api/answers
    B->>A: "Generate complete LFA"
    A-->>B: Returns full LFA document
    B->>D: Save LFA
    B-->>F: Return LFA + visualizations
    F-->>U: Display beautiful LFA
```

---

## Step 1: Get Your OpenAI API Key

### Why You Need This:
The OpenAI API key is like a password that lets your application use GPT-4 to generate LFA documents. Without it, the AI features won't work.

### How to Get It:

#### 1.1 Create an OpenAI Account

```
1. Go to: https://platform.openai.com
2. Click "Sign up" in the top right
3. Enter your email or use Google/Microsoft account
4. Verify your email
5. Complete your profile
```

#### 1.2 Add Payment Method

```mermaid
flowchart LR
    A["Sign Up"] --> B["Verify Email"]
    B --> C["Go to Billing"]
    C --> D["Add Payment Method"]
    D --> E["Set Usage Limit"]
    E --> F["Get API Key"]

    style F fill:#4ecdc4,color:#000
```

**Steps:**
```
1. After logging in, click your profile icon (top right)
2. Click "Billing"
3. Click "Add payment method"
4. Enter your credit/debit card details
5. IMPORTANT: Set a usage limit ($5-10 recommended for testing)
   - Go to "Usage limits"
   - Set "Hard limit" to $10
   - This prevents unexpected charges!
```

#### 1.3 Generate Your API Key

```
1. Go to: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Give it a name: "LFA Builder Production"
4. Click "Create secret key"
5. COPY THE KEY IMMEDIATELY!
   - It looks like: sk-proj-xxxxxxxxxxxxxxxxxxxx
   - You can only see it ONCE
   - Save it in a secure place (password manager, encrypted note)
```

### Save This Information:
```
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

---

## Step 2: Set Up Free PostgreSQL Database (Neon)

### Why You Need This:
The database stores:
- User sessions
- Generated LFA documents
- Progress data

Without a database, users would lose their work when they close the browser.

### How to Set Up Neon:

#### 2.1 Create Neon Account

```mermaid
flowchart LR
    A["Go to neon.tech"] --> B["Sign up with GitHub"]
    B --> C["Create Project"]
    C --> D["Create Database"]
    D --> E["Get Connection String"]

    style E fill:#4ecdc4,color:#000
```

**Steps:**
```
1. Go to: https://neon.tech
2. Click "Sign up"
3. Choose "Continue with GitHub" (easiest option)
4. Authorize Neon to access your GitHub
```

#### 2.2 Create Your First Project

```
1. After signing up, you'll see "Create a project"
2. Fill in:
   - Project name: lfa-builder
   - Region: US East (Ohio) - closest to most users
   - PostgreSQL version: 16 (latest)
3. Click "Create project"
```

#### 2.3 Get Your Database Connection String

```
After creating the project, you'll see a connection string.
It looks like this:

postgresql://username:password@ep-xxx-xxx-123456.us-east-1.aws.neon.tech/neondb?sslmode=require

SAVE THIS! You'll need it later.
```

### Visual Guide to Neon Dashboard:

```
+------------------------------------------------------------------+
|  NEON Dashboard                                         [user]   |
+------------------------------------------------------------------+
|                                                                  |
|  Project: lfa-builder                                            |
|  ------------------------                                        |
|                                                                  |
|  Connection Details:                                             |
|  +-----------------------------------------------------------+  |
|  | Host: ep-xxx-xxx-123456.us-east-1.aws.neon.tech           |  |
|  | Database: neondb                                           |  |
|  | User: your-username                                        |  |
|  | Password: ************ [Show]                              |  |
|  +-----------------------------------------------------------+  |
|                                                                  |
|  Connection String: [Copy]                                       |
|  postgresql://user:pass@host/db?sslmode=require                  |
|                                                                  |
+------------------------------------------------------------------+
```

### Save This Information:
```
DATABASE_URL=postgresql://username:password@ep-xxx-xxx-123456.us-east-1.aws.neon.tech/neondb?sslmode=require
```

---

## Step 3: Deploy Backend to Render

### Why Render?
- Free tier available
- Perfect for Python/FastAPI
- Automatic HTTPS (secure)
- Easy environment variables
- Automatic deploys from GitHub

### 3.1 First: Upload Your Code to GitHub

If your code isn't on GitHub yet, follow these steps:

#### Create a New Repository:

```
1. Go to: https://github.com/new
2. Fill in:
   - Repository name: lfa-builder
   - Description: AI-powered LFA document builder
   - Choose: Public or Private (your choice)
   - DON'T check "Initialize this repository"
3. Click "Create repository"
```

#### Upload Your Code:

Open your terminal/command prompt in your project folder:

```bash
# Navigate to your project folder
cd path/to/algopathv1-finalbackend

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: LFA Builder application"

# Connect to GitHub (replace with your repo URL)
git remote add origin https://github.com/YOUR-USERNAME/lfa-builder.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3.2 Create Render Account and Service

#### Sign Up for Render:

```
1. Go to: https://render.com
2. Click "Get Started for Free"
3. Choose "GitHub" to sign up
4. Authorize Render to access your GitHub
```

#### Create a New Web Service:

```mermaid
flowchart TB
    A["Render Dashboard"] --> B["New +"]
    B --> C["Web Service"]
    C --> D["Connect GitHub Repo"]
    D --> E["Configure Service"]
    E --> F["Add Environment Variables"]
    F --> G["Deploy!"]

    style G fill:#4ecdc4,color:#000
```

**Step-by-Step:**

```
1. From Render Dashboard, click "New +"
2. Select "Web Service"
3. Connect your GitHub repository:
   - Click "Connect GitHub"
   - Select your lfa-builder repository
   - Click "Connect"
```

#### Configure the Service:

```
Fill in these settings:

+------------------------------------------------------------------+
|  Create Web Service                                              |
+------------------------------------------------------------------+
|                                                                  |
|  Name: lfa-builder-api                                           |
|                                                                  |
|  Region: Oregon (US West)                                        |
|                                                                  |
|  Branch: main                                                    |
|                                                                  |
|  Root Directory: backend                                         |
|  (Important! Your Python code is in the backend folder)          |
|                                                                  |
|  Runtime: Python 3                                               |
|                                                                  |
|  Build Command:                                                  |
|  pip install -r requirements.txt                                 |
|                                                                  |
|  Start Command:                                                  |
|  uvicorn app.api.server:app --host 0.0.0.0 --port $PORT          |
|                                                                  |
|  Instance Type: Free                                             |
|                                                                  |
+------------------------------------------------------------------+
```

### 3.3 Add Environment Variables

This is CRITICAL! Your app needs these to work.

```
Scroll down to "Environment Variables" section and add each one:

Click "Add Environment Variable" for each:

+----------------------------+-----------------------------------------+
| Key                        | Value                                   |
+----------------------------+-----------------------------------------+
| OPENAI_API_KEY             | sk-proj-your-key-from-step-1            |
+----------------------------+-----------------------------------------+
| DATABASE_URL               | postgresql://...from-step-2...          |
+----------------------------+-----------------------------------------+
| ENV                        | production                              |
+----------------------------+-----------------------------------------+
| HOST                       | 0.0.0.0                                 |
+----------------------------+-----------------------------------------+
| PORT                       | 10000                                   |
+----------------------------+-----------------------------------------+
| FRONTEND_URL               | (leave blank for now, add after step 4) |
+----------------------------+-----------------------------------------+
| OPENAI_MODEL               | gpt-4o                                  |
+----------------------------+-----------------------------------------+
| LLM_TEMPERATURE            | 0.4                                     |
+----------------------------+-----------------------------------------+
| LLM_TIMEOUT                | 90                                      |
+----------------------------+-----------------------------------------+
| SESSION_TTL_HOURS          | 24                                      |
+----------------------------+-----------------------------------------+
```

### 3.4 Deploy!

```
1. Click "Create Web Service"
2. Wait for the build (5-10 minutes first time)
3. Watch the logs for any errors
```

### What You Should See:

```
==> Building...
==> Installing dependencies...
==> pip install -r requirements.txt
...
Successfully installed fastapi-0.109.0 uvicorn-0.27.0 ...
==> Build successful!
==> Deploying...
==> Your service is live!

https://lfa-builder-api.onrender.com
```

### Save Your Backend URL:
```
BACKEND_URL=https://lfa-builder-api.onrender.com
```

### Verify It's Working:

Open in browser:
```
https://lfa-builder-api.onrender.com/docs
```

You should see the FastAPI documentation page!

```mermaid
flowchart LR
    A["Your Backend URL"] --> B["/docs"]
    B --> C["FastAPI Swagger UI"]
    C --> D["Try /api/health endpoint"]
    D --> E["Should return: status: healthy"]

    style E fill:#4ecdc4,color:#000
```

---

## Step 4: Deploy Frontend to Vercel

### Why Vercel?
- Made by Next.js creators (perfect compatibility)
- Free tier is generous
- Automatic HTTPS
- Global CDN (fast everywhere)
- Automatic deploys from GitHub

### 4.1 Sign Up for Vercel

```
1. Go to: https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub
```

### 4.2 Import Your Project

```mermaid
flowchart TB
    A["Vercel Dashboard"] --> B["Add New..."]
    B --> C["Project"]
    C --> D["Import Git Repository"]
    D --> E["Select lfa-builder"]
    E --> F["Configure Project"]
    F --> G["Add Environment Variables"]
    G --> H["Deploy!"]

    style H fill:#4ecdc4,color:#000
```

**Step-by-Step:**

```
1. From Vercel Dashboard, click "Add New..."
2. Select "Project"
3. Find your lfa-builder repository
4. Click "Import"
```

### 4.3 Configure the Project

```
+------------------------------------------------------------------+
|  Configure Project                                               |
+------------------------------------------------------------------+
|                                                                  |
|  Project Name: lfa-builder                                       |
|                                                                  |
|  Framework Preset: Next.js (auto-detected)                       |
|                                                                  |
|  Root Directory: frontend                                        |
|  (Click "Edit" and type: frontend)                               |
|                                                                  |
|  Build and Output Settings: (leave defaults)                     |
|  - Build Command: next build                                     |
|  - Output Directory: .next                                       |
|                                                                  |
+------------------------------------------------------------------+
```

### 4.4 Add Environment Variables

```
Click "Environment Variables" and add:

+----------------------------+-----------------------------------------+
| Name                       | Value                                   |
+----------------------------+-----------------------------------------+
| NEXT_PUBLIC_API_URL        | https://lfa-builder-api.onrender.com    |
|                            | (Your backend URL from Step 3)          |
+----------------------------+-----------------------------------------+
```

### 4.5 Deploy!

```
1. Click "Deploy"
2. Wait for the build (2-5 minutes)
3. Watch the build logs
```

### What You Should See:

```
Cloning github.com/your-username/lfa-builder (Branch: main, Commit: abc123)
Running build in: /vercel/path0/frontend
Installing dependencies...
npm install
Building...
next build
Build completed successfully!
Deployed to: https://lfa-builder.vercel.app
```

### Save Your Frontend URL:
```
FRONTEND_URL=https://lfa-builder.vercel.app
```

---

## Step 5: Connect Everything Together

Now we need to tell the backend about the frontend (for security).

### 5.1 Update Backend Environment Variable

```
1. Go to: https://dashboard.render.com
2. Click on your "lfa-builder-api" service
3. Click "Environment" in the left sidebar
4. Find "FRONTEND_URL" and click the pencil icon to edit
5. Add your Vercel URL:
   FRONTEND_URL=https://lfa-builder.vercel.app
6. Click "Save Changes"
7. The service will automatically redeploy
```

### Complete Architecture After Deployment:

```mermaid
flowchart TB
    subgraph USERS["Users Worldwide"]
        U1["User in India"]
        U2["User in USA"]
        U3["User in UK"]
    end

    subgraph VERCEL["Vercel Global CDN"]
        V1["Edge Server India"]
        V2["Edge Server USA"]
        V3["Edge Server UK"]
        VM["Main: lfa-builder.vercel.app"]
    end

    subgraph RENDER["Render (Oregon, USA)"]
        R1["lfa-builder-api.onrender.com"]
        R2["Python FastAPI Server"]
    end

    subgraph NEON["Neon (US East)"]
        N1[("PostgreSQL Database")]
    end

    subgraph OPENAI["OpenAI"]
        O1["GPT-4o API"]
    end

    U1 --> V1
    U2 --> V2
    U3 --> V3
    V1 & V2 & V3 --> VM
    VM --> R1
    R1 --> R2
    R2 --> N1
    R2 --> O1

    style VM fill:#00d4ff,color:#000
    style R2 fill:#ff6b6b,color:#000
    style N1 fill:#4ecdc4,color:#000
    style O1 fill:#ffe66d,color:#000
```

---

## Step 6: Test Your Deployment

### 6.1 Check Backend Health

Open in browser:
```
https://lfa-builder-api.onrender.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "LFA Builder API",
  "version": "1.0.0",
  "active_sessions": 0
}
```

### 6.2 Check Frontend

Open in browser:
```
https://lfa-builder.vercel.app
```

You should see the LFA Builder wizard!

### 6.3 Full Test - Create an LFA

```mermaid
flowchart LR
    A["1. Open Website"] --> B["2. Enter Program Description"]
    B --> C["3. Click Submit"]
    C --> D["4. Wait for Questions"]
    D --> E["5. Answer Questions"]
    E --> F["6. Get Your LFA!"]

    style F fill:#4ecdc4,color:#000
```

**Test Steps:**

```
1. Go to: https://lfa-builder.vercel.app

2. Enter a test program description:
   "We want to improve literacy outcomes for Grade 1-3 students
   in rural Uttar Pradesh through teacher training and mentoring
   support. Our focus is on foundational literacy and numeracy (FLN)
   with emphasis on activity-based learning methods."

3. Click "Start Building LFA"

4. Wait for questions to appear (may take 30-60 seconds first time)

5. Answer each question

6. Click "Generate LFA"

7. View your generated LFA with visualizations!
```

### If Everything Works:

```
[x] Backend API responds with healthy status
[x] Frontend loads without errors
[x] Questions are generated from your description
[x] LFA document is created after answering questions
[x] Mermaid diagrams render correctly
[x] Export to DOCX/CSV works
```

---

## Troubleshooting Common Issues

### Issue 1: Backend Not Starting

```mermaid
flowchart TB
    A["Backend won't start"] --> B{"Check Render logs"}
    B --> C["ModuleNotFoundError"]
    B --> D["Connection refused"]
    B --> E["OpenAI error"]

    C --> C1["Solution: Check requirements.txt<br/>includes all packages"]
    D --> D1["Solution: Check DATABASE_URL<br/>is correct"]
    E --> E1["Solution: Check OPENAI_API_KEY<br/>is valid and has credits"]

    style C1 fill:#4ecdc4,color:#000
    style D1 fill:#4ecdc4,color:#000
    style E1 fill:#4ecdc4,color:#000
```

**How to Check Render Logs:**
```
1. Go to: https://dashboard.render.com
2. Click on your service
3. Click "Logs" in the left sidebar
4. Look for red ERROR messages
```

**Common Error Solutions:**

| Error Message | Cause | Solution |
|---------------|-------|----------|
| `ModuleNotFoundError: No module named 'xxx'` | Missing dependency | Add to requirements.txt and redeploy |
| `sqlalchemy.exc.OperationalError: could not connect` | Wrong DATABASE_URL | Check Neon connection string |
| `openai.AuthenticationError` | Invalid API key | Regenerate OpenAI API key |
| `openai.RateLimitError` | No credits or exceeded limit | Add payment method to OpenAI |

### Issue 2: Frontend Shows "Unable to connect to server"

```mermaid
flowchart TB
    A["Can't connect to server"] --> B{"Check these"}
    B --> C["Is NEXT_PUBLIC_API_URL correct?"]
    B --> D["Is backend running?"]
    B --> E["Is FRONTEND_URL set in backend?"]

    C --> C1["Must match your Render URL exactly"]
    D --> D1["Check Render dashboard - should say 'Live'"]
    E --> E1["Must match your Vercel URL for CORS"]

    style C1 fill:#4ecdc4,color:#000
    style D1 fill:#4ecdc4,color:#000
    style E1 fill:#4ecdc4,color:#000
```

**CORS Error Example:**
```
Access to fetch at 'https://lfa-builder-api.onrender.com/api/start'
from origin 'https://lfa-builder.vercel.app' has been blocked by CORS policy
```

**Solution:**
```
1. Go to Render dashboard
2. Open your backend service
3. Go to Environment
4. Make sure FRONTEND_URL = https://lfa-builder.vercel.app
   (Must match EXACTLY - no trailing slash!)
5. Service will redeploy automatically
```

### Issue 3: Slow First Response (Cold Start)

This is NORMAL on free tiers!

```mermaid
flowchart LR
    A["First request"] --> B["Server wakes up<br/>(15-30 seconds)"]
    B --> C["Processes request<br/>(30-60 seconds)"]
    C --> D["Response"]

    E["Second request"] --> F["Server already awake<br/>(instant)"]
    F --> G["Processes request<br/>(30-60 seconds)"]
    G --> H["Response"]

    style B fill:#ffe66d,color:#000
    style F fill:#4ecdc4,color:#000
```

**Why It Happens:**
- Free tier services "sleep" after 15 minutes of inactivity
- First request must "wake up" the server
- This can take 15-30 seconds

**Solutions:**
```
Option 1: Just wait (it's free!)

Option 2: Use a ping service to keep it awake
- Use https://uptimerobot.com (free)
- Set up a monitor to ping your /api/health every 14 minutes
- This keeps the server from sleeping

Option 3: Upgrade to paid tier ($7/month on Render)
- No cold starts
- Better performance
```

### Issue 4: Database Connection Errors

```
Error: connection refused to host ep-xxx.neon.tech
```

**Solutions:**
```
1. Check your DATABASE_URL is complete with ?sslmode=require

2. Make sure you copied the full connection string from Neon

3. Try regenerating the password in Neon:
   - Go to Neon dashboard
   - Click on your project
   - Go to "Settings"
   - Click "Reset password"
   - Update DATABASE_URL in Render
```

### Issue 5: OpenAI API Errors

```mermaid
flowchart TB
    A["OpenAI Error"] --> B{"Error Type"}
    B --> C["AuthenticationError"]
    B --> D["RateLimitError"]
    B --> E["InvalidRequestError"]
    B --> F["Timeout"]

    C --> C1["Regenerate API key<br/>Check it starts with sk-"]
    D --> D1["Add payment method<br/>Or wait and retry"]
    E --> E1["Input might be too long<br/>Try shorter description"]
    F --> F1["Increase LLM_TIMEOUT<br/>or try again"]
```

---

## Monitoring Your Application

### Where to Check Status:

```
+------------------------------------------------------------------+
|  Monitoring Dashboard Links                                       |
+------------------------------------------------------------------+
|                                                                  |
|  Frontend (Vercel):                                              |
|  https://vercel.com/your-username/lfa-builder                    |
|  - Deployments history                                           |
|  - Analytics (visits, performance)                               |
|  - Function logs                                                 |
|                                                                  |
|  Backend (Render):                                               |
|  https://dashboard.render.com                                    |
|  - Service health                                                |
|  - CPU/Memory usage                                              |
|  - Request logs                                                  |
|                                                                  |
|  Database (Neon):                                                |
|  https://console.neon.tech                                       |
|  - Connection count                                              |
|  - Storage usage                                                 |
|  - Query performance                                             |
|                                                                  |
|  AI Usage (OpenAI):                                              |
|  https://platform.openai.com/usage                               |
|  - API calls count                                               |
|  - Token usage                                                   |
|  - Costs                                                         |
|                                                                  |
+------------------------------------------------------------------+
```

### Set Up Free Monitoring:

```
1. Go to: https://uptimerobot.com
2. Sign up for free account
3. Click "Add New Monitor"
4. Configure:
   - Monitor Type: HTTP(s)
   - Friendly Name: LFA Builder API
   - URL: https://lfa-builder-api.onrender.com/api/health
   - Monitoring Interval: 5 minutes
5. Add your email for alerts
6. Click "Create Monitor"

Now you'll get emailed if your backend goes down!
```

---

## Updating Your Application

### Automatic Updates (Recommended):

Both Vercel and Render auto-deploy when you push to GitHub!

```mermaid
flowchart LR
    A["Make changes locally"] --> B["git add ."]
    B --> C["git commit -m 'message'"]
    C --> D["git push origin main"]
    D --> E["GitHub receives code"]
    E --> F["Vercel auto-deploys frontend"]
    E --> G["Render auto-deploys backend"]
    F --> H["New frontend live!"]
    G --> I["New backend live!"]
```

### How to Update:

```bash
# Make your changes to the code

# Stage changes
git add .

# Commit with a message
git commit -m "Added new feature: export to PDF"

# Push to GitHub
git push origin main

# That's it! Both Vercel and Render will automatically
# detect the changes and redeploy.
```

### Check Deployment Status:

```
Vercel: https://vercel.com/your-username/lfa-builder/deployments
Render: https://dashboard.render.com (click your service, then "Events")
```

---

## Cost Breakdown

### Free Tier Limits:

```mermaid
pie title Monthly Free Tier Usage
    "Vercel: 100GB bandwidth" : 40
    "Render: 750 hours compute" : 30
    "Neon: 512MB storage" : 20
    "OpenAI: Pay-per-use" : 10
```

### Detailed Breakdown:

| Service | Free Tier | What It Means | When You'd Exceed |
|---------|-----------|---------------|-------------------|
| **Vercel** | 100GB bandwidth/month | ~50,000+ page views | Very high traffic site |
| **Render** | 750 hours/month | Server runs 31 days | Won't exceed (only 744 hours in a month) |
| **Neon** | 512MB storage | ~10,000+ LFA documents | Very heavy usage |
| **OpenAI** | Pay per use | ~$0.01-0.10 per LFA | Always pay, but cheap |

### Estimated Monthly Costs:

```
Scenario 1: Personal/Testing Use (10 LFAs/month)
-------------------------------------------------
Vercel:    $0 (well under limit)
Render:    $0 (well under limit)
Neon:      $0 (well under limit)
OpenAI:    ~$1.00
-------------------------------------------------
TOTAL:     ~$1/month

Scenario 2: Small Organization (100 LFAs/month)
-------------------------------------------------
Vercel:    $0 (still under limit)
Render:    $0 (still under limit)
Neon:      $0 (still under limit)
OpenAI:    ~$10.00
-------------------------------------------------
TOTAL:     ~$10/month

Scenario 3: Large Scale (1000+ LFAs/month)
-------------------------------------------------
Vercel:    $0-20 (may need Pro plan)
Render:    $7 (Starter plan for no cold starts)
Neon:      $0-25 (may need more storage)
OpenAI:    ~$100.00
-------------------------------------------------
TOTAL:     ~$130-150/month
```

---

## Security Best Practices

### Never Do This:

```
[X] Don't commit .env files to GitHub
[X] Don't share your API keys
[X] Don't use the same password everywhere
[X] Don't skip SSL/HTTPS
```

### Always Do This:

```
[Y] Use environment variables for secrets
[Y] Regenerate leaked API keys immediately
[Y] Set usage limits on OpenAI
[Y] Use strong passwords for all accounts
[Y] Enable 2FA on GitHub, Vercel, Render
```

### Check Your .gitignore:

Make sure your `.gitignore` file includes:

```
# Environment files
.env
.env.local
.env.production
*.env

# Don't commit these
node_modules/
__pycache__/
*.pyc
.next/
venv/
```

### If You Accidentally Committed a Secret:

```mermaid
flowchart TB
    A["Oops! Committed API key"] --> B["DON'T PANIC"]
    B --> C["Immediately regenerate the key"]
    C --> D["Update key in Render/Vercel"]
    D --> E["Remove from git history (optional)"]
    E --> F["Consider using git-secrets for future"]
```

**Quick Steps:**
```
1. Go to OpenAI/Neon and regenerate the compromised key
2. Update the new key in Render environment variables
3. The old key is now invalid and useless to attackers
4. Add .env to .gitignore to prevent future issues
```

---

## Glossary of Terms

| Term | Simple Explanation |
|------|-------------------|
| **API** | A way for different software to talk to each other |
| **API Key** | A password that lets your app use a service like OpenAI |
| **Backend** | The part of your app that runs on a server (not visible to users) |
| **CDN** | Content Delivery Network - servers around the world that make your site fast |
| **Cold Start** | When a sleeping server wakes up (takes extra time) |
| **CORS** | Security that controls which websites can talk to your API |
| **Deploy** | Putting your code on a server so people can use it |
| **Environment Variable** | A secret setting stored safely on the server |
| **Frontend** | The part of your app users see and interact with |
| **Git** | Version control system - tracks changes to your code |
| **GitHub** | Website that stores your code and collaborates with others |
| **HTTPS** | Secure connection (the lock icon in browser) |
| **PostgreSQL** | A type of database that stores data in tables |
| **Repository** | A folder on GitHub that contains your project |

---

## Quick Reference Card

### Your Important URLs:

```
+------------------------------------------------------------------+
|  SAVE THESE URLS                                                 |
+------------------------------------------------------------------+
|                                                                  |
|  Your Live Website:                                              |
|  https://lfa-builder.vercel.app                                  |
|                                                                  |
|  Your API Backend:                                               |
|  https://lfa-builder-api.onrender.com                            |
|                                                                  |
|  API Documentation:                                              |
|  https://lfa-builder-api.onrender.com/docs                       |
|                                                                  |
|  Vercel Dashboard:                                               |
|  https://vercel.com/your-username/lfa-builder                    |
|                                                                  |
|  Render Dashboard:                                               |
|  https://dashboard.render.com                                    |
|                                                                  |
|  Neon Dashboard:                                                 |
|  https://console.neon.tech                                       |
|                                                                  |
|  OpenAI Dashboard:                                               |
|  https://platform.openai.com                                     |
|                                                                  |
+------------------------------------------------------------------+
```

### Environment Variables Summary:

```
BACKEND (Render):
-----------------
OPENAI_API_KEY=sk-proj-xxx
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
ENV=production
HOST=0.0.0.0
PORT=10000
FRONTEND_URL=https://lfa-builder.vercel.app
OPENAI_MODEL=gpt-4o
LLM_TEMPERATURE=0.4
LLM_TIMEOUT=90
SESSION_TTL_HOURS=24

FRONTEND (Vercel):
------------------
NEXT_PUBLIC_API_URL=https://lfa-builder-api.onrender.com
```

---

## Need Help?

### If Something's Not Working:

```
1. Check the logs first:
   - Render: Dashboard > Your Service > Logs
   - Vercel: Dashboard > Your Project > Deployments > Click latest > Logs

2. Search the error message on Google

3. Check the GitHub Issues:
   - https://github.com/your-username/lfa-builder/issues

4. Common fixes:
   - Clear browser cache and try again
   - Check environment variables are set correctly
   - Redeploy by pushing an empty commit:
     git commit --allow-empty -m "Trigger redeploy"
     git push origin main
```

### Deployment Checklist:

```
[ ] Created OpenAI account and got API key
[ ] Created Neon account and database
[ ] Created Render account
[ ] Created Vercel account
[ ] Code is on GitHub
[ ] Backend deployed to Render with all environment variables
[ ] Frontend deployed to Vercel with API URL
[ ] FRONTEND_URL set in Render backend
[ ] Tested /api/health endpoint
[ ] Tested full LFA creation flow
[ ] Set up UptimeRobot monitoring (optional)
```

---

## Congratulations!

If you've made it this far, your LFA Builder should be live and working!

```
Your app is now:
   [x] Accessible from anywhere in the world
   [x] Running on secure HTTPS
   [x] Automatically updated when you push code
   [x] Monitored for uptime (if you set up UptimeRobot)
   [x] Completely FREE (except OpenAI usage)
```

---

*Last Updated: January 2025*
*Guide Version: 2.0*
*For: AlgoPath LFA Builder*
