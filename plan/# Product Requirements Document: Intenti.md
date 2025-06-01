# Product Requirements Document: Intentified Platform

## 1. Introduction

-   **Product Vision:** Intentified is a multi-tenant SaaS platform designed to revolutionize how businesses convert intent data into actionable sales pipelines. It automates client onboarding, conducts AI-driven market research, enriches lead data, and generates personalized, multi-channel outreach campaigns.
-   **Project Purpose:** This document outlines the requirements for the Minimal Viable Product (MVP) of the Intentified platform. Based on the initial project scoping discussions, which considered both an app for personal use and an MVP for a startup, the clear direction, as evidenced by the detailed specifications provided, is to focus on building a robust MVP for a startup. This PRD prioritizes core features for market validation, user feedback, and future growth.
-   **Problem Statement:** Businesses struggle with the time-consuming and often inefficient process of manually researching leads, crafting personalized outreach, and managing multi-channel campaigns. Intent data, while valuable, requires significant effort to activate effectively.
-   **Proposed Solution:** Intentified provides an end-to-end automated solution that streamlines this entire workflow, enabling clients to launch targeted outreach campaigns quickly and efficiently by leveraging event-driven architecture and AI.

## 2. Goals & Objectives

-   **Primary Goal:** Launch an MVP to validate the core value proposition: automating the generation of high-quality, personalized outreach campaigns from intent data.
-   **Secondary Goals:**
    -   Attract a cohort of early adopter clients to use the platform.
    -   Gather comprehensive user feedback to inform future product development, iterations, and feature prioritization.
    -   Demonstrate the technical feasibility, reliability, and scalability of the proposed event-driven architecture using Next.js, Supabase, and Trigger.dev.
    -   Establish a solid foundation for a commercially viable and scalable SaaS product.

## 3. Target Audience

-   **Primary Users:** Sales and marketing teams within B2B companies of various sizes that utilize, or plan to utilize, intent data for lead generation, pipeline building, and customer acquisition.
-   **User Profile:** Users are looking for tools to significantly improve operational efficiency, increase the effectiveness of their outreach efforts, and better leverage their investments in intent data. They value automation, personalization, and actionable insights.
-   **Tenant Structure:** The platform is designed for multi-tenancy. Each "tenant" is a client organization, which may have multiple individual users (e.g., sales reps, marketing managers, admins) collaborating within their dedicated workspace.

## 4. System Architecture Overview

The Intentified platform is designed as a scalable, multi-tenant SaaS with an event-driven architecture. This approach uses asynchronous events to trigger background workflows, decoupling services and improving scalability and responsiveness. In practical terms, whenever key events occur (e.g. a new client signup, a data purchase, or completion of onboarding input), they emit events that initiate automated workflows in the backend. These workflows perform heavy-lifting tasks like data extraction, AI content generation, and lead enrichment without blocking the user interface.

**Diagram Description:** The architecture (illustrated conceptually below) consists of several integrated components:

**Next.js Application (Frontend & Backend):** A single Next.js codebase serves the client-facing React UI and backend API routes. Next.js handles routing, SSR, and offers serverless API endpoints for backend logic. It interfaces with Supabase for data and uses `Trigger.dev` (embedded in the Next.js backend) for background jobs orchestration.

**Supabase (Database, Auth, Storage):** Supabase provides a Postgres database with Row-Level Security, ensuring each tenant’s data is isolated and secure. In a multi-tenant setup, a single application instance serves multiple clients, so all data rows include a tenant or organization ID. Supabase Auth manages user accounts (with support for multiple users per organization, akin to Slack’s workspace model) – achieved by linking users to an “organization” record. Supabase Storage can hold uploaded assets (e.g. a client’s logo or branding files used in onboarding).

**`Trigger.dev` Orchestrator:** The Next.js backend uses `Trigger.dev` to define and run event-driven workflows. `Trigger.dev` listens to events (such as a new user record in Supabase or an API call) and runs jobs composed of async tasks. For example, a “New Client Onboarding” job may be triggered on user signup and coordinate a sequence: fetch website data, call AI APIs, update database, etc. The event-driven approach ensures these processes run asynchronously in the background, improving app responsiveness. `Trigger.dev` provides robust job handling (no timeouts, automatic retries, concurrency control) and built-in monitoring for reliability.

