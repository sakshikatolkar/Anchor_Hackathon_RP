# Anchor — Personal Document Vault

Anchor is a secure AI-powered document vault that helps individuals and families organize important documents, understand their contents, and prepare for emergencies. Upload files, get AI-powered summaries, and chat with an intelligent assistant that knows your documents.

---

## Features

### Document Vault
- Upload PDF, JPG, PNG, and DOCX files to a secure AWS S3 bucket
- Organize documents by category: Identity, Immigration, Housing, Insurance, Medical, Financial, Legal, Other
- Set visibility levels per document: Private, Family, or Emergency
- Delete documents from the vault
- View and search all uploaded documents

### Vault Health Score
- Priority-weighted checklist of important document types
- Real-time health score (0–100%) based on what you've uploaded
- Highlights missing critical documents (Government ID, Insurance, Medical Records, etc.)

### AI Document Analysis
- Automatically extracts a plain-English summary of each document
- Identifies important dates and deadlines
- Extracts payment amounts, balances, and financial figures
- Works on both text-based and scanned/image-based PDFs using OpenAI vision

### AI Chatbot (Anchor AI Agent)
- Document-aware conversational assistant
- Reads all your uploaded documents from S3 and answers questions about them
- Handles scanned PDFs using OpenAI's Responses API with vision
- Suggests missing documents and explains vault categories
- Accessible via a floating chat widget on the upload page

### Authentication
- Google OAuth sign-in via Supabase Auth
- Protected routes — `/upload` and `/demo` require authentication
- Automatic redirect to login for unauthenticated users
- Role-based demo access: Owner, Family Member, Emergency Contact

### Marketing Site
- Landing page with hero, stats, features, and CTA sections
- Features page explaining vault categories
- Animated counters and scroll reveal effects

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend & API | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Auth | Supabase Auth (Google OAuth) |
| Database | Supabase (PostgreSQL) |
| File Storage | AWS S3 |
| AI (Chat) | OpenAI GPT-4o / GPT-4o-mini |
| AI (Analysis) | OpenAI GPT-4o-mini with vision |
| Animation | Motion (Framer Motion) |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Project Structure

```
├── app/
│   ├── (marketing)/          # Public marketing pages
│   │   ├── page.tsx          # Landing page
│   │   └── features/         # Features page
│   ├── api/
│   │   ├── analyze/          # POST — AI document analysis
│   │   ├── chat/             # POST — AI chatbot endpoint
│   │   ├── debug/            # GET  — Debug auth/db state
│   │   ├── documents/        # GET/DELETE/PATCH — Document CRUD
│   │   └── upload/           # POST — File upload to S3
│   ├── auth/callback/        # Supabase OAuth callback handler
│   ├── login/                # Login page (role selection + Google OAuth)
│   ├── upload/               # Main vault page (protected)
│   └── demo/                 # Demo page (protected)
│
├── components/
│   ├── agent-chat.tsx        # Floating AI chatbot widget
│   ├── alerts-panel.tsx      # Alerts UI panel
│   ├── ask-anchor.tsx        # Ask Anchor component
│   ├── document-card.tsx     # Document display card
│   ├── grief-mode.tsx        # Grief mode guided plan
│   ├── sidebar.tsx           # App sidebar with navigation
│   ├── vault-view.tsx        # Vault document viewer
│   ├── site/                 # Marketing site components
│   │   ├── home/             # Hero, stats, how-it-works, CTA
│   │   ├── features/         # Feature rows component
│   │   ├── site-nav.tsx      # Top navigation bar
│   │   └── site-footer.tsx   # Footer
│   └── ui/                   # Reusable UI primitives (button, card, badge, etc.)
│
├── lib/
│   ├── chat-with-documents.ts        # Core chatbot logic — S3 fetch + OpenAI
│   ├── openai-document-analysis.ts   # Document analysis — S3 fetch + OpenAI vision
│   ├── supabase.ts                   # Supabase browser client
│   ├── supabase-server.ts            # Supabase server client (SSR)
│   ├── categories.tsx                # Document category definitions
│   ├── mock-data.ts                  # Demo/mock data
│   └── utils.ts                      # Utility functions (cn, etc.)
│
├── middleware.ts             # Auth middleware — protects /upload and /demo
└── server/                   # Django backend scaffold (not active)
```

---

## Running Locally

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- A Supabase project
- An AWS S3 bucket
- An OpenAI API key

