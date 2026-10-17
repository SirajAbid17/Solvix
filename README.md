# 🚀 Solvix — Multi-Agent AI Platform

Solvix is a production-grade Multi-Agent AI Platform designed to bring multiple AI-powered capabilities into a unified intelligent ecosystem. Built with a scalable MERN + Microservices architecture, Solvix leverages LangChain, LangGraph, RAG, Docker, Redis, Nginx, and AWS to orchestrate intelligent agent workflows and deliver powerful AI automation. As a full-stack AI platform, it brings conversational AI, specialized AI agents, document tools, retrieval-augmented generation (RAG), and career-development utilities into one application, using a React frontend, a Node.js/Express microservices backend, MongoDB, Redis, and integrations with AI and cloud services.

The project is organized as a monorepo with a frontend application and
independently runnable backend services. The API Gateway provides a
single entry point for the frontend and forwards requests to the
relevant backend service.

> **Project status:** This README documents the structure and
> capabilities represented by the project audit and project description.
> Provider credentials, environment-variable names, deployment behavior,
> and individual feature availability depend on the current source code
> and service configuration. Review each service's configuration before
> deploying.


## Highlights

- **Multi-agent AI:** Separate agents handle chat, coding, web search,
  file analysis, image generation, job search, PDF creation,
  presentation generation, and RAG-related tasks.
- **Career toolkit:** Resume analysis, ATS-oriented feedback, CV
  generation, portfolio-related workflows, job recommendations, and
  mock-interview practice.
- **Microservices architecture:** Authentication, chat, agent
  workflows, resume tools, portfolio tools, mock interviews, and
  billing are separated into backend services.
- **Central API Gateway:** Routes requests to services and contains
  middleware for authentication, credit checks, admin access, and
  proxy handling.
- **Persistent application data:** MongoDB/Mongoose are used by
  several services; Redis is included for caching, session/memory, and
  related shared functionality where configured.
- **AI provider integrations:** LangChain/LangGraph integrations,
  Groq, Google Gemini, Tavily, Pinecone, and Cloudinary appear in the
  project dependencies/configuration.
- **Modern frontend:** React 19, Vite, Tailwind CSS, Redux Toolkit,
  and React Router.
- **Payments:** A Stripe-based billing service and payment-related
  models/routes are present in the repository.

## Features

### 1. AI Chat and Agent Workflows

SOLVIX includes a chat interface and a collection of specialized agents.
The agent directory includes modules for:

- Conversational chat
- Coding assistance
- Web search
- File analysis
- Image generation
- Job search
- PDF generation
- PowerPoint generation
- Retrieval-augmented generation (RAG)
- Agent routing

The agent service also includes graph/state modules, allowing agent
workflows to be organized around routing and shared state. Exact model
selection and workflow behavior are controlled by the service
implementation and environment configuration.

### 2. File and Document Utilities

The agent service includes file routes, upload utilities, parsers, and
storage directories. The listed dependencies support working with common
document and data formats, including PDF, DOCX, spreadsheets, and
images.

Document-related utilities include:

- PDF creation with PDFKit
- PowerPoint generation with PptxGenJS
- PDF parsing
- DOCX text extraction through Mammoth
- Image text extraction/OCR support through Tesseract.js
- File upload and generated-file handling

Supported file types, size limits, and output behavior should be checked
in the relevant controllers and validators before relying on them in
production.

### 3. Career and Resume Tools

The Resume service contains controllers, routes, models, prompts, and
services for resume analysis and CV generation. The frontend includes
dedicated pages and components for resume analysis, CV creation, and
resume-related results.

Career workflows described for the project include:

- Resume analysis and feedback
- ATS-oriented scoring or analysis
- CV/resume generation
- Job recommendations
- Resume-related PDF workflows

AI-generated analysis is advisory. Users should review generated resumes
and recommendations for correctness before submitting them to employers.

### 4. AI Portfolio Tools

The Portfolio service contains upload middleware, portfolio models,
analysis services, Gemini-related services, parsing, PDF utilities, and
upload handling. The frontend includes portfolio pages, website lists,
upload components, and a website-code preview modal.

Portfolio-generation and analysis capabilities depend on the configured
provider credentials and the implemented routes.

### 5. Mock Interview Practice