**AI Services (OpenAI, Replicate SDKs):** The platform integrates AI APIs to generate content and analyze data. For instance, OpenAI’s GPT-4 is used to draft outreach email templates and summarize market research, while services like Replicate could be used for specialized tasks (e.g. image analysis of a company’s logo to extract color palette, or generating images if needed for email banners). These AI calls are made within `Trigger.dev` workflows as separate tasks.

**OSINT & Enrichment Module:** A custom Open-Source Intelligence (OSINT) and lead enrichment pipeline runs as part of the backend workflows. It gathers additional data about leads and companies from public sources and third-party APIs. For example, given a list of target companies or domains, the pipeline might call enrichment APIs (Clearbit, Hunter.io, etc.) to fetch firmographic details, contact info, social profiles, and recent news. It also performs competitor research by querying online sources (search engines, social media, databases) for the client’s industry and top 5 competitors. The gathered data is then stored in Supabase (e.g. in an “Insights” or “Competitors” table and a “Leads” table) for analysis.

**Resend Email Service:** Resend is integrated for outbound email delivery. The platform uses React Email templates (email UIs built with React components) to enable dynamic, reusable outreach content. AI-generated email copy and personalization tokens are injected into these React templates, producing HTML emails consistent with the client’s branding. Resend’s API is called (from backend or `Trigger.dev` jobs) to actually send the emails at the appropriate time. The system can later extend to other channels (SMS via Twilio API, LinkedIn messaging via LinkedIn’s API or scraping) using a similar pattern – e.g. a `Trigger.dev` task for SMS delivery or a LinkedIn outreach module.

**Architecture Flow:** When a client signs up and purchases intent data, the frontend Next.js app collects initial inputs (company name, website URL, etc.) and invokes an API route (or directly writes to the DB) to start onboarding. `Trigger.dev` either catches a Supabase DB event (new onboarding record) or is called directly to start the “onboarding workflow.” This workflow executes tasks in sequence (or in parallel where possible) – e.g. fetch the client’s website HTML, analyze it for SEO keywords and tone, store results; simultaneously, call OSINT functions to identify competitors and gather market data. As tasks complete, intermediate results are saved to the database. Once all subtasks finish, the system uses an AI prompt to generate outreach templates and another to compile ideal customer profile insights. Finally, everything is stored and made available on the frontend: the user can log in and see their personalized outreach kit – including 20 ready-to-use email templates (as React components) and an enriched list of potential leads with scores/intent signals.

**Key Benefits:** This architecture is serverless and scalable. Next.js API routes and `Trigger.dev` workflows run in a serverless environment (e.g. Vercel or similar), scaling automatically per demand. The event-driven pattern improves resiliency – components are decoupled, and tasks can be retried or failed independently without crashing the whole system. Each tenant’s data is protected by design: a single app instance serves all tenants, but each tenant’s records are isolated (tenancy is enforced both at the application layer and the DB row-level security). This yields the cost-efficiency of multi-tenancy without compromising security. Moreover, using managed services (Supabase, Resend) and open SDKs (Trigger.dev, OpenAI) significantly accelerates development and reduces infrastructure maintenance, allowing the team to focus on core domain logic.

(No single image can capture this entire system easily; however, imagine a flow diagram with users and browsers on the left hitting the Next.js app, which interacts with Supabase (database/auth) and sends events into `Trigger.dev` workflows. Those workflows branch out to call AI APIs, query the Supabase DB, and use external services like Resend for emails, before updating the DB. On the right, third-party APIs (OpenAI, Clearbit, etc.) and Resend are depicted. All components feed back into Supabase where results are stored, and the Next.js front-end reads from there to display data to the user.)

## 5. Key Features Overview

**Tenant Onboarding Automation:** A guided onboarding flow that automatically gathers a new client’s information. Upon first login, the system asks for minimal input (company name, website URL, industry, etc.), then autonomously collects additional data: it scrapes the company’s website to extract branding (logos, color palette), tone/voice of copy, and SEO metrics (e.g. domain authority, top keywords). This provides a baseline understanding of the client’s brand without manual setup.

