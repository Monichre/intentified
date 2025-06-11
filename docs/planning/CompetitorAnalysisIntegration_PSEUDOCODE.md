# Competitor Analysis Integration - PSEUDOCODE

## Overview
This document outlines the pseudocode for integrating the competitor analysis feature with the enrichment service.

## Server Action: streamCompetitorAnalysis

```pseudocode
FUNCTION streamCompetitorAnalysis(request: CompetitorAnalysisRequest)
    // Initialize streaming infrastructure
    CREATE encoder = TextEncoder
    CREATE stream = TransformStream
    CREATE writer = stream.writable.getWriter()
    
    // Create service instance
    CREATE enrichmentService = makeCompanyEnrichmentService()
    
    // Start async processing
    ASYNC FUNCTION processAnalysis()
        TRY
            // Call enrichment service with progress callback
            result = AWAIT enrichmentService.analyzeCompetitiveLandscape(
                request,
                ASYNC FUNCTION onProgress(progress)
                    // Stream progress update
                    data = JSON.stringify({
                        type: "progress",
                        data: progress
                    })
                    AWAIT writer.write(encoder.encode("data: " + data + "\n\n"))
                END FUNCTION
            )
            
            // Stream final result
            resultData = JSON.stringify({
                type: "result",
                data: result
            })
            AWAIT writer.write(encoder.encode("data: " + resultData + "\n\n"))
            
            // Close stream
            AWAIT writer.close()
            
        CATCH error
            // Stream error
            errorData = JSON.stringify({
                type: "error",
                error: error.message OR "Unknown error"
            })
            AWAIT writer.write(encoder.encode("data: " + errorData + "\n\n"))
            AWAIT writer.close()
        END TRY
    END FUNCTION
    
    // Execute async processing
    processAnalysis()
    
    // Return SSE response
    RETURN Response(stream.readable, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        }
    })
END FUNCTION
```

## React Hook: useCompetitorAnalysisStream

```pseudocode
FUNCTION useCompetitorAnalysisStream()
    // Initialize state
    CREATE state = {
        status: "idle",
        progress: null,
        result: null,
        error: null,
        messages: []
    }
    
    CREATE abortController = null
    
    FUNCTION connect(options: CompetitorAnalysisStreamOptions)
        // Cancel existing stream if any
        IF abortController EXISTS
            abortController.abort()
        END IF
        
        // Create new abort controller
        abortController = new AbortController()
        
        // Reset state
        SET state = {
            status: "connecting",
            progress: null,
            result: null,
            error: null,
            messages: []
        }
        
        TRY
            // Start server action
            response = AWAIT streamCompetitorAnalysis(options)
            
            IF NOT response.ok
                THROW Error("HTTP error: " + response.status)
            END IF
            
            SET state.status = "connected"
            
            // Get reader
            reader = response.body.getReader()
            decoder = new TextDecoder()
            buffer = ""
            
            // Read stream
            WHILE true
                {done, value} = AWAIT reader.read()
                
                IF done THEN BREAK
                
                IF abortController.signal.aborted
                    reader.cancel()
                    BREAK
                END IF
                
                // Decode and buffer
                buffer += decoder.decode(value, {stream: true})
                
                // Process complete lines
                lines = buffer.split('\n')
                buffer = lines.pop() // Keep incomplete line
                
                FOR EACH line IN lines
                    IF line.startsWith('data: ')
                        data = line.slice(6)
                        IF data.trim() NOT EMPTY
                            TRY
                                parsed = JSON.parse(data)
                                timestamp = new Date().toISOString()
                                
                                SWITCH parsed.type
                                    CASE 'progress':
                                        UPDATE state with progress
                                        ADD message to state.messages
                                        CALL options.onProgress(parsed.data)
                                        
                                    CASE 'result':
                                        UPDATE state with result
                                        SET state.status = "completed"
                                        ADD message to state.messages
                                        CALL options.onComplete(parsed.data)
                                        
                                    CASE 'error':
                                        UPDATE state with error
                                        SET state.status = "error"
                                        ADD message to state.messages
                                        CALL options.onError(parsed.error)
                                END SWITCH
                            CATCH parseError
                                LOG "Failed to parse SSE data"
                            END TRY
                        END IF
                    END IF
                END FOR
            END WHILE
            
            // Ensure completed status
            IF state.status IN ["processing", "connected"]
                SET state.status = "completed"
            END IF
            
        CATCH error
            LOG "Stream error: " + error
            SET state.status = "error"
            SET state.error = error.message
            CALL options.onError(error.message)
        END TRY
    END FUNCTION
    
    FUNCTION disconnect()
        IF abortController EXISTS
            abortController.abort()
            abortController = null
        END IF
        SET state.status = "disconnected"
    END FUNCTION
    
    // Cleanup on unmount
    ON COMPONENT UNMOUNT
        CALL disconnect()
    END ON
    
    RETURN {
        state: state,
        connect: connect,
        disconnect: disconnect,
        isConnected: state.status IN ["connected", "processing"],
        isProcessing: state.status == "processing",
        isCompleted: state.status == "completed",
        hasError: state.status == "error"
    }
END FUNCTION
```