The `backend/services/mock-Interview` service contains mock-interview
controllers, routes, models, prompt utilities, PDF services, and
Cloudinary integration. The frontend includes interview pages and
components for uploading interview-related PDFs and displaying code
blocks.

The project description includes interview practice with
JavaScript/Python-style coding solutions. Check the active prompts and
routes for the exact supported languages and interview flow.

### 6. Authentication and User Accounts

The Auth service contains Firebase Admin configuration, authentication
controllers/routes, a Mongoose user model, and JWT support in its
dependencies. The frontend includes Firebase configuration, user state,
protected routes, and login-required UI.

The precise sign-in methods, token lifecycle, cookie settings, and
account lifecycle are determined by the implementation. Keep Firebase
credentials and signing secrets out of source control.

### 7. Credits, Plans, and Payments

A dedicated Billing service includes Stripe configuration, a billing
controller, payment model, plan configuration, and billing routes. The
frontend contains pricing components and payment-success UI.

The project description lists a credit-based model and Stripe
Checkout/webhook workflows. Before publishing prices or promising credit
amounts, verify the current values in
`backend/services/billing/plans/plan.js` and the corresponding frontend
pricing configuration.

### 8. Admin Dashboard

The frontend includes an admin dashboard with user, transaction, agent,
overview, and statistics components. The gateway has admin controllers,
routes, and middleware.

Admin endpoints and UI should be accessible only to authorized
administrators. Verify role checks and permissions before deployment.

## Architecture

```text
┌──────────────────────────────┐
│       React + Vite UI        │
│  Pages, components, Redux    │
└──────────────┬───────────────┘
               │ HTTP requests
               ▼
┌──────────────────────────────┐
│       API Gateway :5000      │
│ Auth / credit / admin checks │
│       Proxy to services      │
└──────┬────────┬────────┬─────┘
       │        │        │
       ▼        ▼        ▼
   Auth :5001 Chat :5002 Agent :5003
       │        │        │
       ▼        ▼        ▼
   MongoDB    MongoDB  AI / search /
                      file integrations

Additional services:
  Resume :5004
  Portfolio :5005
  Billing :5006
  Mock Interview :5007

Shared infrastructure may include MongoDB, Redis, AI providers,
Cloudinary, Pinecone, Tavily, Firebase, and Stripe.
```

This is a logical overview, not a deployment diagram. Actual connections
and availability depend on each service's configuration and the Docker
Compose file.

## Technology Stack

### Frontend

---

Technology Purpose

---

React 19 UI components and application
screens

Vite Development server and production
build

Tailwind CSS 4 Utility-first styling

Redux Toolkit / React Redux Shared application state

React Router DOM Client-side routing

GSAP / `@gsap/react` UI animation

Firebase Frontend Firebase integration

React Markdown / syntax highlighter Rendering formatted AI responses
and code

Recharts Charts and dashboard visualizations

React Toastify / React Hot Toast Notifications

---

### Backend

Technology Purpose

---

Node.js JavaScript runtime
Express 5 HTTP APIs and service endpoints
Mongoose MongoDB object modeling
`express-http-proxy` Gateway-to-service proxying
`jsonwebtoken` JWT support in the authentication service
`cookie-parser` Cookie parsing
`cors` Cross-origin request configuration
Helmet Security middleware where configured
Morgan HTTP request logging
ioredis Redis connectivity
Multer File uploads
Stripe Payment integration
Cloudinary Media storage/integration

### AI, Search, and Documents

---

Technology Purpose

---

LangChain LLM integration and orchestration

LangGraph Agent graph/workflow orchestration

Groq integrations Access to supported Groq models

Google Gemini integrations Generative AI and
file/image-related workflows

Tavily Web search integration

Pinecone Vector database integration for RAG

PDFKit PDF generation

PptxGenJS PowerPoint generation

Mammoth DOCX text extraction

Tesseract.js OCR support

`pdf-parse` / `pdfjs-dist` PDF parsing and processing

---

Not every package is necessarily used by every feature. The installed
package manifests and service source files are the definitive
references.

## Repository Structure

The following is a simplified map of the audited repository. It
highlights the main application areas rather than listing every UI
component.