### 1. Clone the repo

```bash
git clone https://github.com/sakshikatolkar/Anchor_Hackathon_RP.git
cd Anchor_Hackathon_RP
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env.local
```

See `.env.example` for the full list.

### 4. Set up Supabase

In your Supabase project, create the following tables:

**`users`**
```sql
create table users (
  id uuid primary key references auth.users(id),
  email text,
  name text,
  password_hash text,
  created_at timestamptz default now()
);
```

**`documents`**
```sql
create table documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references users(id),
  file_name text,
  original_filename text,
  filename text,
  file_type text,
  mime_type text,
  size text,
  category text,
  visibility text default 'Private',
  s3_key text,
  s3_url text,
  status text default 'ready',
  plain_english_summary text,
  important_dates_and_deadlines jsonb,
  payments_amounts_balances jsonb,
  ai_analysis jsonb,
  uploaded_at timestamptz default now()
);
```

**`access_control`**
```sql
create table access_control (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references users(id),
  grantee_email text,
  role text,
  created_at timestamptz default now()
);
```

Also enable Google OAuth in Supabase → Authentication → Providers → Google, and set:
- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: `http://localhost:3000/auth/callback`

### 5. Run the development server

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment (Vercel)

1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Add all environment variables listed in `.env.example`
4. Deploy
5. Update Supabase → Authentication → URL Configuration:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: `https://your-app.vercel.app/auth/callback`

---

## Dependencies

### Production

| Package | Purpose |
|---|---|
| `next` | React framework with App Router and API routes |
| `react` / `react-dom` | UI library |
| `@supabase/ssr` | Supabase SSR client for Next.js |
| `@supabase/supabase-js` | Supabase JS client |
| `openai` | OpenAI API client (chat + vision) |
| `@aws-sdk/client-s3` | AWS S3 file upload and retrieval |
| `@aws-sdk/s3-request-presigner` | S3 presigned URLs |
| `@aws-sdk/util-stream-node` | Stream utilities for S3 responses |
| `pdf-parse` | Extract text from PDF files server-side |
| `tailwindcss` | Utility-first CSS framework |
| `motion` | Animation library (Framer Motion) |
| `lucide-react` | Icon library |
| `class-variance-authority` | Component variant styling |
| `clsx` / `tailwind-merge` | Class name utilities |
| `@base-ui/react` | Accessible UI primitives |
| `@vercel/analytics` | Vercel analytics |

### Dev

| Package | Purpose |
|---|---|
| `typescript` | Type safety |
| `@types/node` / `@types/react` | TypeScript type definitions |
| `@tailwindcss/postcss` | Tailwind PostCSS integration |
| `postcss` | CSS processing |

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (server only, used for shared vault access) |
| `AWS_ACCESS_KEY_ID` | ✅ | AWS IAM access key |
| `AWS_SECRET_ACCESS_KEY` | ✅ | AWS IAM secret key |
| `AWS_REGION` | ✅ | AWS region (e.g. `us-east-2`) |
| `AWS_S3_BUCKET` | ✅ | S3 bucket name |
| `OPENAI_API_KEY` | ✅ | OpenAI API key |
| `OPENAI_MODEL` | ❌ | Model to use (default: `gpt-4o-mini`) |
| `INVITE_SECRET` | ❌ | Secret for signing share invites (falls back to AWS/OpenAI keys) |

---

## Key Flows

### File Upload
1. User selects a category and drags/drops a file
2. `POST /api/upload` authenticates the user, uploads file to S3 at `{userId}/{filename}`, saves metadata to Supabase `documents` table

### AI Chat
1. User sends a message in the chat widget
2. `POST /api/chat` fetches all user files from S3 using `{userId}/` prefix
3. Text-based PDFs are parsed with `pdf-parse`
4. Scanned/image-based PDFs are uploaded to OpenAI and processed with vision via the Responses API
5. OpenAI generates a response with full document context

### Document Analysis
1. `POST /api/analyze` is called with a `documentId`
2. Document S3 key is fetched from Supabase
3. File is downloaded from S3 and sent to OpenAI for structured analysis
4. Results (summary, dates, amounts) are saved back to Supabase

### Auth Flow
1. User clicks "Continue with Google" on `/login`
2. Supabase redirects to Google OAuth
3. Google redirects to `/auth/callback` with a code
4. Callback exchanges code for session and redirects to `/upload?role=Owner`
