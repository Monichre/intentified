# CompetitorAnalysisFlow Refactor Pseudocode

## 1. State Management
- isAnalyzing: boolean (true while analysis is running)
- analysisResult: CompetitorAnalysisResponse | null (stores the result)
- error: string | null (stores error message)

## 2. On Form Complete
- Set isAnalyzing = true
- Reset error and analysisResult
- Call startStream with form data (website, companyName, industry)
- Await result
  - On success: set analysisResult, set isAnalyzing = false
  - On error: set error, set isAnalyzing = false

## 3. UI Rendering
- If isAnalyzing: show loading spinner and message
- If error: show error screen with retry button
- If analysisResult: show result screen, mapping fields from analysisResult (company, summary, competitors, strengths, etc.)
- Else: show MultiStepForm

## 4. Result Screen
- Display company name, summary, positioning, direct competitors, strengths, opportunities, differentiators, recommendations, key takeaways, total analyzed
- Button to run another analysis (resets analysisResult)

## 5. Error Screen
- Display error message
- Button to retry (resets error)

## 6. Hook Usage
- useCompetitorAnalysisStream should call the correct analysis service and return the full CompetitorAnalysisResponse
- Only call onComplete after analysisResult is available 