**Market & Competitor Research:** For each new client, the platform performs AI-driven market research. It identifies 5 key competitors (via user input during onboarding or by searching the industry) and gathers data on each: product offerings, pricing (if available), marketing messaging, and any notable strengths/weaknesses. The AI then analyzes this info to determine the client’s market positioning relative to competitors, key challenges in reaching their audience, potential opportunities (e.g. underserved segments or differentiators), and an Ideal Customer Profile (ICP). The ICP includes traits like industry, company size, buyer persona roles, and pain points of the likely buyers.

**Intent Data Import & Enrichment:** When the client purchases a bulk intent data package, the raw lead data (e.g. a list of companies or contacts showing intent signals) is imported into the platform. The system then enriches these leads:
-   Deduplicating and validating lead entries.
-   Enriching with missing info: company details, contact names, titles, emails, LinkedIn URLs, etc., using the OSINT/enrichment module.
-   Scoring or tagging leads based on intent signals (e.g. topics they engaged with, intent score from the provider).
The output is a list of enriched lead profiles ready for outreach, each associated with the relevant intent context (e.g. “downloaded whitepaper on X” or “visited pricing page”).

**Automated Outreach Template Generation:** Using the insights from the onboarding and research, the platform generates 20 outreach templates. These are multi-channel message templates (primarily email, with language that could be adapted to LinkedIn or SMS). Each template is a React Email component containing placeholder variables for personalization (e.g. {LeadName}, {CompanyName}, {PainPoint}). The content varies in approach – templates for different scenarios such as a first-touch cold email highlighting a pain point, a follow-up email with a case study, a LinkedIn connection request message, etc. All templates are custom-tailored to the client’s context: they reflect the client’s value proposition and branding tone, and address challenges/opportunities identified in the competitor analysis. (For instance, if a competitor is known for high price, a template might emphasize the client’s cost-effectiveness.)

**Multichannel Outreach Sequencing:** The platform allows clients to configure an outreach sequence combining email and optional SMS/LinkedIn steps. A default sequence might be generated (e.g. Email Day 1, Email Day 3, LinkedIn message Day 5, etc.), which the client can adjust. The advantage is to diversify touchpoints across channels, increasing chances of engagement. The system ensures timing and channel rules (e.g. don’t SMS at night, stop sequence if replied, etc.). Initially, email is fully automated via Resend. SMS and LinkedIn steps could be delivered as notifications or tasks for a sales rep (or integrated via APIs if available). This feature ensures a true multichannel strategy out-of-the-box, not just email blasts.

**Campaign Initialization & Sending:** After reviewing the enriched leads and AI-written templates, the client can initiate a campaign. The platform provides a UI to select which templates to use, assign them to leads or lead segments, and schedule the sending. Thanks to `Trigger.dev` workflows, the actual sending can be spread out to avoid spam filters (e.g. send 50 emails per hour) and to react to events (if a lead replies or opts out, subsequent emails to them are canceled). Integration with Resend handles email deliverability (with bounce handling, open/click tracking in future). For other channels, integration stubs exist (e.g. generate a CSV of phone numbers for SMS, or use an API for LinkedIn automation in a later version).

**Dashboard & Analytics:** A core feature is a dashboard where the client sees the outcome of the pipeline. This includes:
-   A Lead List view showing all enriched leads, with filters for intent level, industry, etc., and the ability to drill into a lead’s profile (showing the data gathered: firmographics, social links, intent signals).
-   An Outreach Templates library where the 20 AI-generated templates are listed. Users can preview each (rendered as it would appear in an email client), customize wording or design (using a rich text or code editor for the React component), and save changes (preserving the AI original as well).
-   A Campaign Manager to launch or schedule campaigns. Here they choose which leads to target and which template/sequence to use. In MVP this might be basic (e.g. send campaign now vs later, to all leads or selected ones).
-   Performance Analytics (likely post-MVP): stats on emails sent, open rates, reply rates, etc., to measure effectiveness of each template and channel. (This requires tracking pixels and reply handling, which can be future enhancements.)

