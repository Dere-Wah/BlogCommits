import { getCommits } from "./github";
import { generateBlogPost } from "./openai";

const PORT = process.env.PORT || 3000;

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // POST /api/repo endpoint
    if (url.pathname === "/api/repo" && req.method === "POST") {
      try {
        const body = (await req.json()) as { url?: string };

        // Validate request body
        if (!body.url) {
          return new Response(
            JSON.stringify({ error: "Repository URL is required" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        const repoUrl = body.url;

        // Fetch commits from GitHub
        console.log(`Fetching commits from ${repoUrl}...`);
        const commits = await getCommits(repoUrl);
        console.log(`Found ${commits.length} commits`);

        // Generate blog post using OpenAI
        console.log("Generating blog post...");
        const blogPost = await generateBlogPost(commits);
        console.log("Blog post generated successfully");

        // Return the generated blog post
        return new Response(
          JSON.stringify({
            success: true,
            blogPost,
            commitsProcessed: commits.length,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      } catch (error) {
        console.error("Error processing request:", error);
        return new Response(
          JSON.stringify({
            error:
              error instanceof Error ? error.message : "Internal server error",
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Health check endpoint
    if (url.pathname === "/health" && req.method === "GET") {
      return new Response(
        JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 404 for unknown routes
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  },
});

console.log(`🚀 Server running at http://localhost:${server.port}`);
