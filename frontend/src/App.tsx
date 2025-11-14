import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import './App.css'

function App() {
  const [repoUrl, setRepoUrl] = useState('')
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [blogPost, setBlogPost] = useState('')
  const [error, setError] = useState('')
  const [commitsProcessed, setCommitsProcessed] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setBlogPost('')
    setCommitsProcessed(0)

    try {
      const response = await fetch('http://localhost:3000/api/repo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: repoUrl, context }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate blog post')
      }

      setBlogPost(data.blogPost)
      setCommitsProcessed(data.commitsProcessed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(blogPost)
    alert('Blog post copied to clipboard!')
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">
            <span className="icon">📝</span>
            BlogCommits
          </h1>
          <p className="subtitle">Transform your GitHub commits into engaging blog posts with AI</p>
        </header>

        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <label htmlFor="repoUrl" className="label">
              GitHub Repository URL
            </label>
            <input
              id="repoUrl"
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              className="input"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="context" className="label">
              Blog Post Context
            </label>
            <textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Provide context about what this blog post should focus on..."
              className="textarea"
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Generating...
              </>
            ) : (
              <>
                <span>✨</span>
                Generate Blog Post
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="error">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {blogPost && (
          <div className="result">
            <div className="result-header">
              <h2 className="result-title">
                Generated Blog Post
                {commitsProcessed > 0 && (
                  <span className="badge">{commitsProcessed} commits</span>
                )}
              </h2>
              <button onClick={copyToClipboard} className="copy-button">
                📋 Copy
              </button>
            </div>
            <div className="markdown-content">
              <ReactMarkdown>{blogPost}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