```text
Solvix/
├── backend/
│   ├── gateway/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── index.js
│   │   └── package.json
│   ├── services/
│   │   ├── agent/
│   │   │   ├── AllAgents/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── graph/
│   │   │   ├── routes/
│   │   │   ├── storage/
│   │   │   ├── utlis/
│   │   │   └── index.js
│   │   ├── auth/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   └── index.js
│   │   ├── billing/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── plans/
│   │   │   ├── routes/
│   │   │   └── index.js
│   │   ├── chat/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   └── index.js
│   │   ├── mock-Interview/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── index.js
│   │   ├── portfolio/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── middlewares/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── index.js
│   │   └── Resume/
│   │       ├── config/
│   │       ├── controller/
│   │       ├── middleware/
│   │       ├── models/
│   │       ├── prompt/
│   │       ├── routes/
│   │       ├── services/
│   │       └── index.js
│   ├── shared/
│   │   ├── middlewares/
│   │   ├── redis/
│   │   ├── authRateLimit.js
│   │   └── rateLimit.js
│   ├── docker-compose.yml
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── CvSections/
│   │   ├── Features/
│   │   ├── pages/
│   │   ├── protectedroute/
│   │   ├── redux/
│   │   ├── utlis/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

**Note:** Existing directory names such as `utlis`, `Resume`, and
`mock-Interview` are retained as they appear in the audited project. Use
the exact names when navigating the repository on case-sensitive
systems.

## How Requests Flow

1.  A user interacts with the React application.
2.  The frontend sends HTTP requests to the configured gateway URL.
3.  The gateway applies the relevant middleware and selects the
    destination service.
4.  The destination service executes its business logic, accesses its
    database or external integrations, and returns a response.
5.  The frontend updates the UI and application state.

For a request to work end-to-end, the frontend API base URL, gateway
port, service ports, CORS settings, credentials, and provider
configuration must agree.

## Requirements

Install the following before running the project locally:

- Node.js and npm (use a current Node.js LTS release compatible with
  the installed packages).
- Git.
- MongoDB, either local or hosted, for services that use MongoDB.
- Redis for features that require the shared Redis connection.
- Provider credentials for the specific features you want to test,
  such as AI models, Firebase, Cloudinary, Pinecone, Tavily, or
  Stripe.
- Docker Desktop, if you plan to use the repository's Docker Compose
  setup.

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/SirajAbid17/Solvix.git
cd Solvix
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend service dependencies

Each backend service has its own `package.json`. Install dependencies in
the gateway and each service directory you intend to run.

**PowerShell (from the repository root):**

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
  Push-Location $folder
  npm install
  Pop-Location
}
```

Run this command from the repository root. If a dependency installation
fails, enter the affected folder and run `npm install` there to see the
complete error output.

### 4. Configure environment variables

