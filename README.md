# SOLVIX — AI-Powered Multi-Agent Productivity & Career Platform

<p align="center">
  <strong>A Unified Workspace for AI, Productivity, Learning, and Career Development</strong>
</p>

Solvix is a full-stack, AI-powered multi-agent platform designed to bring intelligent tools, career development utilities, and productivity workflows into one unified workspace.

Built using a modern **MERN + Microservices architecture**, Solvix combines specialized AI agents, conversational AI, Retrieval-Augmented Generation (RAG), document processing, AI-powered career tools, personalized learning roadmaps, and custom AI agent creation.

The platform uses **React 19, Node.js, Express 5, MongoDB, Redis, LangChain, LangGraph, Groq, Google Gemini, Tavily, Pinecone, Stripe, Firebase, Cloudinary, and Docker** to deliver an extensible AI ecosystem.

Rather than relying on a single chatbot, Solvix organizes different capabilities into specialized services and AI workflows. Users can interact with AI assistants, generate documents, analyze resumes, build portfolios, practice interviews, discover job opportunities, and create personalized learning paths from one application.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Highlights](#key-highlights)
- [Core Features](#core-features)
  - [AI Chat and Multi-Agent System](#1-ai-chat-and-multi-agent-system)
  - [Document and File Processing](#2-document-and-file-processing)
  - [AI Resume and ATS Tools](#3-ai-resume-and-ats-tools)
  - [AI Portfolio Builder](#4-ai-portfolio-builder)
  - [AI Mock Interview](#5-ai-mock-interview)
  - [Authentication and User Accounts](#6-authentication-and-user-accounts)
  - [Credits, Subscriptions, and Payments](#7-credits-subscriptions-and-payments)
  - [Admin Dashboard](#8-admin-dashboard)
  - [AI Job Search and Application Workflow](#9-ai-job-search-and-application-workflow)
  - [AI Learning Roadmap Generator](#10-ai-learning-roadmap-generator)
  - [Custom AI Agent Builder](#11-custom-ai-agent-builder)
- [System Architecture](#system-architecture)
- [Request Lifecycle](#request-lifecycle)
- [Technology Stack](#technology-stack)
- [Microservices and Ports](#microservices-and-ports)
- [Project Folder Structure](#project-folder-structure)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Docker Deployment](#docker-deployment)
- [AI and External Integrations](#ai-and-external-integrations)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)
- [Development Guidelines](#development-guidelines)
- [Future Improvements](#future-improvements)
- [Author](#author)

---

## Project Overview

Solvix is designed as an AI-powered productivity and career ecosystem.

Its architecture consists of:

- A React-based frontend application.
- An Express API Gateway.
- Independent backend microservices.
- MongoDB for persistent application data.
- Redis for caching and shared infrastructure.
- LangChain and LangGraph for AI integration and agent orchestration.
- External AI, search, storage, and payment providers.

The API Gateway acts as the central entry point for frontend requests. It applies relevant middleware and forwards requests to the appropriate backend service.

Each microservice is responsible for a specific application domain, making the platform easier to maintain, extend, and develop independently.

## Key Highlights

- **Multi-Agent AI Architecture:** Specialized agents for chat, coding, web search, file analysis, image generation, job search, PDF creation, presentations, and RAG.
- **Custom AI Agent Builder:** Create personalized AI assistants with custom prompts, personalities, model selection, and temperature configuration.
- **AI Career Ecosystem:** Resume analysis, ATS-oriented feedback, CV generation, portfolio workflows, job discovery, and interview practice.
- **AI Learning Roadmaps:** Generate structured learning paths with phases, tasks, resources, and progress tracking.
- **AI Job Search:** Discover job opportunities through web search and generate personalized application emails.
- **Document Processing:** Work with PDFs, DOCX documents, spreadsheets, and images through available file-processing utilities.
- **Microservices Backend:** Separate services for authentication, chat, agents, resumes, portfolios, billing, and mock interviews.
- **Central API Gateway:** Centralized routing, authentication checks, credit middleware, admin authorization, and proxy handling.
- **Persistent Storage:** MongoDB, Mongoose, and Redis integrations.
- **Payment Integration:** Stripe-based billing and credit-oriented usage workflows.
- **Modern Frontend:** React 19, Vite, Tailwind CSS 4, Redux Toolkit, and React Router.
- **Containerization:** Docker and Docker Compose support, with Nginx configuration for the frontend.

---

# Core Features

## 1. AI Chat and Multi-Agent System

Solvix provides a unified AI workspace powered by specialized agents.

The agent service contains modules for:

| Agent | Purpose |
|---|---|
| Chat Agent | General conversational AI |
| Coding Agent | Programming assistance and code-related tasks |
| Search Agent | Web search and information discovery |
| File Agent | File and document analysis |
| Image Agent | Image generation workflows |
| Job Search Agent | Job discovery and related tasks |
| PDF Agent | PDF-related generation workflows |
| PPT Agent | PowerPoint presentation generation |
| RAG Agent | Retrieval-Augmented Generation |
| Router Agent | Routing requests to appropriate agents |

### Agent Orchestration

The agent service includes graph and state modules built around LangGraph-style workflows.

These modules organize agent routing, shared state, and execution flow.

The intended architecture allows requests to be directed to specialized agents instead of handling every task through one general-purpose assistant.

### Benefits

- Multiple specialized AI capabilities in one workspace.
- Organized agent workflows.
- AI-powered task execution.
- Integration with different model providers.
- Extensible agent architecture.

## 2. Document and File Processing

Solvix includes file-upload, storage, parsing, and document-generation utilities.

Document-related capabilities represented in the project include:

- PDF generation using PDFKit.
- PowerPoint generation using PptxGenJS.
- PDF parsing and processing.
- DOCX text extraction using Mammoth.
- Image OCR support using Tesseract.js.
- File upload and generated-file handling.
- Document-related AI workflows.

The agent service contains storage directories for images, PDFs, presentations, uploads, and generated files.

Supported file types, upload limits, and processing behavior depend on the corresponding routes, controllers, and validators.

## 3. AI Resume and ATS Tools

Solvix includes a dedicated Resume microservice for resume-related workflows.

The service contains controllers, models, prompts, routes, and supporting utilities.

### Features

- AI-powered resume analysis.
- ATS-oriented resume evaluation.
- Resume feedback and improvement suggestions.
- AI-assisted CV generation.
- Resume-related PDF workflows.
- Career-focused AI assistance.

The frontend provides dedicated resume pages and components for creating, managing, and reviewing resume-related content.

AI-generated resume content should always be reviewed before being submitted to employers.

## 4. AI Portfolio Builder

The Portfolio microservice handles portfolio-related operations.

Its project structure includes:

- Portfolio controllers.
- Portfolio models.
- Upload middleware.
- AI analysis services.
- Gemini-related integration.
- Parsing utilities.
- PDF-related utilities.
- File and media handling.

The frontend includes portfolio pages, website lists, upload components, and website-code preview functionality.

Portfolio-generation behavior depends on the configured providers and implemented service routes.

## 5. AI Mock Interview

Solvix includes a dedicated Mock Interview microservice.

Its structure contains:

- Interview controllers.
- Interview routes.
- Data models.
- Prompt utilities.
- Supporting services.
- PDF-related functionality.
- Cloudinary integration.

The frontend includes interview pages and components for interview-related workflows, PDF uploads, and code display.

The project also describes coding-oriented interview practice. Exact supported languages and interview flows should be verified against the active prompts and routes.

## 6. Authentication and User Accounts

The Auth microservice manages user-account-related functionality.

Its implementation includes:

- Firebase Admin configuration.
- Authentication controllers.
- Authentication routes.
- Mongoose user model.
- JWT-related support.
- Frontend Firebase configuration.
- User state management.
- Protected routes.

The exact authentication methods, token lifecycle, cookie configuration, and account-management behavior are determined by the current implementation.

## 7. Credits, Subscriptions, and Payments

Solvix contains a dedicated Billing microservice.

### Billing Components

- Stripe configuration.
- Billing controller.
- Payment model.
- Plan configuration.
- Billing routes.
- Frontend pricing components.
- Payment-success UI.

The project uses a credit-oriented usage model and includes Stripe-related checkout and webhook workflows.

Plan prices, credit allocations, and payment rules should be verified in:

- `backend/services/billing/plans/plan.js`
- `frontend/src/components/pricing/plans.js`

These source files should be treated as the authoritative configuration for current plans.

## 8. Admin Dashboard

Solvix includes an admin dashboard for managing and monitoring platform activity.

The frontend contains components for:

- Admin overview.
- User management.
- Transaction management.
- Agent-related management.
- Statistics and analytics.

The API Gateway includes admin controllers, routes, and authorization middleware.

Administrative operations must be protected by server-side authorization checks.

## 9. AI Job Search and Application Workflow

Solvix includes an AI-powered job discovery and application workflow using Tavily Search, Gemini, and Gmail integration.

### Key Features

- **Live Job Search:** Discover job opportunities using Tavily-powered web search.
- **AI Job Matching:** Search for opportunities based on job titles, skills, technologies, and experience.
- **Job Details:** Display available job titles, descriptions, company details, and source links.
- **AI Email Generation:** Generate professional application emails using Gemini.
- **Editable Applications:** Customize recipients, subjects, and email content.
- **CV Upload:** Upload a PDF resume for use with applications.
- **Gmail Integration:** Send applications through a connected Gmail account.
- **Application Tracking:** Track application activity and submitted applications.

### Workflow

1. Enter a job title, skills, or search keywords.
2. Tavily searches for relevant job opportunities.
3. Solvix processes and displays the search results.
4. Select a suitable opportunity.
5. Gemini generates a personalized application email.
6. Review and edit the email.
7. Upload your CV and send the application through Gmail.
8. Track application activity.

### Technologies

- Tavily Search API.
- Google Gemini.
- Gmail API.
- Node.js and Express.
- React.

Job availability, employer requirements, and application links depend on external search results. Users should review all application details before sending.

## 10. AI Learning Roadmap Generator

Solvix provides an AI-powered learning roadmap generator that creates structured learning paths based on a selected topic and experience level.

### Key Features

- Personalized learning roadmaps.
- Beginner, Intermediate, and Advanced levels.
- AI-generated learning phases.
- Weekly learning objectives.
- Practical tasks and exercises.
- Web-based learning resources.
- YouTube video recommendations.
- Documentation links.
- Progress tracking.
- Saved roadmaps.
- Search and filtering.
- Roadmap reset functionality.

### Example Learning Paths

- Advanced Multi-Agent AI.
- Full-Stack MERN.
- System Design.
- LangGraph and RAG.
- DevOps and Cloud.
- Data Science and Machine Learning.
- Blockchain Development.
- React Native Development.

### Roadmap Structure

A generated roadmap can contain:

- 8 structured learning phases.
- Learning objectives.
- Practical tasks.
- Curated resources.
- Estimated completion time.
- Progress tracking.

### Example Roadmap

| Metric | Example |
|---|---:|
| Learning Phases | 8 |
| Resources | 24 |
| Tasks | 24 |
| Completed Tasks | 2 |
| Progress | 8% |
| Estimated Time | 24 Hours |

*This is an illustrative example; actual roadmap content and estimates depend on the generated result.*

### Learning Workflow

1. Enter a skill or technology.
2. Select an experience level.
3. Generate a personalized roadmap.
4. Explore learning phases and objectives.
5. Access recommended resources.
6. Complete tasks and track progress.
7. Save the roadmap and continue learning later.

### Technologies

- Generative AI.
- LangChain.
- LangGraph.
- Tavily Search.
- React.
- Node.js and Express.
- MongoDB.

## 11. Custom AI Agent Builder

The Custom AI Agent Builder allows users to create and manage personalized AI assistants.

Users can configure agent behavior, system prompts, categories, and available model settings.

### Key Features

- Create custom AI agents.
- Define agent names and descriptions.
- Write custom system prompts.
- Configure agent personalities and instructions.
- Select available AI models.
- Adjust temperature settings.
- Use predefined prompt templates.
- Start conversations with custom agents.
- Search and manage created agents.
- Edit and delete agents.
- Organize agents by category.
- Responsive agent-management interface.

### Agent Categories

- General.
- Coding.
- Writing.
- Resume / CV.
- Interview Preparation.
- Research.
- Productivity.
- Custom.

### Example Custom Agents

**EduMaster AI**

An education-focused assistant for learning, studying, assignments, programming, exam preparation, and academic guidance.

**SirajVerse**

A personalized coding and project assistant designed to help review and improve project details, technologies, features, and technical descriptions.

### Agent Creation Workflow

1. Open the Custom AI Agent Builder.
2. Enter an agent name and description.
3. Select an agent category.
4. Write a system prompt or choose a template.
5. Select an available AI model.
6. Configure temperature.
7. Create the agent.
8. Start chatting or manage its configuration.

### Technologies

- React.
- Node.js and Express.
- MongoDB.
- Groq.
- Google Gemini.

Available models and capabilities depend on the configured provider integrations.

---

# System Architecture

Solvix follows a microservices-oriented architecture.

The frontend communicates with the API Gateway, which routes requests to the appropriate backend service.

```text
                  ┌──────────────────────────┐
                  │       SOLVIX USER        │
                  └────────────┬─────────────┘
                               │
                               ▼
                  ┌──────────────────────────┐
                  │    REACT 19 + VITE       │
                  │                          │
                  │ Pages / Components       │
                  │ Redux / React Router     │
                  └────────────┬─────────────┘
                               │ HTTP Requests
                               ▼
                  ┌──────────────────────────┐
                  │     API GATEWAY :5000     │
                  │                          │
                  │ Authentication           │
                  │ Credit Middleware        │
                  │ Admin Authorization      │
                  │ Proxy / Request Routing  │
                  └────────────┬─────────────┘
                               │
             ┌─────────────────┼──────────────────┐
             │                 │                  │
             ▼                 ▼                  ▼
       ┌───────────┐     ┌───────────┐      ┌───────────┐
       │   AUTH    │     │   CHAT    │      │   AGENT   │
       │   :5001   │     │   :5002   │      │   :5003   │
       └─────┬─────┘     └─────┬─────┘      └─────┬─────┘
             │                 │                  │
             └─────────────────┼──────────────────┘
                               │
             ┌─────────────────┼──────────────────┐
             │                 │                  │
             ▼                 ▼                  ▼
       ┌───────────┐     ┌───────────┐      ┌───────────┐
       │  RESUME   │     │ PORTFOLIO │      │  BILLING  │
       │   :5004   │     │   :5005   │      │   :5006   │
       └─────┬─────┘     └─────┬─────┘      └─────┬─────┘
             │                 │                  │
             └─────────────────┼──────────────────┘
                               │
                               ▼
                       ┌──────────────┐
                       │ MOCK INTERVIEW│
                       │    :5007     │
                       └──────┬───────┘
                              │
                              ▼
                ┌─────────────────────────────┐
                │    DATA & AI INFRASTRUCTURE │
                │                             │
                │ MongoDB / Mongoose          │
                │ Redis                       │
                │ Groq / Google Gemini        │
                │ LangChain / LangGraph       │
                │ Pinecone / Tavily           │
                │ Firebase / Cloudinary       │
                │ Stripe                      │
                └─────────────────────────────┘
```

*This is a logical architecture overview. Actual service connections, dependencies, and deployment behavior are defined by the current service configuration and Docker Compose setup.*

## Request Lifecycle

1. A user interacts with the React frontend.
2. The frontend sends an HTTP request to the configured API Gateway URL.
3. The Gateway applies the relevant middleware.
4. The Gateway identifies the destination microservice.
5. The request is forwarded to the appropriate service.
6. The service executes its business logic.
7. The service accesses MongoDB, Redis, or external integrations when required.
8. The service returns a response through the Gateway.
9. The frontend updates its UI and application state.

---

# Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React 19 | User interface and component architecture |
| Vite | Development server and production build |
| Tailwind CSS 4 | Utility-first styling |
| Redux Toolkit | Application state management |
| React Redux | Redux integration |
| React Router DOM | Client-side routing |
| GSAP | UI animations |
| `@gsap/react` | GSAP integration with React |
| Firebase | Frontend Firebase integration |
| React Markdown | Markdown rendering |
| Syntax Highlighter | Code display |
| Recharts | Dashboard charts |
| React Toastify / React Hot Toast | Notifications |

## Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express 5 | Backend APIs and microservices |
| MongoDB | Persistent data storage |
| Mongoose | MongoDB object modeling |
| `express-http-proxy` | API Gateway proxying |
| `jsonwebtoken` | JWT support |
| `cookie-parser` | Cookie parsing |
| CORS | Cross-origin configuration |
| Helmet | Security middleware where configured |
| Morgan | HTTP request logging |
| ioredis | Redis connectivity |
| Multer | File uploads |
| Stripe | Payment integration |
| Cloudinary | Media storage and integration |

## AI, Search, and Agent Orchestration

| Technology | Purpose |
|---|---|
| LangChain | LLM integration and orchestration |
| LangGraph | Agent graph and workflow orchestration |
| Groq | Access to supported AI models |
| Google Gemini | Generative AI integration |
| Tavily | Web search and information discovery |
| Pinecone | Vector database integration for RAG |
| Firebase | Authentication-related integration |

## Document Processing

| Technology | Purpose |
|---|---|
| PDFKit | PDF generation |
| PptxGenJS | PowerPoint generation |
| Mammoth | DOCX text extraction |
| Tesseract.js | OCR support |
| `pdf-parse` | PDF parsing |
| `pdfjs-dist` | PDF processing |

## DevOps and Infrastructure

| Technology | Purpose |
|---|---|
| Docker | Application containerization |
| Docker Compose | Multi-container orchestration |
| Nginx | Frontend serving and reverse-proxy configuration |
| Redis | Caching and shared infrastructure |
| AWS | Cloud infrastructure and deployment |

*Package availability does not guarantee that every package is used by every feature. The individual package manifests and source code are the definitive references.*

---

# Microservices and Ports

The project is organized into the following backend services.

| Service | Port | Responsibility |
|---|---:|---|
| API Gateway | 5000 | Central request routing |
| Auth | 5001 | User authentication |
| Chat | 5002 | Conversations and chat data |
| Agent | 5003 | AI agents and workflows |
| Resume | 5004 | Resume and CV operations |
| Portfolio | 5005 | Portfolio generation and management |
| Billing | 5006 | Payments, plans, and credits |
| Mock Interview | 5007 | Interview workflows |
| Redis | 6379 | Cache and shared infrastructure |

Confirm actual ports in the service entry points and environment configuration before running the application.

---

# Project Folder Structure

The following is a simplified overview of the repository. It highlights the important source-code areas rather than generated dependencies and build output.

```text
Solvix/
│
├── backend/
│   │
│   ├── gateway/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── index.js
│   │   └── package.json
│   │
│   ├── services/
│   │   │
│   │   ├── agent/
│   │   │   ├── AllAgents/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── graph/
│   │   │   ├── routes/
│   │   │   ├── storage/
│   │   │   ├── uploads/
│   │   │   └── index.js
│   │   │
│   │   ├── auth/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   └── index.js
│   │   │
│   │   ├── chat/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   └── index.js
│   │   │
│   │   ├── Resume/
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── middleware/
│   │   │   ├── models/
│   │   │   ├── prompt/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── index.js
│   │   │
│   │   ├── portfolio/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── middlewares/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── index.js
│   │   │
│   │   ├── billing/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── plans/
│   │   │   ├── routes/
│   │   │   └── index.js
│   │   │
│   │   └── mock-Interview/
│   │       ├── config/
│   │       ├── controllers/
│   │       ├── middleware/
│   │       ├── models/
│   │       ├── routes/
│   │       ├── services/
│   │       └── index.js
│   │
│   ├── shared/
│   │   ├── middlewares/
│   │   ├── redis/
│   │   ├── authRateLimit.js
│   │   └── rateLimit.js
│   │
│   └── package.json
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── CvSections/
│   │   ├── Features/
│   │   ├── pages/
│   │   ├── protectedroute/
│   │   ├── redux/
│   │   ├── utlis/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
├── docker-compose.yml
├── README.md
└── Solvix-Full-Structure.txt
```

### Backend Folder Responsibilities

| Folder | Responsibility |
|---|---|
| `gateway/` | Central API entry point, proxying, middleware, and routing |
| `services/agent/` | Specialized agents, graph workflows, file processing, and AI integration |
| `services/auth/` | Authentication and user-account operations |
| `services/chat/` | Chat and conversation management |
| `services/Resume/` | Resume analysis and CV operations |
| `services/portfolio/` | Portfolio-related operations |
| `services/billing/` | Plans, payment, and credit management |
| `services/mock-Interview/` | Interview-related operations |
| `shared/` | Reusable middleware, Redis, and rate-limiting utilities |

### Frontend Folder Responsibilities

| Folder | Responsibility |
|---|---|
| `components/` | Reusable interface components |
| `CvSections/` | CV-related UI sections |
| `Features/` | Feature-specific UI modules |
| `pages/` | Application pages |
| `protectedroute/` | Protected route handling |
| `redux/` | Global application state |
| `utlis/` | Shared frontend utilities |
| `App.jsx` | Main application component |
| `main.jsx` | React entry point |

**Note:** Existing directory names such as `utlis`, `Resume`, and `mock-Interview` are retained as they appear in the project. Use their exact names when navigating the repository, especially on case-sensitive systems.

---

# Prerequisites

Before running Solvix locally, install:

- Node.js and npm compatible with the installed dependencies.
- Git.
- MongoDB (local or hosted).
- Redis.
- Docker Desktop, if using Docker Compose.
- Required provider credentials for the features you intend to run.

Depending on the features being tested, provider configuration may include:

- Firebase.
- Groq.
- Google Gemini.
- Tavily.
- Pinecone.
- Cloudinary.
- Stripe.
- Gmail integration.

---

# Installation and Setup

## 1. Clone the Repository

```bash
git clone https://github.com/SirajAbid17/Solvix.git
cd Solvix
```

## 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

## 3. Install Backend Dependencies

Each backend package has its own `package.json`.

From the repository root, run this PowerShell script to install dependencies in the individual packages:

```powershell
$folders = @(
    "backend\gateway",
    "backend\services\auth",
    "backend\services\chat",
    "backend\services\agent",
    "backend\services\Resume",
    "backend\services\portfolio",
    "backend\services\billing",
    "backend\services\mock-Interview"
)

foreach ($folder in $folders) {
    Write-Host "Installing dependencies in $folder"

    Push-Location $folder
    npm install
    Pop-Location
}
```

If installation fails, run `npm install` inside the affected service directory to inspect the complete error.

## 4. Configure Environment Variables

Create the environment files required by the individual services.

Use the actual variable names referenced in the source code. Do not assume that every service loads a single root-level `.env` file.

See [Environment Configuration](#environment-configuration).

## 5. Start MongoDB and Redis

Start MongoDB and Redis using your local installation or hosted services.

If using Docker Compose, review the root `docker-compose.yml` before starting containers.

## 6. Start the Backend

Start each backend service and the API Gateway in separate terminals.

See [Running the Application](#running-the-application).

## 7. Start the Frontend

```bash
cd frontend
npm run dev
```

Vite will display the local development URL in the terminal.

---

# Environment Configuration

Solvix uses service-specific configuration. The exact environment-variable names must be taken from the source code.

The following table describes configuration categories to inspect. These are not guaranteed literal environment-variable names.

| Service | Configuration to Check |
|---|---|
| Gateway | Port, CORS origins, service URLs, Redis, proxy and cookie settings |
| Auth | MongoDB URI, Firebase Admin credentials, JWT secret, cookie settings |
| Chat | MongoDB URI, Redis, model configuration if used |
| Agent | MongoDB URI, Groq, Gemini, Tavily, Pinecone, Cloudinary, Redis |
| Resume | MongoDB URI, AI provider credentials, storage and Redis |
| Portfolio | MongoDB URI, Gemini, Cloudinary and Redis |
| Billing | MongoDB URI, Stripe secret, webhook secret, plan configuration |
| Mock Interview | MongoDB URI, AI provider credentials, Cloudinary and Redis |
| Frontend | Vite API URL, Firebase web configuration and other `VITE_*` values |

## Find Exact Environment Variables

Run this PowerShell command from the repository root to search source files for environment references:

```powershell
Get-ChildItem backend,frontend -Recurse -File |
Where-Object {
    $_.FullName -notmatch '\\(node_modules|\.git|dist|build)\\' -and
    $_.Name -notlike ".env*"
} |
Select-String -Pattern 'process\.env\.|import\.meta\.env\.'
```

Review the results and create the environment files at the locations expected by each service.

## Firebase Service Account

The Auth service includes Firebase Admin configuration.

Treat Firebase service-account JSON files as private credentials. Do not publish them or commit them to Git.

If a real credential has been exposed, revoke or rotate it in the Firebase/Google Cloud console and update the deployment configuration.

---

# Running the Application

## Start Backend Services

Run each command in a separate terminal from the repository root.

### Terminal 1 — API Gateway

```bash
cd backend/gateway
npm run dev
```

### Terminal 2 — Auth Service

```bash
cd backend/services/auth
npm run dev
```

### Terminal 3 — Chat Service

```bash
cd backend/services/chat
npm run dev
```

### Terminal 4 — Agent Service

```bash
cd backend/services/agent
npm run dev
```

### Terminal 5 — Resume Service

```bash
cd backend/services/Resume
npm run dev
```

### Terminal 6 — Portfolio Service

```bash
cd backend/services/portfolio
npm run dev
```

### Terminal 7 — Billing Service

```bash
cd backend/services/billing
npm run dev
```

### Terminal 8 — Mock Interview Service

```bash
cd backend/services/mock-Interview
npm run dev
```

Start MongoDB, Redis, and any required external dependencies before starting services that rely on them.

Ensure that the Gateway's target URLs match the actual service ports and addresses.

## Start Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

Open the local URL displayed by Vite.

Make sure the frontend API base URL points to the Gateway.

## Build Frontend for Production

```bash
cd frontend
npm run build
```

## Preview Production Build

```bash
npm run preview
```

The preview command is useful for checking the production build locally. It is not a complete production deployment by itself.

---

# Docker Deployment

Solvix includes Docker-related configuration for containerized development and deployment.

The root `docker-compose.yml` is the Compose entry point shown in the project structure.

Before starting containers, validate the configuration:

```bash
docker compose config
```

Build and start the configured services:

```bash
docker compose up --build
```

Run containers in detached mode:

```bash
docker compose up --build -d
```

Check running containers:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f
```

View logs for an individual service:

```bash
docker compose logs -f agent
```

Stop the Compose application:

```bash
docker compose down
```

Rebuild and restart containers after code changes:

```bash
docker compose up --build -d
```

The actual service names and available Compose commands depend on the definitions in `docker-compose.yml`.

### Docker Networking Note

Inside a Docker container, `localhost` refers to that same container.

If MongoDB or Redis runs in another container on the same Compose network, use its Compose service name as the hostname instead of `localhost`.

---

# AI and External Integrations

## Language Models

Solvix integrates with Groq and Google Gemini for supported AI workflows.

The agent and related services use AI integrations for tasks such as conversational assistance, document workflows, career tools, and custom agents.

Available models depend on the provider account, API key permissions, model identifiers, quotas, and configuration.

## LangChain and LangGraph

LangChain supports LLM-related integration and orchestration.

LangGraph supports graph-based agent workflows, routing, and state management.

The agent service contains graph and state modules for organizing multi-agent execution.

## Tavily Search

Tavily provides web-search capabilities for search-oriented workflows, including job discovery and learning-resource discovery.

External search results should be reviewed before being used for important decisions.

## Pinecone and RAG

The project includes Pinecone integration and RAG-related agent utilities.

A working RAG setup requires:

- Valid provider credentials.
- A correctly configured Pinecone index.
- Compatible embedding dimensions.
- Consistent document-ingestion logic.
- Correct retrieval and query workflows.

Verify the active implementation before configuring production data.

## Cloudinary

Cloudinary integrations are present in multiple services for media-related workflows.

Configure the appropriate credentials for services that use it.

## Stripe

Stripe supports the billing and payment workflows.

Use test mode during development and verify webhook configuration before accepting live payments.

## Gmail

The job application workflow includes Gmail integration for sending application emails through a connected account.

Verify the required Gmail authorization, API configuration, and permissions before using this functionality.

---

# Security Considerations

Security is essential when deploying an application that handles user accounts, documents, AI providers, and payments.

- **Protect Secrets:** Never commit `.env` files, Firebase service-account keys, JWT secrets, Stripe keys, or AI-provider credentials.
- **Rotate Exposed Credentials:** Removing a secret from the latest commit does not remove it from Git history or invalidate it.
- **Use HTTPS:** Configure HTTPS and secure cookies for production.
- **Restrict CORS:** Allow only trusted frontend origins.
- **Protect Admin APIs:** Enforce administrator authorization on the backend.
- **Validate Uploads:** Enforce file type, file size, access control, and storage policies.
- **Apply Rate Limits:** Protect public and authentication endpoints.
- **Secure Gateway Proxying:** Use trusted internal service URLs and avoid unnecessarily exposing internal services.
- **Verify Stripe Webhooks:** Validate webhook signatures and handle repeated events safely.
- **Protect User Documents:** Avoid logging private file content or sensitive information.
- **Sanitize Errors:** Avoid exposing credentials, stack traces, or internal configuration in production responses.

---

# Troubleshooting

## Frontend Cannot Connect to Backend

- Confirm the required backend services are running.
- Verify the frontend API base URL.
- Ensure it points to the API Gateway.
- Check CORS configuration.
- Review browser Network errors.
- Check Gateway logs and service target URLs.

## MongoDB Connection Error

- Confirm MongoDB is running.
- Verify the MongoDB URI loaded by the service.
- Check database credentials and network access.
- For Docker, use the correct Compose service hostname instead of container-local `localhost` when appropriate.

## Redis Connection Error

- Confirm Redis is running.
- Check the configured Redis hostname and port.
- For Docker, use the Redis Compose service name when containers share a network.
- Verify whether Redis is mandatory or optional for the affected service.

## AI Provider Errors

- Verify the API key.
- Check that the configured model ID is available to your account.
- Review provider quotas and rate limits.
- Check network connectivity.
- Review application logs without exposing API keys.

## File Upload or Document Processing Error

- Verify accepted file types and size limits.
- Confirm the storage directory is writable.
- Check Cloudinary credentials if cloud storage is used.
- Verify PDF, DOCX, and OCR dependency compatibility.
- Review the relevant upload middleware and controller.

## Stripe Checkout or Webhook Error

- Use Stripe test mode while developing.
- Verify the webhook endpoint.
- Check the webhook signing secret.
- Confirm the configured plan and price identifiers.
- Review Stripe events and Billing service logs.
- Never rely only on frontend state to confirm payment success.

## npm Install Error

- Run `npm install` inside the affected package.
- Check Node.js and npm compatibility.
- Review the first meaningful error.
- Avoid deleting lockfiles or clearing caches without understanding the error.
- Preserve package lockfiles unless you intentionally plan to regenerate them.

## Port Already in Use

Check which process is using the required port.

On Windows PowerShell:

```powershell
netstat -ano | findstr :5000
```

Stop the conflicting process if appropriate, or change the service port and update the Gateway target URL.

---

# Development Guidelines

## Frontend Checks

Run the frontend linter:

```bash
cd frontend
npm run lint
```

Build the frontend:

```bash
npm run build
```

## Backend Checks

Run service-specific scripts from their package directories.

The available scripts are defined by each service's `package.json`.

Add automated tests for:

- Authentication routes.
- Gateway middleware.
- Credit handling.
- Agent workflows.
- Resume and portfolio APIs.
- Billing and Stripe webhooks.
- File-upload validation.

---

# Future Improvements

Potential areas for future development include:

- Advanced autonomous agent planning.
- Additional AI model integrations.
- More sophisticated multi-agent collaboration.
- Real-time collaborative AI workflows.
- Advanced voice-agent capabilities.
- Improved AI job matching.
- Enhanced automated job application workflows.
- Agent analytics and monitoring.
- Distributed task queues.
- Advanced observability and logging.
- More extensive automated testing.
- Production monitoring and performance optimization.

---

# Contributing

Contributions and improvements are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Keep changes scoped to the relevant frontend or backend service.
4. Do not commit environment files, credentials, generated private documents, or user uploads.
5. Run frontend lint/build checks.
6. Test the affected backend service.
7. Open a pull request with a clear summary and testing notes.

---

# Author

**Siraj Abid**

Full-Stack Developer | Generative AI Engineer

- **GitHub:** [@SirajAbid17](https://github.com/SirajAbid17)
- **Project Repository:** [SirajAbid17/Solvix](https://github.com/SirajAbid17/Solvix)

---

<p align="center">
  <strong>SOLVIX — One Workspace. Multiple AI Agents. Endless Possibilities.</strong>
</p>

<p align="center">
  Built with passion for Full-Stack Development, Generative AI, and Agentic Systems.
</p>