**User Management & Settings:** Since it’s multi-tenant, each client (company) might have multiple user seats. The app supports inviting team members to the platform (via email invite) and assigning roles (e.g. admin, read-only). Also, settings for the organization: branding overrides (if they want to tweak colors in templates), email sending domains (setup DNS for Resend), unsubscribe footer customization, etc. Security features like 2FA for login could be included given sensitive lead data is stored.

**Scalability & Security Under-the-Hood:** While not directly “features” visible to users, the PRD includes requirements for:
-   Scalable Job Processing: The event pipeline should handle multiple client onboardings in parallel. If 10 clients sign up at once, the system spins up concurrent workflows without performance degradation. `Trigger.dev`’s queue and concurrency controls will be tuned for this.
-   Error Handling & Alerts: If any step in the workflow fails (e.g. AI API rate-limit error or an enrichment API timeout), the system logs the error, retries automatically (with exponential backoff), and if still failing, notifies the dev team and shows a warning in the client UI (e.g. “5 leads failed to enrich, retrying…”). Observability is built-in: every background task is logged and traceable for debugging.
-   Data Privacy & Compliance: All stored data is secured per tenant. Ensure compliance with email laws (CAN-SPAM/GDPR) by allowing unsubscribe management in outreach emails (e.g. a simple unsubscribe link in templates that can mark a lead as opted-out in the DB and halt further emails).

## 6. User Flows

To illustrate how users (clients) interact with Intentified, here are the primary user flows:

**a. Sign Up & Onboarding Flow:**

-   **Sign Up:** A new user visits the marketing site and clicks “Get Started”. They provide basic info (name, work email, password) and possibly choose a plan or intent data package. After email verification, their account and an organization record are created in Supabase Auth (with a unique org ID).
-   **Welcome & Package Purchase:** Upon first login, if they haven’t purchased data yet, they’re prompted to select an intent data package (number of leads or specific intent criteria). Let’s assume this was done upfront – the system now has (or will fetch) a raw list of leads for them.
-   **Onboarding Questions:** The user is guided through a few steps:
    -   **Company Info:** They confirm or input their company name, website URL, and optionally upload a logo (stored in Supabase Storage).
    -   **Brand/Tone Quiz (optional):** A step where they can choose adjectives for their brand voice (e.g. formal vs casual, humorous vs serious) to refine the AI’s tone. If they skip, the system deduces tone from the website copy.
    -   **Competitors:** They enter names or URLs of up to 5 competitors (if known). If they leave it blank, the system will automatically find competitors via web search.
-   **Launch Analysis:** After submitting onboarding info, the UI shows a “Generating your campaign…” loading state. Behind the scenes, this triggers the Onboarding Workflow (via `Trigger.dev`). The user can safely navigate away or even log out – the workflow runs server-side. This workflow will:
    -   Scrape the company website URL (e.g., fetch homepage and about page content).
    -   Use an SEO API or library to get metrics (traffic estimates, domain rank, top keywords).
    -   Analyze the site’s CSS or images for brand colors (or use the uploaded logo).
    -   Process competitor info: for each competitor (from user or auto-found), fetch their site or find a summary about them (possibly using a search + GPT summarization).
    -   Summarize market insights: feed data into an AI prompt like “Given these competitors and this company, summarize the unique value prop, challenges, and ideal customer profile.”
    -   Generate outreach templates: prompt the AI (GPT-4) to produce 20 email drafts tailored to the ICP and challenges identified. Each with a different approach or hook. The output might include structured data (subject line, body, call-to-action).
    -   Enrich leads: concurrently, a sub-workflow takes the raw intent leads and calls enrichment APIs (Clearbit etc.) to fill details. This might happen in batches if leads list is large. Enriched leads are stored in the “Leads” table.
    -   Possibly, also generate a suggested outreach sequence timing (could be simple rules).
-   **Onboarding Complete:** Within a few minutes, the workflow finishes. The user receives a notification (in-app, and maybe via email) that their outreach campaign is ready. When they go to the dashboard, they can now see the results.