Create the required local environment files based on the variables read
by each service. See [Environment
Configuration](#environment-configuration). Do not copy credentials into
this README or commit real `.env` files.

### 5. Start infrastructure

Start MongoDB and Redis using your preferred local or hosted setup. If
using Docker Compose, first review `backend/docker-compose.yml` and its
required environment variables, ports, volumes, and service definitions.
Then run the Compose commands from the `backend` directory:

```bash
docker compose config
docker compose up --build
```

`docker compose config` helps validate the Compose configuration before
startup. These commands only work as intended if the Compose file
defines the services and environment expected by the current project.

## Environment Configuration

The repository contains service-specific configuration files and
`.gitignore` files. The audit does not provide the full source of every
configuration module, so the variable names below are **categories to
check**, not a guaranteed list of exact environment-variable names.

---

Service/area Configuration to inspect

---

Gateway Port, CORS/frontend origin, service
base URLs, Redis connection,
cookie/proxy settings

Auth MongoDB URI, Firebase Admin
credentials, JWT signing secret,
cookie/CORS settings

Chat MongoDB URI, Redis connection,
model/provider configuration if
used

Agent MongoDB URI, Groq/Gemini
credentials, Tavily key, Pinecone
settings, Cloudinary credentials,
Redis connection

Resume MongoDB URI, AI provider
credentials, Tavily settings if
used, Cloudinary settings, Redis
connection

Portfolio MongoDB URI, Gemini credentials,
Cloudinary settings, Redis
connection

Billing MongoDB URI, Stripe secret key,
webhook secret, price/plan
configuration

Mock Interview MongoDB URI, Groq credentials,
Cloudinary settings, Redis
connection

Frontend Vite-exposed API URL, Firebase web
configuration, any other `VITE_*`
variables used by the code

---

### Find the exact variables

Search the project source for environment-variable references. From the
repository root in PowerShell:

```powershell
Get-ChildItem backend,frontend -Recurse -File |
  Where-Object {
    $_.FullName -notmatch '\\(node_modules|\.git|dist|build)\\' -and
    $_.Name -notlike ".env*"
  } |
  Select-String -Pattern 'process\.env\.|import\.meta\.env\.'
```

Use the exact names found in the code. Create local `.env` files in the
locations expected by each service; do not assume a single root `.env`
file is loaded by every service.

### Firebase service account

The audit shows a `serviceAccountKey.json` path under the Auth service.
Treat service-account files as private credentials. Do not publish the
file or commit it to Git. If a real service-account key has already been
pushed to a remote repository, revoke/rotate it in the Firebase/Google
Cloud console and update the local deployment configuration.

## Running the Application

The frontend and each backend package define their own scripts. The
audited package manifests show `dev` and `start` scripts for the gateway
and the individual services, and `dev`, `build`, `lint`, and `preview`
scripts for the frontend.

### Start backend services

Open a separate terminal for each service, from the repository root:

**Terminal 1 --- Gateway**

```bash
cd backend/gateway
npm run dev
```

**Terminal 2 --- Authentication**

```bash
cd backend/services/auth
npm run dev
```

**Terminal 3 --- Chat**

```bash
cd backend/services/chat
npm run dev
```

**Terminal 4 --- Agent**

```bash
cd backend/services/agent
npm run dev
```

**Terminal 5 --- Resume**

```bash
cd backend/services/Resume
npm run dev
```

**Terminal 6 --- Portfolio**

```bash
cd backend/services/portfolio
npm run dev
```

**Terminal 7 --- Billing**

```bash
cd backend/services/billing
npm run dev
```

**Terminal 8 --- Mock Interview**

```bash
cd backend/services/mock-Interview
npm run dev
```

Start MongoDB, Redis, and any required external services before starting
dependent application services. Start the gateway only after the target
services and their URLs are configured. The exact startup order may vary
with the implementation.

### Start the frontend

In another terminal:

```bash
cd frontend
npm run dev
```

Vite prints the local development URL in the terminal. Open that URL in
a browser. Make sure the frontend's configured API base URL points to
the gateway.

### Production frontend build

```bash
cd frontend
npm run build
```

To serve the generated build locally for a quick check:

```bash
npm run preview
```

The preview command is for checking the production build locally; it is
not, by itself, a complete production deployment strategy.

## Service Ports

The project description specifies the following intended local ports.
Confirm each service's actual port configuration in its entry point and
environment files before running the services.

Component Intended port

---

API Gateway `5000`
Auth service `5001`
Chat service `5002`
Agent service `5003`
Resume service `5004`
Portfolio service `5005`
Billing service `5006`
Mock Interview service `5007`
Redis `6379` (common local default; verify configuration)

If a port is already occupied, either stop the conflicting process or
change the relevant service configuration and update the gateway's
target URL.

## AI and Retrieval Integrations

### Language models and orchestration

The agent, resume, portfolio, and mock-interview packages include
LangChain-related packages and/or Google and Groq integrations. The
project description mentions Groq-hosted models and Google Gemini
models. Available models may change and must match the model IDs enabled
for the API key and account.

### Web search

Tavily packages and configuration files are present in the agent
service, and the project description includes search and job-search
workflows. Search results should be treated as external information and
reviewed before making important decisions.

### Retrieval-augmented generation (RAG)

The agent service contains embedding and RAG utility modules, along with
a Pinecone configuration file and Pinecone SDK dependency. A working RAG
setup generally requires a valid provider key, an existing or correctly
configured index, compatible embedding dimensions, and consistent
document-ingestion/query logic. Confirm these settings in the actual
implementation.

### Media and generated documents

Cloudinary integrations appear in the agent, portfolio, resume, and
mock-interview services. PDFKit and PptxGenJS are present in the agent
service for document generation. Configure each integration only for the
features that use it, and avoid storing uploaded user files longer than
necessary.

## Billing and Credits

The repository includes a Billing service, a plan configuration file, a
payment model, and Stripe integration. The frontend includes pricing and
payment-success components.

Before testing payments:

1.  Use Stripe test mode and test credentials.
2.  Verify the current plan names, amounts, currency, and credit
    allocation in `backend/services/billing/plans/plan.js` and
    `frontend/src/components/pricing/plans.js`.
3.  Configure webhook handling with the endpoint and signing secret
    expected by the code.
4.  Verify webhook signature validation and idempotency behavior in the
    billing controller before relying on payment state.
5.  Test successful, cancelled, and failed checkout flows.
6.  Never use client-side UI state alone as proof that a payment
    succeeded.

Pricing and credit amounts are intentionally not hard-coded in this
README because they should match the current source configuration.

## Security Notes

- **Never commit secrets.** Keep `.env` files, Firebase
  service-account keys, JWT secrets, Stripe keys, and AI-provider API
  keys out of Git.
- **Rotate exposed credentials.** Removing a secret from the latest
  commit does not erase it from Git history or invalidate the
  credential.
- **Use HTTPS in production.** Configure secure cookies and trusted
  origins for the production domain.
- **Restrict CORS.** Allow only the frontend origins that should
  access the API.
- **Protect admin endpoints.** Enforce authorization on the server,
  not only by hiding frontend pages.
- **Validate uploads.** Enforce file type, file size, storage policy,
  and access controls.
- **Rate-limit public endpoints.** Review the shared rate-limit and
  authentication-rate-limit middleware.
- **Validate gateway proxy targets.** Use trusted service URLs and
  avoid exposing internal services unnecessarily.
- **Protect payment webhooks.** Verify signatures and handle repeated
  events safely.
- **Avoid logging secrets or private documents.** Sanitize logs and
  error responses.

## Troubleshooting

### Frontend cannot reach the API

- Confirm all required services are running.
- Verify the frontend API base URL points to the gateway, not to a
  service that should remain internal.
- Check CORS settings, browser network errors, and the gateway logs.
- Confirm service ports and gateway proxy targets agree.

### MongoDB connection errors

- Confirm MongoDB is running and reachable from the service process.
- Check the exact MongoDB URI loaded by that service.
- For Docker, remember that `localhost` inside a container refers to
  that container itself. Use the Compose service name when the
  database is another container on the same Compose network.
- Verify database credentials and network access for a hosted
  database.

### Redis connection errors

- Confirm Redis is running and the configured host/port are reachable.
- A containerized service usually needs the Redis Compose service name
  rather than `localhost`.
- Check whether the service treats Redis as mandatory or optional.

### AI requests fail

- Check the API key and model ID for the selected provider.
- Verify provider quotas, billing, network access, and request limits.
- Review service logs for provider errors, but do not print secret
  values.
- If a feature uses multiple providers, verify the configured fallback
  behavior in the source.

### File upload or document processing fails

- Check the file size/type accepted by the route and middleware.
- Confirm local storage directories are writable or cloud storage
  credentials are valid.
- Verify any OCR/PDF parsing dependency is compatible with the
  installed Node.js version.
- Review logs for malformed or unsupported documents.

### Stripe checkout or webhook fails

- Use Stripe test mode while developing.
- Check the configured webhook endpoint and signing secret.
- Verify the plan/price identifiers used by the code.
- Inspect Stripe dashboard events and the billing service logs without
  exposing private keys.

### `npm install` fails

- Run the command inside the specific package directory.
- Confirm Node.js/npm compatibility with the dependency versions.
- Read the first meaningful error in the terminal output before
  deleting lockfiles or clearing caches.
- Keep each package's lockfile unless you intentionally plan to
  regenerate it.

## Development Checks

### Frontend lint

```bash
cd frontend
npm run lint
```

### Frontend production build

```bash
cd frontend
npm run build
```

The audited backend package manifests do not define automated test
scripts; the root backend package currently has a placeholder test
script. Add tests for service routes, gateway middleware, credit
handling, and billing webhooks before treating the application as
production-ready.

## Contributing

Contributions and improvements are welcome.

1.  Fork the repository.
2.  Create a feature branch.
3.  Keep changes scoped to the relevant frontend or backend service.
4.  Do not commit `.env` files, credentials, generated private
    documents, or user uploads.
5.  Run the frontend lint/build checks and test the affected backend
    service.
6.  Open a pull request with a clear summary and testing notes.

## Author

**Siraj Abid**

- GitHub: [@SirajAbid17](https://github.com/SirajAbid17)
- Project repository:
  [SirajAbid17/Solvix](https://github.com/SirajAbid17/Solvix)

