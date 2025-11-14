import 'dotenv/config';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { getCommits } from "./github.js";
import { generateBlogPost } from "./openai.js";

const PORT = process.env.PORT || 3000;

// Helper to parse JSON body
async function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

const server = createServer(async (req, res) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || '', `http://${req.headers.host}`);

  try {
    // POST /api/repo endpoint
    if (url.pathname === "/api/repo" && req.method === "POST") {
      try {
        const body = await parseBody(req) as { url?: string; context?: string };

        // Validate request body
        if (!body.url) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Repository URL is required" }));
          return;
        }

        if (!body.context) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Context is required" }));
          return;
        }

        const repoUrl = body.url;
        const context = body.context;

        // Fetch commits from GitHub
        console.log(`Fetching commits from ${repoUrl}...`);
        const commits = await getCommits(repoUrl);
        console.log(`Found ${commits.length} commits`);

        // Generate blog post using OpenAI
        console.log("Generating blog post...");
        const blogPost = await generateBlogPost(commits, context);
        console.log("Blog post generated successfully");

        // Return the generated blog post
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          success: true,
          blogPost,
          commitsProcessed: commits.length,
        }));
      } catch (error) {
        console.error("Error processing request:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          error: error instanceof Error ? error.message : "Internal server error",
        }));
      }
      return;
    }

    // Health check endpoint
    if (url.pathname === "/health" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }));
      return;
    }

    // 404 for unknown routes
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  } catch (error) {
    console.error("Server error:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