**b. Reviewing & Customizing Output:**

-   **Dashboard View:** The user sees a dashboard with key highlights – e.g. “50 new intent leads enriched” and “20 outreach templates generated”. They might see a visual like a pipeline completion status.
-   **Review Leads:** The user clicks into the Leads page. They see a table of leads with columns like Name, Company, Title, Intent (e.g. “Researched X solution”), and a score or priority. They can search or filter (e.g. by industry or score). Clicking a lead opens a detail sidebar with full info (contact info, LinkedIn, etc.). The user can deselect any leads they deem not relevant (perhaps marking them “inactive”).
-   **Review Templates:** The user then navigates to the Outreach Templates library. Each of the 20 templates is listed with a title or intended use (e.g. “Cold Email – Pain Point Focus”, “Follow-up – Case Study”, “LinkedIn Connection Request”, etc.). The user can click each to preview. The preview renders the React email template with example data (like [[LeadName]] as “John”).
    -   If the user wants to tweak a template, they click “Edit”. They can edit text in a rich-text editor or a code editor for advanced changes (the template is basically JSX/TSX code under the hood, but we may provide a form UI for common edits like “insert your product name here”). They save changes, which update the template (either saving the diff or storing a custom version for that org).
    -   The user can also choose to omit some templates from use (e.g. archive ones they don’t like).
-   **Adjust Sequence:** In the Campaign settings, the user sees the default multichannel sequence proposed. For example:
    -   Day 0: Email (Template A)
    -   Day 3: Email (Template B)
    -   Day 5: LinkedIn message (Template C)
    -   Day 7: Email (Template D)
    They can rearrange or remove steps. If they don’t plan to use LinkedIn or SMS, they could delete those steps or toggle channels off. The UI might show that LinkedIn steps will require manual sending (if not automated yet).
-   **Sender Setup:** If not already configured, the user is prompted to verify their sending domain for emails (to improve deliverability). They get DNS instructions for Resend. (This could be part of onboarding or first campaign setup.)

**c. Launch Campaign Flow:**

-   **Select Targets:** The user goes to “Launch Campaign”. They pick which leads to include – e.g. select all, or some segment (maybe the system auto-segments leads by industry or intent level).
-   **Assign Sequence:** They choose which outreach sequence or template set to use. By default, the one just created is selected.
-   **Schedule or Send:** The user can either start immediately or schedule a later start time. They click “Start Campaign”.
-   **Execution:** Once launched, a Campaign Workflow is triggered. This could be managed by `Trigger.dev` scheduling tasks for each step:
    -   Immediately, send the Day 0 emails via Resend (maybe in batches of X per minute).
    -   Schedule follow-up tasks for Day 3, Day 5, etc. (`Trigger.dev` can handle scheduled waits or use cron triggers for daily checks).
    -   The workflow monitors responses: if a lead replies (this would require integrating inbound email or at least tracking opens/clicks for now), the workflow could mark that lead as “engaged” and cancel future steps for them.
    -   For LinkedIn steps, since automation might not be fully built, the system could at Day 5 send the user a reminder with the template text: “It’s time to send a LinkedIn message to Lead X, here’s a template.” (Future: integrate via LinkedIn API or tools.)
-   **Monitoring:** The client can view campaign status on the dashboard: how many emails sent, how many opened, etc. (Basic MVP might only show number sent and let them mark who responded manually.) The system logs each send event. We plan to incorporate real-time monitoring (via `Trigger.dev`’s real-time API) so the UI could show a live progress bar of emails being sent, etc.
-   **Follow-up & Iteration:** After or during the campaign, the user might adjust on the fly – e.g. pause the campaign, remove a lead, or edit a template for future sends. The system should allow that (with appropriate safeguards like not editing an email that’s already queued to send in the next 5 minutes, etc.)

**d. Ongoing Use & Value:**

