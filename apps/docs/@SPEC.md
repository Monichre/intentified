# Realtime CSV Importer - Feature Specification

## Feature/Epic/Milestone: Real-time CSV Import & PDF Analyzer

---

## 1. Overview
This feature enables users to upload CSV files for real-time processing and validation, with live progress updates and error feedback. It also includes a PDF analyzer that allows users to upload PDF documents and ask questions about their content using AI.

---

## 2. Technical Implementation Details

### CSV Import Pipeline
- **Upload**: Users upload CSV files via a drag-and-drop UI (UploadThing)
- **Storage**: Files are stored securely and referenced by a unique ID
- **Trigger.dev Job**: On upload, a Trigger.dev job is started to process the CSV in batches
- **Validation**: Each row is validated using Zod schemas; errors are collected and reported
- **Progress Updates**: Real-time progress is sent to the UI via Trigger.dev events
- **Completion**: On success, the processed data is made available for further use (e.g., enrichment, visualization)

### PDF Analyzer
- **Upload**: Users upload a PDF file and submit a question
- **Processing**: The server action reads the PDF, extracts text, and sends it to OpenAI with the user's question
- **Response**: The AI's answer is returned and rendered in the UI with markdown formatting
- **Rate Limiting**: API usage is rate-limited to prevent abuse

---

## 3. Requirements
- **File Size Limits**: CSV (max 4MB), PDF (max 1MB)
- **Validation**: Use Zod for schema validation
- **Real-time Feedback**: UI must update in real time as jobs progress
- **Error Handling**: All errors must be surfaced to the user with actionable messages
- **Security**: Validate and sanitize all user inputs; restrict file types and sizes
- **Extensibility**: Codebase must be modular to allow new pipelines (e.g., JSON, Excel) in the future

---

## 4. Checkpoints & Milestones
- [x] CSV upload UI
- [x] Trigger.dev job for CSV processing
- [x] Real-time progress hook
- [ ] Error handling improvements
- [ ] Enhanced CSV validation
- [ ] Data visualization for processed CSVs
- [ ] UI/UX enhancements
- [ ] PDF analyzer feature
- [ ] Documentation and tests

---

## 5. Documentation & Requirements
- All business logic must be documented in `docs/` or as code comments
- Each ticket must reference relevant code and documentation
- Follow [technical-design-template.mdc](../.cursor/rules/technical-design-template.mdc) for new features

---

## 6. Acceptance Criteria
- Users can upload CSV and PDF files within size limits
- CSVs are processed in real time with progress updates
- Errors are clearly surfaced in the UI
- PDF analyzer returns AI-generated answers to user questions
- All code is type-safe and validated
- Documentation is complete and up to date