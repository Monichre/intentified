# AnimatedUnderline Component - Pseudocode

## Component Logic Flow

```
COMPONENT AnimatedUnderline(children, className, delay, duration):
    // Initialize component state
    CREATE isHovered = useState(false)
    
    // Event handlers
    FUNCTION handleMouseEnter():
        SET isHovered = true
    
    FUNCTION handleMouseLeave():
        SET isHovered = false
    
    // Render structure
    RETURN:
        <span 
            className={relative + cursor-pointer + className}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            
            <motion.span className={underline-styles}>
                ANIMATION_PROPS:
                    initial: { scaleX: 0 }  // Start with no underline
                    animate: { 
                        scaleX: isHovered ? 1 : 0  // Scale based on hover state
                    }
                    transition: {
                        duration: duration (default: 0.3s),
                        delay: delay (default: 0s),
                        ease: [0.25, 0.46, 0.45, 0.94]  // Custom easing curve
                    }
            </motion.span>
        </span>
```

## Animation Sequence

```
1. INITIAL STATE:
   - Underline is scaled to 0 (invisible)
   - Component is waiting for hover event
   - Cursor shows as pointer

2. HOVER DETECTION:
   - On mouse enter:
     - Set isHovered = true
     - Trigger animation to scale underline

3. ANIMATION EXECUTION:
   - Wait for delay (if specified)
   - Scale underline from 0 to 1 over duration
   - Use easing curve for smooth animation
   - Transform originates from left side

4. MOUSE LEAVE:
   - Set isHovered = false
   - Reverse animation (scale from 1 to 0)
   - Same duration and easing applied
```

## Integration Example

```
// In Hero component
IMPORT AnimatedUnderline from "@/components/ui/animated-underline"

RENDER:
    <AnimatedUnderline 
        delay={0}        // No delay for immediate response
        duration={0.3}   // Quick 0.3s animation
    >
        <TrueFocus 
            sentence="The Competition Just Became Your Lead Gen"
            activeIndices={[0, 1, 3, 3, 6]}
        />
    </AnimatedUnderline>
```

## Key Implementation Details

```
HOVER_CONFIG:
    - Events: onMouseEnter, onMouseLeave
    - Cursor: pointer (indicates interactivity)
    - State: boolean (isHovered)

ANIMATION_CONFIG:
    - Transform: scaleX (horizontal scaling)
    - Origin: left (grows from left to right)
    - Easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)
    - Default duration: 0.3s (faster for hover interactions)
    - GPU-accelerated for performance

STYLING:
    - Height: 2px
    - Color: theme primary color
    - Position: absolute bottom
    - Width: 100% of parent
    - Cursor: pointer

MOBILE_BEHAVIOR:
    - Touch triggers hover on tap
    - Consider implementing touch-specific behavior
    - May need focus states for accessibility
``` 