-   After the initial campaign, the user can upload or purchase new intent data over time. Each time they import new leads, the enrichment pipeline runs to update the lead profiles (this could be a user-initiated flow: “Upload CSV of leads” -> system enriches them).
-   The user can also request updated market analysis periodically. Perhaps there’s a feature “Refresh Insights” that reruns the competitor analysis (since markets evolve). This would use AI to provide updated challenges/opportunities.
-   Users will rely on the platform as a continuously updated pipeline generator – each time they get a new batch of intent leads, the system quickly turns it into an actionable outreach pipeline with minimal manual work.

## 7. Epics and User Stories

To organize development, the requirements can be grouped into major Epics with key user stories under each:

**Epic 1: Tenant Onboarding & Data Ingestion**
-   User Story 1.1: As a new client, I want to input my basic company info and have the system automatically gather additional details (branding, website copy, etc.), so that I save time preparing my account.
-   User Story 1.2: As a new client, I want to provide a list of competitors (or have the system find them) so that the platform understands my market landscape.
-   User Story 1.3: As a product manager (internal), I want the system to ingest a purchased intent data file (e.g. CSV of leads) and automatically enrich it, so that clients immediately see useful lead info without manual research. (Acceptance: given a CSV with fields [name, company], the system fills emails, titles, etc., using APIs.)

**Epic 2: AI Research & Analysis**
-   User Story 2.1: As a platform, I want to analyze a client’s website to determine their brand tone, primary colors, and key messaging, so that AI-generated content can match their style.
-   User Story 2.2: As a marketing user, I want the system to identify my unique value proposition vs competitors, so that outreach messaging can highlight what sets us apart. (The system’s AI should output a brief positioning statement or bullet points.)
-   User Story 2.3: As a sales user, I want an ideal customer profile (ICP) defined for me, so I know the types of leads being targeted and why. (The platform could present a summary like “Your ideal customers are mid-market IT managers in fintech who struggle with X…”)
-   User Story 2.4: As a developer, I want these analyses to run in the background via events, so the user isn’t stuck waiting on the UI. (This is a technical story ensuring event-driven jobs are used.)

**Epic 3: Outreach Template Generation**
-   User Story 3.1: As a user, I want the system to generate multiple outreach email templates tailored to my product and target customers, so I don’t have to write cold emails from scratch. (Acceptance: 20 distinct templates appear, each with realistic, personalized copy.)
-   User Story 3.2: As a user, I want to review and edit the AI-generated templates in an easy editor, so I can tweak wording to better fit my voice.
-   User Story 3.3: As a user, I want the templates to be ready for sending via the platform (with proper formatting and variables), so I can use them immediately in campaigns. (Templates should be stored as React components or HTML with merge fields, ready for Resend.)

**Epic 4: Multichannel Outreach Pipeline**
-   User Story 4.1: As a user, I want to configure a sequence of outreach touches across email (and other channels), so that I can maximize engagement by reaching leads through multiple avenues.
-   User Story 4.2: As a user, I want the platform to automate sending emails on a schedule, so that I can “set and forget” a campaign rollout.
-   User Story 4.3: As a user, I want to be reminded or assisted with other channel touches (SMS, LinkedIn), so that those steps are not missed even if not fully automated.
-   User Story 4.4: As a system, I want to monitor for lead replies or bounces, so that I can stop or adjust the sequence for those leads (e.g. don’t keep emailing someone who replied). (This might be future functionality involving email reply detection or integration with CRM.)

**Epic 5: Dashboard & Analytics**
-   User Story 5.1: As a user, I want a dashboard that clearly shows the status of my leads and campaigns, so I know what’s happening (e.g. “X emails sent, Y opens, Z replies”).
-   User Story 5.2: As a user, I want to easily browse the enriched leads, filter them, and select which ones to include in campaigns, so I maintain control over outreach targeting.
-   User Story 5.3: As a user, I want to see which templates are performing best (open/reply rates), so I can double down on effective messaging. (Future analytics epic.)
-   User Story 5.4: As an admin (internal), I want to monitor the background jobs and any failures, so I can proactively fix issues or guide the user if something went wrong. (This ties into observability – having an internal admin panel or using `Trigger.dev`’s UI for monitoring job runs.)

