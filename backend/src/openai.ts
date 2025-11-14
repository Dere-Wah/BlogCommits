import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import type { CommitData } from "./github";

// Define the response schema using Zod
const BlogPostSchema = z.object({
  prompt: z
    .string()
    .describe("A markdown styled blogpost based on the commits"),
});

/**
 * Reads the system prompt from a file path specified in environment variable
 */
async function getSystemPrompt(): Promise<string> {
  const promptPath =
    process.env.SYSTEM_PROMPT_PATH ||
    "/Users/dere/BlogCommits-1/prompts/blog.txt";

  try {
    const file = Bun.file(promptPath);
    const text = await file.text();
    return text;
  } catch (error) {
    throw new Error(
      `Failed to read system prompt from ${promptPath}: ${error}`
    );
  }
}

/**
 * Formats commits into a readable string for the prompt
 */
function formatCommitsForPrompt(commits: CommitData[]): string {
  return commits
    .map((commit, index) => {
      return `Commit #${index + 1}:
Author: ${commit.author}
Date: ${commit.date}
Message: ${commit.message}
---`;
    })
    .join("\n\n");
}

/**
 * Generates a blog post from commits using OpenAI's API
 * @param commits - Array of commit data
 * @param context - Additional context about the blogpost to generate
 * @returns Generated blog post in markdown format
 */
export async function generateBlogPost(
  commits: CommitData[],
  context: string
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const openai = new OpenAI({
    apiKey,
  });

  const baseSystemPrompt = await getSystemPrompt();
  // Append the context to the system prompt to give additional guidance
  const systemPrompt = `${baseSystemPrompt}

Context for this blog post:
${context}`;

  const userPrompt = formatCommitsForPrompt(commits);

  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: zodResponseFormat(BlogPostSchema, "blog_post"),
  });

  const response = completion.choices[0]?.message;

  if (response && response.parsed) {
    return response.parsed.prompt;
  } else if (response && response.refusal) {
    throw new Error(`OpenAI refused the request: ${response.refusal}`);
  } else {
    throw new Error("Failed to parse OpenAI response");
  }
}
