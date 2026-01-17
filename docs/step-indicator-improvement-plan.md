# SmartStepIndicator Improvement Plan

## Current Problem Analysis

### Visual Issue
The step indicator shows a **stray line segment** extending to the left of the first step circle ("Dados Básicos"). This happens because:

1. **Line positioning mismatch**: The progress line uses `left-[20px]` (half of the 40px circle width) assuming circles are at exact 0% and 100% positions
2. **`justify-between` behavior**: With variable-width text labels, the actual flex items (which contain both circle AND label) distribute based on their content width, not the circle centers
3. **Text width influence**: "Dados Básicos" is wider than "Endereço" or "Comissão", causing the first flex item to be wider, pushing its circle inward from the container edge

### Current Architecture Issues
```
Container
├── Line container (absolute, left-[20px], right-[20px])
│   ├── Background line (gray)
│   └── Progress line (blue, width based on %)
└── Flex container (justify-between)
    └── Step items (flex-col, items-center)
        ├── Circle button (w-10 = 40px)
        └── Label text (variable width)
```

The fundamental flaw: **line endpoints are hardcoded** while **circle positions are dynamic**.

---

## Proposed Solution: Circle-Anchored Lines

### Strategy
Instead of a single continuous line with hardcoded offsets, use **segment-based lines between circles** where each segment connects two adjacent circles. This guarantees perfect alignment regardless of label widths.

### New Architecture
```
Container (flex, justify-between)
└── Step items (relative, flex-1 except last)
    ├── Circle (centered in item)
    ├── Label (below circle, text-center)
    └── Line segment (absolute, from circle center to next circle center)
        └── Only rendered if not last step
```

---

## Implementation Plan

### Phase 1: Restructure HTML/CSS Layout

#### Option A: Segment-Based Lines (Recommended)
Each step item owns the line segment that connects it to the NEXT step.

```tsx
<div className="flex w-full">
  {steps.map((step, index) => (
    <div 
      key={step}
      className={cn(
        "relative flex flex-col items-center",
        index < totalSteps - 1 ? "flex-1" : "" // Last item doesn't expand
      )}
    >
      {/* Line to next step - only if not last */}
      {index < totalSteps - 1 && (
        <div className="absolute top-5 left-1/2 right-0 -translate-x-0 h-0.5">
          {/* Background line */}
          <div className="absolute inset-0 bg-gray-200" />
          {/* Progress line */}
          {index < currentStep - 1 && (
            <div className="absolute inset-0 bg-blue-500" />
          )}
        </div>
      )}
      
      {/* Circle */}
      <button className="relative z-10 w-10 h-10 rounded-full ...">
        {step}
      </button>
      
      {/* Label */}
      <span className="mt-2 text-sm whitespace-nowrap">
        {stepTitles[index]}
      </span>
    </div>
  ))}
</div>
```

**Key insight**: Using `flex-1` on all items except the last ensures equal spacing between circles. The line starts at `left-1/2` (center of current item) and extends to `right-0` (edge of item, which is the center of the next circle).

#### Option B: Pseudo-Elements Approach
Use CSS `::before` or `::after` pseudo-elements for lines. Less flexible but cleaner JSX.

#### Option C: SVG-Based Lines
Calculate exact positions and render SVG lines. Most precise but requires JavaScript measurements.

**Recommendation**: Option A provides the best balance of simplicity, flexibility, and pixel-perfect alignment.

---

### Phase 2: Handle Edge Cases

#### 2.1 Variable Number of Steps
- **2 steps**: First has `flex-1`, second has no flex
- **3+ steps**: All except last have `flex-1`
- **1 step**: No lines rendered

#### 2.2 Long Labels
- Add `max-w-[120px]` or similar to prevent labels from becoming too wide
- Use `truncate` or `line-clamp-2` for overflow
- Consider tooltip on hover for truncated text

#### 2.3 Responsive Behavior
- **Desktop**: Full horizontal layout with labels below
- **Mobile**: Consider vertical layout or icons-only mode
- Add prop: `variant?: 'horizontal' | 'vertical' | 'compact'`

#### 2.4 RTL Support
- Use logical properties (`start`/`end` instead of `left`/`right`)
- Test with `dir="rtl"` attribute

---

### Phase 3: Enhanced Features

#### 3.1 New Props Interface
```typescript
export interface SmartStepIndicatorProps {
  // Required
  currentStep: number
  steps: StepConfig[] // Changed from separate arrays
  
  // Navigation
  onStepClick?: (step: number) => void
  canAccessStep?: (step: number) => boolean
  
  // Appearance
  variant?: 'horizontal' | 'vertical' | 'compact'
  size?: 'sm' | 'md' | 'lg'
  colorScheme?: 'blue' | 'green' | 'purple' | string // Or custom colors
  
  // Behavior
  showLabels?: boolean
  showStepNumbers?: boolean
  animated?: boolean
  
  // Styling
  className?: string
  classNames?: {
    root?: string
    step?: string
    circle?: string
    label?: string
    line?: string
    lineProgress?: string
  }
}

interface StepConfig {
  title: string
  description?: string
  icon?: React.ReactNode
}
```

#### 3.2 Animation Improvements
- Smooth line fill animation when progressing
- Circle scale animation on step change
- Consider using CSS transitions or Framer Motion

#### 3.3 Accessibility
- Proper `aria-current="step"` on active step
- `aria-label` for screen readers
- Keyboard navigation (arrow keys)
- Focus visible states
- Role="progressbar" or role="tablist" semantics

---

### Phase 4: Backward Compatibility

