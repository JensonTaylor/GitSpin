# GitSpin

Reverse engineer GitHub repositories by generating synthetic prompts that describe what an AI coding assistant might have been asked to build.

**Made by Jenson Taylor**

## Features

- Input any public GitHub repository URL or shorthand (owner/repo)
- Fetch repository metadata, file structure, and README content
- Generate detailed synthetic prompts describing the repository
- Shareable URLs: `/owner/repo` automatically analyzes the repository
- Copy or download the generated prompts
- Clean, modern UI with Tailwind CSS

## Setup

### Prerequisites

- Node.js 18+
- GitHub Personal Access Token (optional, for higher API rate limits)
- OpenRouter API Key (optional, for future LLM integration)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with:
```
GITHUB_TOKEN=your_github_token
OPENROUTER_API_KEY=your_openrouter_key
```

### Development

Run the development server:
```bash
npm run dev
```

Visit http://localhost:3000/gitspin

### Build for GitHub Pages

```bash
npm run build
```

This creates a static export in the `out/` directory ready for GitHub Pages hosting.

## Usage

### Via Web Interface

1. Visit the home page
2. Enter a repository URL (https://github.com/owner/repo) or shorthand (owner/repo)
3. Click "Analyze Repository"
4. Copy or download the generated prompt

### Via Direct URL

Visit: `https://yourdomain.com/gitspin/owner/repo`

The analysis will run automatically.

## How It Works

1. Fetches repository metadata from GitHub API (name, description, language, stars, etc.)
2. Retrieves the file tree structure from the repository
3. Downloads the README content
4. Generates a comprehensive prompt based on all collected information

## Environment Variables

- `GITHUB_TOKEN`: GitHub Personal Access Token for higher API rate limits
- `OPENROUTER_API_KEY`: For future LLM-powered prompt generation

## License

MIT

## Author

Jenson Taylor