## UI Component: CompetitorAnalysisFlow

```pseudocode
FUNCTION CompetitorAnalysisFlow(props)
    // Initialize state
    CREATE isAnalyzing = false
    CREATE analysisResult = null
    CREATE error = null
    
    // Get hook instance
    {connect, state} = useCompetitorAnalysisStream()
    
    FUNCTION handleComplete(formData)
        SET isAnalyzing = true
        SET error = null
        SET analysisResult = null
        
        TRY
            // Connect to stream with callbacks
            AWAIT connect({
                websiteUrl: formData.website,
                companyName: formData.companyName,
                industry: formData.industry,
                focusAreas: formData.focusAreas,
                skipScreenshot: false,
                
                onProgress: FUNCTION(progress)
                    LOG "Analysis progress: " + progress
                END FUNCTION,
                
                onComplete: FUNCTION(response)
                    SET isAnalyzing = false
                    SET analysisResult = response
                    CALL props.onComplete(response)
                END FUNCTION,
                
                onError: FUNCTION(err)
                    SET isAnalyzing = false
                    SET error = err OR "Analysis failed"
                END FUNCTION
            })
        CATCH err
            SET isAnalyzing = false
            SET error = err.message OR "Analysis failed"
        END TRY
    END FUNCTION
    
    FUNCTION renderResultScreen()
        IF NOT analysisResult THEN RETURN null
        
        RETURN JSX(
            <div>
                <h2>Analysis Complete!</h2>
                <div>
                    DISPLAY analysisResult.company
                    DISPLAY analysisResult.competitiveLandscape
                    DISPLAY analysisResult.insights
                    DISPLAY analysisResult.summary
                </div>
                <button onClick={() => SET analysisResult = null}>
                    Run Another Analysis
                </button>
            </div>
        )
    END FUNCTION
    
    FUNCTION renderErrorScreen()
        RETURN JSX(
            <div>
                <h2>Analysis Failed</h2>
                <p>{error}</p>
                <button onClick={() => SET error = null}>
                    Try Again
                </button>
            </div>
        )
    END FUNCTION
    
    // Main render logic
    IF isAnalyzing
        RETURN JSX(<LoadingSpinner message="Analyzing competitor landscape..." />)
    ELSE IF error
        RETURN renderErrorScreen()
    ELSE IF analysisResult
        RETURN renderResultScreen()
    ELSE
        RETURN JSX(
            <MultiStepForm
                steps={COMPETITOR_ANALYSIS_STEPS}
                mode="competitor-analysis"
                onComplete={handleComplete}
                theme={props.theme}
                initialData={DEFAULT_FORM_DATA}
                welcomeScreen={WELCOME_CONFIG}
            />
        )
    END IF
END FUNCTION
```