**Epic 6: Account Management & Security**
-   User Story 6.1: As an organization owner, I want to invite team members to collaborate in the platform, so my colleagues can also view and use the leads and campaigns.
-   User Story 6.2: As a user, I want role-based access (e.g. only admins can configure billing or sequences), so that there is proper permission control within my team.
-   User Story 6.3: As a user, I want to configure settings like email sender info, unsubscribe footer text, etc., to ensure compliance and branding consistency.
-   User Story 6.4: As a security officer (internal), I want all tenant data strictly isolated and secured, so that no client can ever access another’s data, and the data is safe from external breaches. (This is ensured via multi-tenant design and cloud security best practices.)

**Epic 7: Performance & Observability (Engineering)**
-   User Story 7.1: As a developer, I want the system to log detailed information about each workflow run (traces, timing of each task), so that we can troubleshoot slow points or failures easily.
-   User Story 7.2: As a developer, I want automated alerts if a background job fails or if an external API quota is reached, so that we can react and inform the user if necessary. (e.g. `Trigger.dev` can send webhook or Slack alert on job failures, CloudWatch-style alerts for custom logic)
-   User Story 7.3: As a developer, I want to easily scale the workers processing the events, so the system can handle growth (e.g. moving `Trigger.dev` to a dedicated server or using multiple serverless functions if needed).
-   User Story 7.4: As a product manager, I want usage metrics (how many leads processed, how many emails sent per tenant) readily available, so we can gauge feature usage and possibly bill usage-based.

Each epic above will be fleshed out with detailed tasks in Jira (or similar) – the above is a high-level mapping.

## 8. Prioritized Roadmap

We plan an iterative rollout, focusing on core value first (MVP) and then enhancements. Below is a phased roadmap with priorities:

**Phase 1: MVP Launch**
-   **Timeline:** ~Q3 2025
-   **Scope & Features:** Core Pipeline Automation – Implement end-to-end flow for one channel (email). Includes user sign-up, onboarding data extraction, basic competitor analysis, ICP definition, generation of ~20 email templates, lead enrichment for one data source, and the ability to send an email campaign to those leads. Basic UI for reviewing leads and templates. Multi-tenancy fully in place with secure data isolation. High observability in backend (logs, error alerts) but minimal in-app analytics. Resend integration for sending emails. **Dev Note:** focus on getting the `Trigger.dev` workflows reliable and the AI outputs high-quality.
-   **Priority:** Must Have – Essential to prove core value.

**Phase 2: Multichannel & UX Improvements**
-   **Timeline:** ~Q4 2025
-   **Scope & Features:** Add SMS or LinkedIn as a beta channel – e.g. integrate Twilio to send SMS follow-ups. Templates for these channels included. Sequence builder UI for timing between touches. Template editor with WYSIWYG improvements. Dashboard enhancements – show campaign status, basic open rate tracking (if possible via Resend’s webhook or a pixel). Team accounts – invite additional users to org. Begin implementing role-based access. Address UX feedback from MVP (e.g. allow user to re-run competitor research or regenerate templates if not satisfied).
-   **Priority:** High – Important to start differentiating with multichannel capability and polish the user experience.

**Phase 3: Analytics & Intelligence**
-   **Timeline:** ~Q1 2026
-   **Scope & Features:** Advanced Analytics: Track email opens, clicks, replies. Display performance per template and per campaign. Possibly integrate with a CRM to push responses. Adaptive Campaigns: Use AI to adjust messaging or sequence based on interim results (e.g. if no opens, try a different subject line in next emails – more of a stretch goal). Marketplace Integrations: Provide option to import data from other intent sources via API, or export enriched leads to CRM. Scalability focus: Optimize for larger clients (e.g. thousands of leads, many concurrent campaigns) – may involve moving some processing to separate microservices or optimizing DB indices, etc.
-   **Priority:** Medium – Adds significant value, keeps platform sticky, but can come after core usage is validated.

**Phase 4: Refinement & Scale**
-   **Timeline:** ~2026 and beyond
-   **Scope & Features:** AI Improvements: Possibly fine-tune AI models on successful vs unsuccessful outreach data to improve template suggestions. Full LinkedIn Automation: Integrate a LinkedIn automation tool or API if feasible to send messages directly. User Personalization: Allow user to provide feedback on templates (like “thumbs up/down”) to refine future generations. Globalization: Support internationalization of templates if targeting non-English outreach. Infrastructure Hardening: Additional security audits, load testing, and failover setups as user base grows.
-   **Priority:** Medium/Low – Nice-to-have features and long-term scaling, planned as continuous improvements.

