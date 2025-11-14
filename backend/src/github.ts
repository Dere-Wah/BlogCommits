export interface CommitData {
  message: string;
  author: string;
  date: string;
}

/**
 * Extracts owner and repo from GitHub URL
 * Supports: https://github.com/owner/repo or github.com/owner/repo
 */
function parseGitHubUrl(url: string): { owner: string; repo: string } {
  const urlPattern =
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)/;
  const match = url.match(urlPattern);

  if (!match) {
    throw new Error("Invalid GitHub repository URL");
  }

  return {
    owner: match[1] || "",
    repo: (match[2] || "").replace(/\.git$/, ""), // Remove .git suffix if present
  };
}

/**
 * Fetches all commits from a GitHub repository
 * @param repoUrl - Full GitHub repository URL
 * @returns Array of commit data with message, author, and date
 */
export async function getCommits(repoUrl: string): Promise<CommitData[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN is not set");
  }

  const { owner, repo } = parseGitHubUrl(repoUrl);
  const url = `https://api.github.com/repos/${owner}/${repo}/commits`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as any[];

  // Transform the commits to extract only the needed information
  return json.map((commit: any) => ({
    message: commit.commit.message,
    author: commit.commit.author.name,
    date: commit.commit.author.date,
  }));
}