## Enrichment Service: analyzeCompetitiveLandscape

```pseudocode
FUNCTION analyzeCompetitiveLandscape(request, onProgress)
    // Initialize tracking
    startTime = NOW()
    requestId = "competitor-analysis-" + timestamp
    
    ANALYSIS_TYPES = [
        'basic-info',
        'company-summary', 
        'competitors',
        'mind-map',
        'news',
        'website-sub-pages'
    ]
    
    completedSteps = []
    
    FUNCTION reportProgress(message, currentType)
        IF onProgress EXISTS
            CALL onProgress({
                requestId: requestId,
                currentStep: completedSteps.length,
                totalSteps: ANALYSIS_TYPES.length,
                currentType: currentType,
                message: message,
                isComplete: completedSteps.length == ANALYSIS_TYPES.length
            })
        END IF
    END FUNCTION
    
    TRY
        // Step 1: Website Analysis
        reportProgress("Analyzing company website...", "basic-info")
        [mainContent, subPages] = AWAIT PARALLEL(
            scrapeWebsiteUrl(request),
            scrapeWebsiteSubPages(request)
        )
        ADD ['basic-info', 'website-sub-pages'] TO completedSteps
        
        // Step 2: Company Summary
        reportProgress("Understanding company positioning...", "company-summary")
        screenshot = IF NOT request.skipScreenshot 
            THEN AWAIT captureScreenshot(request.websiteUrl)
            ELSE undefined
        
        companySummary = AWAIT generateSummary({
            mainpage: mainContent,
            subpages: subPages,
            websiteUrl: request.websiteUrl
        })
        ADD 'company-summary' TO completedSteps
        
        // Step 3: Find Competitors
        reportProgress("Identifying competitors...", "competitors")
        competitorsData = AWAIT findCompetitors({
            websiteUrl: request.websiteUrl,
            summaryText: companySummary.sections.join(' ')
        })
        ADD 'competitors' TO completedSteps
        
        // Step 4: Market Intelligence
        reportProgress("Gathering market intelligence...", "news")
        newsData = AWAIT findNews(request)
        ADD 'news' TO completedSteps
        
        // Step 5: Mind Map
        reportProgress("Analyzing competitive positioning...", "mind-map")
        mindMapData = AWAIT generateMindMap({
            companySummary: companySummary,
            mainpage: mainContent,
            websiteUrl: request.websiteUrl,
            subpages: subPages,
            competitors: competitorsData
        })
        ADD 'mind-map' TO completedSteps
        
        // Process results
        competitiveLandscape = processCompetitorData(competitorsData, companySummary)
        marketInsights = generateMarketInsights(
            companySummary,
            competitorsData,
            newsData,
            mindMapData
        )
        
        reportProgress("Analysis complete!")
        
        // Return structured response
        RETURN {
            websiteUrl: request.websiteUrl,
            requestId: requestId,
            company: {
                name: request.companyName OR extractCompanyName(companySummary),
                summary: companySummary.overview,
                positioning: companySummary.marketPosition,
                screenshot: screenshot
            },
            competitiveLandscape: competitiveLandscape,
            insights: marketInsights,
            summary: {
                totalAnalyzed: ANALYSIS_TYPES.length,
                successful: completedSteps.length,
                failed: ANALYSIS_TYPES.length - completedSteps.length,
                totalDuration: NOW() - startTime
            }
        }
        
    CATCH error
        LOG "Competitor analysis error: " + error
        THROW error
    END TRY
END FUNCTION
```

## Key Design Decisions

1. **Streaming Architecture**: Uses Server-Sent Events (SSE) for real-time progress updates
2. **Abort Control**: Implements proper cleanup with AbortController
3. **Error Boundaries**: Each layer handles errors gracefully
4. **State Management**: Clear state transitions for UI feedback
5. **Progress Granularity**: Balanced updates without overwhelming the client
6. **Type Safety**: Consistent types across all layers
7. **Modular Design**: Each component has a single responsibility 