# ReusableAgGrid - Modern React Data Grid

A comprehensive, production-ready React TypeScript data grid component built with AG Grid Community, featuring modern popover column visibility controls, professional styling, and extensive customization options.

## 🚀 Key Features

- **🎛️ Modern Column Visibility**: Professional popover interface with icon, text, or combined button variants
- **🎨 Clean Professional Theme**: Light theme with improved contrast and styling  
- **📱 Responsive Design**: Adaptive controls that work on all screen sizes
- **🔄 Column Persistence**: Automatically saves and restores column order, visibility, and width
- **⚡ Performance Optimized**: Virtualization for large datasets
- **📝 TypeScript First**: Full type safety and IntelliSense support
- **🛠️ Professional Toolbar**: Organized control layout with proper spacing and alignment

## 🎯 Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to see the modern data grid in action with:
- Professional popover column visibility controls
- Clean white background theme
- No pagination footer (disabled for cleaner look)
- Modern car inventory demo

## 📚 Documentation

Complete documentation is available in the `/src/components/ReusableAgGrid/docs/` directory:

- **[Main Documentation](src/components/ReusableAgGrid/docs/README.md)** - Complete guide and features
- **[API Reference](src/components/ReusableAgGrid/docs/API.md)** - Detailed API documentation  
- **[Usage Examples](src/components/ReusableAgGrid/docs/examples.md)** - Practical implementation examples
- **[TypeScript Guide](src/components/ReusableAgGrid/docs/typescript-guide.md)** - TypeScript integration
- **[Troubleshooting](src/components/ReusableAgGrid/docs/troubleshooting.md)** - Common issues and solutions

## 🎨 Column Visibility Controls

The grid now features modern popover-based column visibility controls:

### Button Variants
- **Icon**: `columnVisibilityButtonVariant: 'icon'` - Compact gear icon with count badge
- **Text**: `columnVisibilityButtonVariant: 'text'` - Clear text button with custom labels
- **Combined**: `columnVisibilityButtonVariant: 'both'` - Icon + text (default, recommended)

### Positioning
- **Left**: `columnVisibilityButtonPosition: 'left'` - Align to left (default)
- **Right**: `columnVisibilityButtonPosition: 'right'` - Align to right

### Example Usage
```tsx
const config = {
  enableColumnVisibilityControls: true,
  columnVisibilityButtonVariant: 'both',
  columnVisibilityButtonPosition: 'left', 
  columnVisibilityButtonText: 'Manage Columns'
};
```

## 🛠️ Development

This project uses Vite + React + TypeScript for fast development.

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📦 Project Structure

```
src/
├── components/
│   └── ReusableAgGrid/           # Main grid component
│       ├── ReusableAgGrid.tsx    # Core grid component
│       ├── components/           # Sub-components
│       │   ├── ColumnVisibilityControls.tsx  # Modern popover controls
│       │   └── ActionMenuCellRenderer.tsx    # Action menu renderer
│       ├── hooks/               # Custom hooks
│       ├── types/               # TypeScript definitions
│       ├── utils/               # Utility functions
│       └── docs/                # Complete documentation
├── CarGrid.tsx                  # Demo implementation
└── App.tsx                      # Main application
```

---

## React + TypeScript + Vite Setup

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