**Note:** The timeline is tentative. MVP (Phase 1) is the top priority – delivering the core promise of automated lead-to-outreach pipeline. Phase 2 focuses on expanding engagement (multi-channel, team collaboration) which is high priority to stay competitive. Phases 3-4 are about depth and scale (analytics, smarter AI, broader integrations) and will be prioritized based on user feedback and growth needs. We will maintain an agile approach, potentially releasing some Phase 3 features earlier if they become critical (for example, if many users demand open rate tracking, we might not wait until Q1 2026).

## 9. Success Metrics (for MVP - Phase 1)

-   **User Adoption & Engagement:**
    -   Number of new client sign-ups.
    -   Completion rate of the tenant onboarding flow.
    -   Number of active tenants/organizations (daily/weekly/monthly active users within orgs).
    -   Average number of leads processed per tenant.
    -   Average number of outreach campaigns launched per tenant.
-   **Core Feature Performance & Quality:**
    -   Success rate and accuracy of automated data extraction (website scraping, branding) during onboarding.
    -   Quality of AI-generated outputs (competitor analysis, ICP, outreach templates) measured by user acceptance, revision rates, and qualitative feedback.
    -   Lead enrichment fill rate and perceived accuracy of enriched data.
    -   Email campaign deliverability rates, open rates, and click-through rates (basic tracking via Resend).
-   **System Stability & Reliability:**
    -   Platform uptime and availability.
    -   Successful completion rate of background jobs and workflows (e.g., `Trigger.dev` jobs).
    -   Error rates (application and background jobs) and mean time to recovery (MTTR).
    -   Performance of key operations (e.g., onboarding time, campaign launch time).
-   **Client Satisfaction & Market Validation:**
    -   Qualitative feedback from user interviews, surveys, and support channels.
    -   Net Promoter Score (NPS) or similar satisfaction metric from early adopters.
    -   Client retention rate (for early cohorts, if applicable within MVP timeframe).
    -   Number and nature of feature requests and bug reports (indicative of engagement and areas for improvement).

## 10. Open Questions & Assumptions

-   **Assumption (Project Focus):** The primary focus is unequivocally the "minimal MVP for a startup." The initial consideration of "an app for my own use" is considered addressed by building a powerful tool that the founders/team would themselves use, or has been superseded by the startup MVP goal.
-   **Assumption (Technology Stack):** The specified technology stack (Next.js, Supabase, Trigger.dev, OpenAI, Replicate SDKs, Resend) is approved and deemed suitable for the MVP requirements and planned future scalability.
-   **Assumption (Intent Data):** Clients will be able to provide or purchase intent data in a format that can be ingested by the system (e.g., CSV as a starting point for MVP).
-   **Assumption (AI Output Quality):** The selected AI models (e.g., GPT-4) can produce sufficiently high-quality and relevant content (market insights, email templates) with appropriate prompting and data inputs.
-   **Clarification Needed (Pre-Development or Early MVP):**
    -   Specific details of the "intent data package" purchase flow if this is to be integrated directly, versus users bringing their own data.
    -   Detailed error handling strategy for end-users: What specific messages or guidance will users see if parts of the automated process encounter issues (e.g., enrichment failure for some leads, AI generation errors)?
    -   Specific legal and compliance requirements (e.g., detailed GDPR/CAN-SPAM consent mechanisms beyond unsubscribe links, data processing agreements) should be reviewed by legal counsel.
    -   The exact UI/UX for the optional "Brand/Tone Quiz" during onboarding.
    -   Definition of basic vs. advanced analytics for post-MVP phases, including specific metrics and dashboard designs for Phase 3 "Performance Analytics."
    -   Handling of API keys and secure management for third-party services (OpenAI, enrichment APIs, etc.) per tenant, if applicable, or if centralized management is used.
