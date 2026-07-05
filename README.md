# Rishi Jain — Portfolio

This repository contains the source code for my professional portfolio website: [rishi-jain.vercel.app](https://rishi-jain.vercel.app).

## Architecture

The site is built as a highly optimized React Single Page Application (SPA) using Vite.

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Vanilla CSS with localized styles, optimized for minimum rendering overhead
- **Deployment**: Vercel

## Performance & SEO Optimization

The portfolio is designed with rigorous attention to Web Vitals and SEO:

1. **AI Visibility (Generative Engine Optimization)**: Uses `<noscript>` fallback tags and robust structured data to ensure maximum citation visibility by LLMs (ChatGPT, Claude, Perplexity).
2. **Entity Consolidation**: Extensive JSON-LD schema graphs (Person, Organization, WebSite, WebPage, FAQPage, CreativeWork) provide a semantic web of relationships for search engines.
3. **Core Web Vitals**:
   - Zero layout shift (CLS = 0)
   - Highly compressed WebP imagery for instantaneous LCP
   - CSS-based smooth scrolling and interactions to minimize main thread blocking
4. **Responsive Strategy**: Fluid typography (`clamp()`) and dynamic grids ensure seamless adaptation from ultra-wide desktops to small mobile devices.

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Structure

- `/src/components` - Reusable UI elements and layout primitives
- `/src/data` - Extracted content (projects, FAQs, services) to keep components clean
- `/src/seo` - Centralized JSON-LD graph generation and meta tag management
- `/public` - Static assets, highly compressed WebP imagery, robots.txt, and sitemap.xml

## Author

**Rishi Jain**  
Technology Partner & Software Engineer  
[LinkedIn](https://www.linkedin.com/in/rishi-jainn/) | [rishi-jain.vercel.app](https://rishi-jain.vercel.app)
