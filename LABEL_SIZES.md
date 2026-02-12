# Supported Label Sizes

This document lists all supported label sizes in the InstaLabel application.

## Available Label Sizes

| Size Label | Width (mm) | Height (mm) | Use Case | Notes |
|------------|-----------|-------------|----------|-------|
| **60x40** | 60 | 40 | Standard labels (Prep, Cook, Default, Ingredients, Defrost, Use First) | Default size, most common |
| **60x80** | 60 | 80 | Extended labels (Prep, Cook, Default, Ingredients) | For labels with more content |
| **56x80** | 56 | 80 | PPDS labels | Prepacked for Direct Sale compliance |

## Label Size Details

### 60x40 (Standard)
- **Dimensions**: 60mm × 40mm
- **Height Key**: `"40mm"` (for backward compatibility)
- **Default**: Yes
- **Supported Label Types**:
  - Prep Labels
  - Cook Labels
  - Default Labels
  - Ingredient Labels
  - Defrost Labels
  - Use First Labels

### 60x80 (Extended)
- **Dimensions**: 60mm × 80mm
- **Height Key**: `"80mm"` (for backward compatibility)
- **Default**: No
- **Supported Label Types**:
  - Prep Labels
  - Cook Labels
  - Default Labels
  - Ingredient Labels
  - Defrost Labels
  - Use First Labels

### 56x80 (PPDS)
- **Dimensions**: 56mm × 80mm
- **Height Key**: `"80mm"` (for backward compatibility)
- **Default**: No
- **Supported Label Types**:
  - PPDS Labels only (Prepacked for Direct Sale)

## Implementation

Label sizes are managed through:
- **Context**: `LabelSizeContext` - Single source of truth for selected label size
- **Component**: `LabelSizeSelector` - Universal dropdown selector
- **Location**: Print Manager page header (visible across all tabs)

## Usage

```typescript
import { useLabelSize } from "@/context/LabelSizeContext"

function MyComponent() {
  const { selectedSize, setSelectedSize, labelSizes } = useLabelSize()
  
  // Access current size
  const width = selectedSize.width  // e.g., 60
  const height = selectedSize.height // e.g., 40
  const label = selectedSize.label  // e.g., "60x40"
  const heightKey = selectedSize.heightKey // e.g., "40mm"
}
```

## Notes

- The label size selector is universal and applies to all tabs in the Print Manager
- PPDS tab is currently hidden but will use 56x80 when re-enabled
- All label sizes maintain backward compatibility with the `heightKey` field

