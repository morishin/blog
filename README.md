# blog

A personal blog website built with Next.js: https://blog.morishin.me

## Features

- SSG
- Markdown support
- Mathematical expressions (KaTeX)
- Syntax highlighting
- Diagram support with Mermaid.js

## Development Setup

### Prerequisites

- Node.js v22.14
- Yarn
- direnv (if using .envrc)

### Installation

```bash
# Install dependencies
make install
```

### Starting Development Server

```bash
# Start development server
make serve
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Other Development Commands

```bash
# Format code
make format

# Run linter
make lint

# Type checking
make typecheck
```

## Adding Blog Posts

1. Create a new directory under `data/posts/YYYY/MM/DD` where:
   - YYYY is the year
   - MM is the month (with leading zero)
   - DD is the day (with leading zero)
2. Create a markdown file `*.md` inside the date directory. The filename will be used as the URL path
3. Run the translator script with the date parameters:
    ```bash
    node --experimental-strip-types scripts/translator.ts YYYY MM DD
    ```

    For example, to add a post for January 1st, 2025:

    ```bash
    node --experimental-strip-types scripts/translator.ts 2025 01 01
    ```

## Build and Deploy

```bash
# Production build
make build
```

## Tech Stack

- **Framework**: Next.js v13.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Markdown Processing**: unified, remark, rehype
- **Math Expressions**: KaTeX
- **Syntax Highlighting**: highlight.js
- **Diagrams**: Mermaid.js

## License

MIT 