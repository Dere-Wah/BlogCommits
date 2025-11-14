# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Set Up API Keys

1. Copy the example environment file:
   ```bash
   cp backend/env.example backend/.env
   ```

2. Edit `backend/.env` and add your keys:
   - **GitHub Token**: Get from https://github.com/settings/tokens
     - Click "Generate new token (classic)"
     - Select `repo` scope
     - Copy the token
   
   - **OpenAI API Key**: Get from https://platform.openai.com/api-keys
     - Click "Create new secret key"
     - Copy the key

### Step 2: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 3: Run the Application

**Option A: Run both servers with one command**
```bash
./start.sh
```

**Option B: Run servers separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### Step 4: Use the App

1. Open http://localhost:5173 in your browser
2. Enter a GitHub repository URL (e.g., `https://github.com/facebook/react`)
3. Add context about what to focus on
4. Click "Generate Blog Post"
5. Wait for the magic to happen! ✨

## 🎯 Example Usage

**Repository URL:**
```
https://github.com/vercel/next.js
```

**Context:**
```
Focus on the latest performance improvements and new features added in the last month. 
Highlight any breaking changes and migration guides.
```

## 🔧 Troubleshooting

**"GITHUB_TOKEN is not set"**
- Make sure you created the `.env` file in the `backend` directory
- Check that your token is valid

**"OPENAI_API_KEY is not set"**
- Verify your OpenAI API key is correct
- Make sure your OpenAI account has credits

**"Failed to read system prompt"**
- The prompt file should be at `prompts/blog.txt`
- Check the `SYSTEM_PROMPT_PATH` in your `.env`

**CORS errors**
- Make sure the backend is running on port 3000
- Check that both servers are running

## 📝 Notes

- The app fetches the most recent commits (default: 30)
- Generation takes 10-30 seconds depending on commit count
- The generated blog post is in Markdown format
- You can customize the prompt in `prompts/blog.txt`

Enjoy creating amazing blog posts! 🎉
