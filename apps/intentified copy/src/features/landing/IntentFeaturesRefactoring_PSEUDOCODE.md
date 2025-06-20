# Intent Features Refactoring - PSEUDOCODE

## Overview
Refactor the Features component by extracting content into a dedicated IntentFeaturesSection component to resolve duplicate imports and improve code organization.

## Pseudocode

### Step 1: Analyze Current State
```
ANALYZE features.tsx file:
  - IDENTIFY duplicate imports (Activity, Zap, Image)
  - IDENTIFY two different feature components in same file
  - IDENTIFY utility components (Map, MonitoringChart)
  - IDENTIFY main Features function content (lines 20-132)
```

### Step 2: Extract New Component
```
CREATE new file intent-features-section.tsx:
  - IMPORT necessary dependencies without duplicates
  - EXTRACT Map component with DottedMap visualization
  - EXTRACT MonitoringChart component with AreaChart
  - EXTRACT chartConfig and chartData constants
  - CREATE IntentFeaturesSection component with:
    - Real-time location tracking section
    - Email/web support section  
    - 99.99% uptime banner
    - Activity monitoring section
  - EXPORT IntentFeaturesSection as named export
```

### Step 3: Clean Up Original File
```
MODIFY features.tsx:
  - REMOVE duplicate imports
  - REMOVE old Features function
  - REMOVE utility components (Map, MonitoringChart)
  - IMPORT IntentFeaturesSection from new file
  - CREATE alias: Features = IntentFeaturesSection (backward compatibility)
  - KEEP existing FeaturesSection component unchanged
```

### Step 4: Maintain Backward Compatibility
```
EXPORT strategy:
  - EXPORT Features as alias to IntentFeaturesSection
  - MAINTAIN existing import structure in landing page
  - PRESERVE FeaturesSection as separate component
```

## Component Structure

### IntentFeaturesSection Component
```
IntentFeaturesSection:
  - SECTION with grid layout (max-w-5xl)
  - LEFT COLUMN:
    - Location tracking header with MapIcon
    - Intent signals description
    - Feature list with icons (Target, TrendingUp, Zap)
    - Interactive map visualization with overlays
  - RIGHT COLUMN:
    - Email/web support header with MessageCircle
    - Support description
    - Chat conversation mockup
  - FULL WIDTH:
    - Uptime banner (99.99%)
    - Activity monitoring with chart
```

### Utility Components
```
Map Component:
  - INITIALIZE DottedMap with diagonal grid
  - RENDER SVG with dynamic viewBox
  - MAP points to circles with configurable styling

MonitoringChart Component:
  - CONFIGURE chart with desktop/mobile data
  - RENDER AreaChart with gradient fills
  - INCLUDE tooltips and CartesianGrid
```

## Benefits
- ✅ Resolves duplicate import errors
- ✅ Improves code organization and modularity
- ✅ Maintains backward compatibility
- ✅ Separates concerns (intent features vs general features)
- ✅ Enables easier testing and maintenance 