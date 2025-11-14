# BlogCommits - AI Blog Post Generator 📝✨

Transform your GitHub repository commits into engaging, well-structured blog posts using AI.

![BlogCommits Demo](https://img.shields.io/badge/Status-Ready-success?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20+-green?style=for-the-badge&logo=node.js)

## Features

- 🚀 Modern, responsive UI built with React + TypeScript
- 📝 Converts GitHub commit history into narrative blog posts
- 🤖 Powered by OpenAI GPT-4
- 🎨 Beautiful gradient design with smooth animations
- 📋 One-click copy to clipboard
- ⚡ Fast and efficient processing

## Prerequisites

- Node.js (v20+)
- npm or bun
- GitHub Personal Access Token
- OpenAI API Key

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp env.example .env
   ```

4. Edit `.env` and add your API keys:
   ```env
   GITHUB_TOKEN=your_github_token_here
   OPENAI_API_KEY=your_openai_api_key_here
   SYSTEM_PROMPT_PATH=../prompts/blog.txt
   PORT=3000
   ```

   **Getting API Keys:**
   - GitHub Token: https://github.com/settings/tokens (needs `repo` scope)
   - OpenAI API Key: https://platform.openai.com/api-keys

5. Start the backend server:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:3000`

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

## Usage

1. Open your browser and go to `http://localhost:5173`
2. Enter a GitHub repository URL (e.g., `https://github.com/username/repo`)
3. Provide context about what the blog post should focus on
4. Click "Generate Blog Post"
5. Wait for the AI to analyze commits and generate your blog post
6. Copy the generated markdown content with one click!

## Project Structure

```
BlogCommits/
├── backend/           # Node.js backend with Bun runtime
│   ├── src/
│   │   ├── index.ts   # API server
│   │   ├── github.ts  # GitHub API integration
│   │   └── openai.ts  # OpenAI integration
│   └── .env           # Environment variables
├── frontend/          # React + TypeScript frontend
│   └── src/
│       ├── App.tsx    # Main application component
│       └── App.css    # Styling
└── prompts/
    └── blog.txt       # System prompt for AI
```

## API Endpoints

### POST /api/repo
Generate a blog post from a GitHub repository.

**Request Body:**
```json
{
  "url": "https://github.com/username/repo",
  "context": "Focus on new features and improvements"
}
```

**Response:**
```json
{
  "success": true,
  "blogPost": "# Generated Blog Post...",
  "commitsProcessed": 42
}
```

### GET /health
Health check endpoint.

## Technologies Used

- **Backend:** Bun, TypeScript, OpenAI API, GitHub API
- **Frontend:** React, TypeScript, Vite, React Markdown
- **Styling:** Custom CSS with gradients and animations

## Troubleshooting

- **Backend won't start:** Make sure you have valid API keys in `.env`
- **CORS errors:** Ensure backend is running on port 3000
- **No commits found:** Check that the GitHub token has proper permissions
- **OpenAI errors:** Verify your API key and account has credits

## License

MIT
