# Typography Font Weights Cleanup - PSEUDOCODE

## Problem Analysis

From the grep search results, I identified these font weight inconsistencies:

### Hero Component Issues:
- `font-bold` vs `font-regular` on main headings (inconsistent hierarchy)
- `font-medium` used for descriptive text
- `font-semibold` for buttons and highlights
- `font-bold` for stats

### Inconsistent Font Weight Usage:
```
H1 Main: font-bold (28px headline)
H1 Secondary: font-regular (43px - this should be lighter, not regular)
Badge text: font-medium 
Button text: font-semibold
Body text: font-medium
Highlight spans: font-semibold  
Stats: font-bold
```

## Typography Hierarchy Strategy

### 1. Define Font Weight Scale
```
font-thin (100)     - Reserved for extra-light decorative text
font-light (300)    - Secondary headlines, subtle text
font-normal (400)   - Body text, paragraphs
font-medium (500)   - Emphasized body text, badges
font-semibold (600) - Subheadings, CTAs, important highlights
font-bold (700)     - Main headlines, primary emphasis
font-extrabold (800)- Hero titles, primary brand elements
font-black (900)    - Display text, maximum emphasis
```

### 2. Semantic Font Weight Mapping
```
DISPLAY TEXT (Hero main): font-extrabold (800)
PRIMARY HEADLINES: font-bold (700)  
SECONDARY HEADLINES: font-semibold (600)
SUBHEADINGS: font-medium (500)
BODY TEXT: font-normal (400)
SECONDARY TEXT: font-light (300)
BUTTONS/CTAS: font-semibold (600)
BADGES/LABELS: font-medium (500)
STATS/METRICS: font-bold (700)
EMPHASIS SPANS: font-semibold (600)
```

### 3. Component-Specific Fixes

#### Hero Component:
```
BEFORE:
- H1 main: font-bold (inconsistent with secondary)
- H1 secondary: font-regular (should be lighter than main)
- Body text: font-medium (too heavy for body)
- Highlights: font-semibold (good)
- Buttons: font-semibold (good)
- Stats: font-bold (good)

AFTER:
- H1 main "INTENTIFIED": font-extrabold (dominant display)
- H1 secondary tagline: font-light (elegant contrast)  
- Body paragraph: font-normal (readable)
- Highlights: font-semibold (emphasis)
- Buttons: font-semibold (action-oriented)
- Stats: font-bold (authority)
```

#### Other Landing Components:
```
STANDARDIZE across all landing sections:
- Section headlines: font-bold
- Feature headlines: font-semibold  
- Feature descriptions: font-normal
- CTAs: font-semibold
- Captions/labels: font-medium
```

### 4. Implementation Approach

```
CREATE typography utility classes:
- .text-display: font-extrabold + proper line-height
- .text-headline: font-bold + proper line-height
- .text-subheading: font-semibold + proper line-height
- .text-body: font-normal + optimal line-height
- .text-caption: font-medium + tight line-height
- .text-button: font-semibold + tracking
- .text-accent: font-light + refined styling
```

### 5. Responsive Font Weight Considerations

```
MOBILE (text is smaller):
- Slightly increase font weights for readability
- font-normal -> font-medium for small body text
- font-light -> font-normal for small secondary text

DESKTOP (text is larger):
- Can use lighter weights effectively
- font-extrabold for large hero text
- font-light for large secondary text
```

## Implementation Steps

1. **Create typography utility classes with semantic names**
2. **Update Hero component with proper font weight hierarchy** 
3. **Standardize all landing section components**
4. **Test responsive behavior across breakpoints**
5. **Validate accessibility and readability**
6. **Document the new typography system**

## Success Metrics

- Clear visual hierarchy from display to body text
- Consistent font weights across similar content types
- Improved readability and scan-ability
- Professional, cohesive brand appearance
- Maintained accessibility standards 