#### 4.1 Deprecation Strategy
```typescript
// Support old props with deprecation warning
export interface SmartStepIndicatorProps {
  // New way (preferred)
  steps?: StepConfig[]
  
  // Old way (deprecated)
  /** @deprecated Use `steps` array instead */
  totalSteps?: number
  /** @deprecated Use `steps` array instead */
  stepTitles?: string[]
}

// In component
if (stepTitles && !steps) {
  console.warn('SmartStepIndicator: stepTitles is deprecated. Use steps array instead.')
  // Convert to new format internally
}
```

#### 4.2 Migration Path
1. Release with both APIs supported
2. Document migration in CHANGELOG
3. Remove deprecated props in next major version

---

## Detailed CSS Solution

### The Core Fix (Minimal Change)
If you want the **quickest fix** without restructuring:

```tsx
// Change from this:
<div className="relative flex justify-between">

// To this (equal-width columns):
<div className="relative grid" style={{ gridTemplateColumns: `repeat(${totalSteps}, 1fr)` }}>
  {/* Each step item */}
  <div className="flex flex-col items-center">
```

With CSS Grid and equal `1fr` columns, each step occupies exactly the same width, and `items-center` places the circle at the exact center of each column. The line offsets `left-[20px]` and `right-[20px]` will now work correctly because:
- First circle center = `(100% / totalSteps) / 2` = center of first column
- With equal columns, this equals `20px` from left edge when circles are 40px wide

**However**, this only works if the container width is such that `columnWidth / 2 = 20px`. For a truly robust solution, use the segment-based approach.

---

## Recommended Implementation Order

1. **Quick fix (5 min)**: Switch to CSS Grid with equal columns - fixes the visual bug immediately
2. **Proper fix (30 min)**: Implement segment-based lines for guaranteed alignment
3. **Enhancement (1-2 hours)**: Add new props, variants, and accessibility
4. **Polish (1 hour)**: Add animations, responsive variants, documentation

---

## Code Example: Final Implementation

```tsx
import React from 'react'

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export interface StepConfig {
  title: string
  description?: string
  icon?: React.ReactNode
}

export interface SmartStepIndicatorProps {
  currentStep: number
  steps: StepConfig[]
  onStepClick?: (step: number) => void
  canAccessStep?: (step: number) => boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeConfig = {
  sm: { circle: 'w-8 h-8 text-xs', line: 'top-4', label: 'text-xs mt-1' },
  md: { circle: 'w-10 h-10 text-sm', line: 'top-5', label: 'text-sm mt-2' },
  lg: { circle: 'w-12 h-12 text-base', line: 'top-6', label: 'text-base mt-2' },
}

export function SmartStepIndicator({
  currentStep,
  steps,
  onStepClick,
  canAccessStep,
  size = 'md',
  className,
}: SmartStepIndicatorProps) {
  const totalSteps = steps.length
  const sizes = sizeConfig[size]

  return (
    <nav 
      className={cn('w-full', className)}
      aria-label="Progress"
    >
      <ol className="flex w-full">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep
          const canAccess = canAccessStep ? canAccessStep(stepNumber) : true
          const isLast = index === totalSteps - 1

          return (
            <li 
              key={stepNumber}
              className={cn(
                'relative flex flex-col items-center',
                !isLast && 'flex-1'
              )}
            >
              {/* Connector line to next step */}
              {!isLast && (
                <div 
                  className={cn(
                    'absolute h-0.5 w-full',
                    sizes.line,
                    'left-1/2' // Start from center of this step
                  )}
                  aria-hidden="true"
                >
                  {/* Background line */}
                  <div className="absolute inset-0 bg-gray-200" />
                  {/* Progress line */}
                  <div 
                    className={cn(
                      'absolute inset-y-0 left-0 bg-blue-500 transition-all duration-300',
                      isCompleted ? 'w-full' : 'w-0'
                    )}
                  />
                </div>
              )}

              {/* Step circle */}
              <button
                type="button"
                onClick={() => canAccess && onStepClick?.(stepNumber)}
                disabled={!canAccess}
                aria-current={isActive ? 'step' : undefined}
                className={cn(
                  'relative z-10 flex items-center justify-center rounded-full border-2 font-medium transition-all',
                  sizes.circle,
                  isActive && 'border-blue-500 bg-blue-500 text-white ring-4 ring-blue-100',
                  isCompleted && 'border-blue-500 bg-blue-500 text-white',
                  !isActive && !isCompleted && canAccess && 'border-gray-300 bg-white text-gray-500 hover:border-blue-300 cursor-pointer',
                  !isActive && !isCompleted && !canAccess && 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                )}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </button>

              {/* Step label */}
              <span 
                className={cn(
                  'text-center whitespace-nowrap',
                  sizes.label,
                  isActive && 'text-blue-600 font-medium',
                  !isActive && 'text-gray-500'
                )}
              >
                {step.title}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
```

---

## Testing Checklist

- [ ] 2 steps - no stray lines
- [ ] 3 steps - no stray lines  
- [ ] 5+ steps - no stray lines
- [ ] Very long label text - no overflow issues
- [ ] Very short label text - proper centering
- [ ] Mixed label lengths - all circles aligned
- [ ] Step 1 active - correct progress line
- [ ] Middle step active - correct progress line
- [ ] Last step active - full progress line
- [ ] Click navigation works
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Responsive on mobile
- [ ] RTL layout works

---

## Summary

The root cause is a **coordinate system mismatch** between hardcoded line offsets and dynamic flex positioning. The fix is to either:

1. **Quick**: Use CSS Grid with equal columns
2. **Robust**: Use segment-based lines owned by each step item

The segment-based approach is recommended because it's self-contained, works with any number of steps, and doesn't depend on container width calculations.
