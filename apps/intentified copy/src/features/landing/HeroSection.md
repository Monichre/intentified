# Hero Section Architecture & Animated Visuals Integration

## Overview
The Hero section now includes two animated components—CloudSyncing and DataFeedingIn—positioned between the CTA buttons and the stats bar. This enhances visual storytelling and communicates the platform's real-time data and sync capabilities.

## Key Modules
- `CloudSyncing`: Animated cloud sync/status visual, communicates real-time data sync.
- `DataFeedingIn`: Animated SVG data flow visual, represents data ingestion/processing.
- `Hero`: Main section, composes headline, CTAs, animated visuals, stats, and trusted by section.

## Data Flow
- No props are passed between CloudSyncing/DataFeedingIn and Hero; both are self-contained animated visuals.
- The Hero section composes these as children in a responsive flex container.

## Placement
- The animated visuals are placed in a flex container (`flex-col md:flex-row gap-8 mt-12 mb-8`) between the CTA buttons and the stats bar.
- On mobile, visuals stack vertically; on desktop, they appear side by side.

## Accessibility & Responsiveness
- Both components are wrapped in `flex-1 flex justify-center` to ensure balance and centering.
- The layout is fully responsive and visually balanced across breakpoints.

## Next Steps
- Further enhance with entrance animations or intersection observer triggers if desired.
- Monitor for layout overflow or performance issues as more content is added. 