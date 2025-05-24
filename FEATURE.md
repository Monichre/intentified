Technical Components Required For Onboard Flow

# List of Required Features for Application Launch

## Web Search

![Screenshot 2025-05-21 at 6.05.39 PM](apps/app/docs/Screenshot%202025-05-21%20at%206.05.39%E2%80%AFPM.png)

## AI PDF Ingest

![Screenshot 2025-05-21 at 6.05.46 PM](apps/app/docs/Screenshot%202025-05-21%20at%206.05.46%E2%80%AFPM.png)

## Jina AI Web Scraper

![Screenshot 2025-05-21 at 6.05.52 PM](apps/app/docs/Screenshot%202025-05-21%20at%206.05.52%E2%80%AFPM.png)

## Cheerio Web Scraper

![Screenshot 2025-05-21 at 6.06.00 PM](apps/app/docs/Screenshot%202025-05-21%20at%206.06.00%E2%80%AFPM.png)

## AI Agent Sandbox

![Screenshot 2025-05-21 at 6.06.04 PM](apps/app/docs/Screenshot%202025-05-21%20at%206.06.04%E2%80%AFPM.png)

## AISDK Prompt Few-Shot Editor

![Screenshot 2025-05-21 at 6.06.22 PM](apps/app/docs/Screenshot%202025-05-21%20at%206.06.22%E2%80%AFPM.png)

## AI Document Processing Pipeline

![Screenshot 2025-05-21 at 6.06.27 PM](apps/app/docs/Screenshot%202025-05-21%20at%206.06.27%E2%80%AFPM.png)

## AI Profile Enrichment / AI Web Content Summarizer

![Screenshot 2025-05-21 at 6.06.33 PM](apps/app/docs/Screenshot%202025-05-21%20at%206.06.33%E2%80%AFPM.png)

Ok these are each of the pipelines I want in the product but there are a few tweaks.

1. Web search, Jina Ingest, Cheerio Scraper and the lion's share of the Seo application/feature/Cult UI app all get merged into one.
2. Document Processing Pipeline and PDF Ingest get merged

Next Step

1. Ensure React Email Ingestion: <https://trigger.dev/docs/guides/examples/react-email>
2. Ensure Trigger Pipeline Works
3. Add Tiocket for Orshot
<https://orshot.com/workspace/digital-mischief-group/templates/library/website-screenshot>

<https://developer.productboard.com/reference/introduction>

**Phase 1: Requirements Analysis**

### 1. Findings / Deliverables

#### **Explicit Functional Requirements**

- **Database support for:**
  - **Trigger tasks** (likely for background jobs, workflow orchestration, status tracking, etc.)
  - **CSV file uploads** (storing file metadata, row data, validation, etc.)

#### **Implied Requirements**

- **Unified, maintainable, and scalable database schema** for all core features (trigger tasks, CSV uploads, possibly more).
- **Consistency** between ORM (Prisma) and direct SQL (Supabase/Postgres) usage.
- **Ability to support event-driven workflows** (trigger tasks) and file-based data ingestion (CSV).
- **Schema(s) should support multi-tenancy** (as per PRD: each client/org is isolated).
- **Support for real-time updates and status tracking** (for tasks, file processing, etc.).
- **Extensibility** for future features (e.g., document processing, analytics, etc.).

#### **Non-Functional Requirements**

- **Performance:** Efficient querying for large CSVs, fast task status updates, scalable for many concurrent jobs.
- **Security:** Row-level security (RLS) for tenant isolation, secure file access, and task visibility.
- **Scalability:** Support for many tenants, large file uploads, and high task throughput.
- **Maintainability:** Clear, DRY schema; minimal duplication between Prisma and raw SQL; easy to extend.
- **Observability:** Support for logging, error tracking, and monitoring (especially for background jobs).
- **Compatibility:** Must work with both Prisma (for Node/TypeScript backend) and Supabase (for direct Postgres access, RLS, storage, etc.).

#### **Ambiguities / Clarifications Needed**

- **Source of truth:** Should all tables be defined in Prisma, in raw SQL, or both? (Currently, some are only in one or the other.)
- **Task model:** What are the required fields for trigger tasks? (Status, payload, progress, error, timestamps, etc.?)
- **Multi-tenancy:** Is tenant isolation handled at the DB level (org_id/user_id on every row + RLS), or in app logic?
- **Supabase vs Prisma:** Which features must be accessible via Supabase (e.g., RLS, storage), and which via Prisma (Node backend)?
- **Schema evolution:** How should we keep Prisma and raw SQL schemas in sync? (Manual, codegen, or single source of truth?)

#### **Current Confidence**

- **80%** (I have a strong grasp of the requirements, but need clarification on the above ambiguities.)

---

### 2. Questions to Resolve Ambiguities

1. **Source of Truth:**  
   - Should all database tables (including tasks, CSV files, etc.) be defined in `schema.prisma`, in raw SQL migrations, or both?  
   - Is there a preferred direction (Prisma → SQL, or SQL → Prisma), or do we need to support both equally?

2. **Task Model:**  
   - What are the required fields for a "trigger task"? (E.g., status, type, payload, progress, error, timestamps, org/user id, etc.)
   - Should tasks be multi-tenant (org_id/user_id on every row)?

3. **Multi-Tenancy:**  
   - Is tenant isolation enforced at the database level (RLS, org_id/user_id on every row), or only in application logic?
   - Should all tables (CSV, tasks, etc.) include org_id/user_id for RLS?

4. **Supabase vs Prisma Usage:**  
   - Which features must be accessible via Supabase's REST/realtime API (e.g., for RLS, storage, direct client access)?
   - Which features are only needed in the Node backend via Prisma?

5. **Schema Evolution:**  
   - How do you want to manage schema changes? (Single source of truth, codegen, manual sync, etc.)
   - Is there a migration strategy for keeping Prisma and raw SQL schemas in sync?

---

### 3. Next Steps

- Await answers to the above questions to resolve ambiguities.
- Once clarified, proceed to **Phase 2: System Context Examination**:
  - Review current codebase structure and integration points for database access.
  - Identify all places where CSV, tasks, and other DB features are used.
  - Map out system boundaries and external integrations (Supabase, Prisma, Trigger.dev, etc.).

---

**Summary:**  
I have a solid understanding of the need for a unified, maintainable, and scalable database schema supporting both trigger tasks and CSV file uploads, with multi-tenancy, security, and extensibility. However, there are key ambiguities around the source of truth for schema, the exact task model, multi-tenancy enforcement, and the division of responsibilities between Prisma and Supabase.  
**Current confidence: 80%.**  
**Please answer the above questions to proceed to the next phase.**
