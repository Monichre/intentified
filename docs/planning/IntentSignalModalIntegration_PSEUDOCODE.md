# Intent Signal Modal Integration - Pseudocode

## Component State Management

```
IntentifiedSignalSourcingPipeline:
  STATE:
    isModalOpen: boolean = false
  
  HANDLERS:
    handleStartTracking():
      SET isModalOpen = true
    
    handleAnalysisComplete(analysis):
      LOG analysis results
      WAIT 1000ms
      SET isModalOpen = false
    
    handleCloseModal():
      SET isModalOpen = false
```

## Modal Rendering Logic

```
RENDER:
  // Main pipeline content
  RENDER pipeline UI
  
  // CTA Button
  RENDER button with onClick = handleStartTracking
  
  // Modal with animation
  IF isModalOpen:
    RENDER AnimatePresence:
      RENDER motion.div with:
        initial: opacity = 0
        animate: opacity = 1
        exit: opacity = 0
        className: fixed fullscreen with z-100
        
        // Close button
        RENDER button:
          position: absolute top-right
          onClick: handleCloseModal
          icon: X
          styling: semi-transparent with hover
        
        // Competitor Analysis Flow
        RENDER CompetitorAnalysisFlow:
          onComplete: handleAnalysisComplete
          className: full width and height
```

## Animation Sequence

```
MODAL OPEN:
  1. User clicks "Start Tracking Intent Signals"
  2. isModalOpen = true triggers AnimatePresence
  3. Modal fades in (opacity 0 → 1)
  4. CompetitorAnalysisFlow mounts and starts

MODAL CLOSE:
  1. Analysis completes OR user clicks close
  2. isModalOpen = false
  3. AnimatePresence triggers exit animation
  4. Modal fades out (opacity 1 → 0)
  5. Component unmounts
```

## Event Flow

```
USER INTERACTION FLOW:
  1. CLICK "Start Tracking Intent Signals"
     → handleStartTracking()
     → isModalOpen = true
     
  2. MODAL OPENS
     → AnimatePresence renders modal
     → CompetitorAnalysisFlow initializes
     
  3. USER COMPLETES FORM
     → CompetitorAnalysisFlow.onComplete()
     → handleAnalysisComplete(analysis)
     → Process results
     → Close modal after delay
     
  4. ALTERNATIVE: USER CLICKS CLOSE
     → handleCloseModal()
     → isModalOpen = false
     → Modal exits with animation
```

## Error Handling

```
ERROR SCENARIOS:
  1. Analysis fails:
     IF error in CompetitorAnalysisFlow:
       LOG error
       SHOW error message
       KEEP modal open for retry
  
  2. Network issues:
     IF network error:
       DISPLAY retry option
       HANDLE gracefully without closing
  
  3. User cancellation:
     IF user closes during analysis:
       CANCEL ongoing requests
       CLEAN UP resources
       CLOSE modal
```

## Accessibility Implementation

```
ACCESSIBILITY:
  1. Focus Management:
     ON modal open:
       STORE previous focus element
       FOCUS first interactive element in modal
     
     ON modal close:
       RESTORE focus to previous element
  
  2. Keyboard Navigation:
     ON Escape key:
       CALL handleCloseModal()
     
     TAB navigation:
       TRAP focus within modal
  
  3. Screen Reader:
     ADD role="dialog"
     ADD aria-modal="true"
     ADD aria-label="Competitor Analysis"
```

## Performance Optimizations

```
OPTIMIZATIONS:
  1. Lazy Loading:
     IMPORT CompetitorAnalysisFlow dynamically
     ONLY when modal opens
  
  2. Animation Performance:
     USE GPU-accelerated properties
     AVOID layout thrashing
     USE will-change for animations
  
  3. Memory Management:
     CLEANUP event listeners on unmount
     CANCEL pending requests
     CLEAR timeouts/intervals
``` 