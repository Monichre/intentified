# CompetitorAnalysisFlow Implementation Documentation

## Overview
`CompetitorAnalysisFlow` is a React component that orchestrates a multi-step competitor analysis form, streams the analysis process using the `useCompetitorAnalysisStream` hook, and displays the result or error to the user. It ensures the analysis is fully completed before showing the result screen, preventing blank or incomplete submissions.

## Key Modules
- **MultiStepForm**: Handles the step-by-step form UI and collects user input.
- **useCompetitorAnalysisStream**: Custom hook that triggers the competitor analysis service and streams progress/results.
- **CompetitorAnalysisResponse**: Type describing the structure of the analysis result.

## Data Flow
1. **User completes the form** in `MultiStepForm`.
2. **onComplete** handler triggers `startStream` from `useCompetitorAnalysisStream` with form data (website, companyName, industry).
3. **startStream** calls the backend analysis service (from `@/ai/services/enrichment/enrichment.service.ts`) and streams progress.
4. **On success**: The full `CompetitorAnalysisResponse` is set in state and passed to the result screen.
5. **On error**: The error message is set in state and shown to the user.
6. **Result screen**: Maps all relevant fields from the analysis result to the UI.

## State Management
- `isAnalyzing`: Boolean, true while analysis is running.
- `analysisResult`: Stores the analysis result object.
- `error`: Stores any error message from the analysis process.

## UI Flow
- **Initial**: Shows the multi-step form.
- **Analyzing**: Shows a loading spinner and message.
- **Result**: Shows a detailed result screen with company, summary, competitors, strengths, opportunities, differentiators, recommendations, key takeaways, and total analyzed.
- **Error**: Shows an error message and a retry button.

## Error Handling
- All errors from the analysis process are caught and displayed to the user.
- The user can retry the analysis if an error occurs.

## Extensibility
- The result screen can be extended to show more details or visualizations from `CompetitorAnalysisResponse`.
- The form steps and initial data can be customized via `COMPETITOR_ANALYSIS_STEPS` and `initialData`.

## Example Data Mapping
- **Company Name**: `analysisResult.company.name`
- **Summary**: `analysisResult.company.summary`
- **Positioning**: `analysisResult.company.positioning`
- **Direct Competitors**: `analysisResult.competitiveLandscape.directCompetitors[]`
- **Strengths**: `analysisResult.competitiveLandscape.strengths[]`
- **Opportunities**: `analysisResult.competitiveLandscape.opportunities[]`
- **Differentiators**: `analysisResult.insights.differentiators[]`
- **Recommendations**: `analysisResult.insights.recommendations[]`
- **Key Takeaways**: `analysisResult.insights.keyTakeaways[]`
- **Total Analyzed**: `analysisResult.summary.totalAnalyzed`

## Usage
- Import and use `<CompetitorAnalysisFlow onComplete={...} />` in a modal or page.
- The parent can use the `onComplete` callback to handle the result (e.g., close modal, show next step, etc.).

---
This implementation ensures the user always sees a complete, accurate result and never a blank or partial submission. 