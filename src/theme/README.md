# Theme System

The Notwo app uses a centralized design system for consistent styling across the application.

## Structure

```
theme/
├── colors.ts       # Color palette and theme variants
├── spacing.ts      # Spacing scale and layout values
├── typography.ts   # Font families, sizes, and text styles
├── index.ts        # Main theme export
└── README.md       # This file
```

## Usage

### Import the theme

```typescript
import { theme } from '@/theme';
```

### Using colors

```typescript
import { colors } from '@/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  text: {
    color: colors.primary,
  },
});
```

### Using spacing

```typescript
import { spacing } from '@/theme';

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: spacing.radiusMd,
  },
});
```

### Using typography

```typescript
import { textStyles, fontSize, fontWeight } from '@/theme';

const styles = StyleSheet.create({
  heading: {
    ...textStyles.headlineLarge,
  },
  body: {
    fontSize: fontSize.bodyMd,
    fontWeight: fontWeight.regular,
  },
});
```

## Design Tokens

### Colors

The color system is based on Material Design 3:
- **Primary**: Main brand color (#C2652A)
- **Secondary**: Supporting color (#78706A)
- **Tertiary**: Accent color (#8C3C3C)
- **Surface**: Background surfaces with 5 container levels
- **Semantic**: Error, success, warning, info colors

### Spacing

Based on 4px base unit with a consistent scale:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `xxl`: 48px
- `xxxl`: 64px

### Typography

Font scale with display, headline, title, body, and label styles:
- Font families: sans, serif, rounded, mono
- Sizes: 11px (caption) to 57px (display large)
- Weights: light (300) to extrabold (800)

## Theme Exports

The `SaharaTheme` and `Fonts` exports are provided for components that need the raw palette:

```typescript
// Raw theme object
import { SaharaTheme } from '@/theme';

// Design tokens (recommended)
import { colors } from '@/theme';
```

## Best Practices

1. **Use design tokens**: Always use theme values instead of hardcoded values
2. **Be consistent**: Use the same spacing and color values throughout
3. **Leverage presets**: Use `textStyles` presets for common text patterns
4. **Type safety**: Import types for better IDE support
5. **Dark mode ready**: Theme structure supports future dark mode implementation
