# BlogCommits Backend

A Bun-powered API server that generates blog posts from GitHub repository commits using OpenAI's GPT-4.

## Features

- 🚀 Fast Bun runtime
- 📝 Automatic blog post generation from git commits
- 🤖 OpenAI GPT-4 integration with structured outputs
- 🔒 Secure API with environment variable configuration
- 📊 Clean commit data extraction from GitHub

## Setup

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Environment Variables

Copy the example environment file and add your credentials:

```bash
cp env.example .env
```

Edit `.env` and add:

- `GITHUB_TOKEN`: Your GitHub personal access token ([create one here](https://github.com/settings/tokens))
- `OPENAI_API_KEY`: Your OpenAI API key ([get one here](https://platform.openai.com/api-keys))
- `SYSTEM_PROMPT_PATH`: Path to your custom system prompt (optional, defaults to `/Users/dere/BlogCommits-1/prompts/blog.txt`)
- `PORT`: Server port (optional, defaults to 3000)

### 3. Start the Server

```bash
bun run src/index.ts
```

The server will start at `http://localhost:3000`

## API Endpoints

### POST /api/repo

Generates a blog post from a GitHub repository's commits.

**Request Body:**

```json
{
  "url": "https://github.com/owner/repo",
  "context": "This project is a REST API built with Node.js that helps users track their fitness goals."
}
```

**Parameters:**

- `url` (required): The GitHub repository URL
- `context` (required): Additional context about the blog post - describes the project's purpose, key features, or the story you want to tell. This helps guide the AI in generating a more relevant and focused blog post.

**Response:**

```json
{
  "success": true,
  "blogPost": "# Blog Post Title\n\n...",
  "commitsProcessed": 42
}
```

**Error Response:**

```json
{
  "error": "Error message here"
}
```

### GET /health

Health check endpoint.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-11-14T12:00:00.000Z"
}
```

## Example Usage

```bash
curl -X POST http://localhost:3000/api/repo \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://github.com/Dere-Wah/BlogCommits",
    "context": "This is a tool that automatically generates blog posts from git commit history, making it easy for developers to document their project journey."
  }'
```

## Customization

### Custom System Prompt

You can customize the blog post generation by:

1. Editing the default prompt at `/Users/dere/BlogCommits-1/prompts/blog.txt`
2. Or setting `SYSTEM_PROMPT_PATH` to point to your own prompt file

The system prompt guides GPT-4 on how to structure and write the blog post based on the commits.

## Architecture

- **index.ts**: Main server with API endpoints
- **github.ts**: GitHub API integration and commit fetching
- **openai.ts**: OpenAI API integration with structured outputs using Zod

## Tech Stack

- [Bun](https://bun.sh) - Fast JavaScript runtime
- [OpenAI API](https://openai.com) - GPT-4 for blog generation
- [Zod](https://zod.dev) - Schema validation for structured outputs
- GitHub REST API - Commit data fetching
