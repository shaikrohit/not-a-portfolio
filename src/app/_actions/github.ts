'use server';

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  fork: boolean;
  updated_at: string;
  pushed_at: string;
}

export async function getGitHubStats(username: string) {
  if (!username || typeof username !== 'string') {
    return { repoCount: 0 };
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) return { repoCount: 0 };
    const data = await response.json();
    return { repoCount: data.public_repos || 0 };
  } catch (error) {
    console.error('GitHub stats error:', error);
    return { repoCount: 0 };
  }
}

export async function getGitHubProjects(username: string): Promise<GitHubRepo[]> {
  if (!username || typeof username !== 'string') {
    return [];
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      next: { revalidate: 3600 }, // Cache for 1 hour for efficiency
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // Optional: process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {}
      }
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const repos: GitHubRepo[] = await response.json();

    return repos
      .filter((repo) => !repo.fork && repo.name !== username && repo.description)
      .sort((a, b) => {
        // Prioritize by stars, then by date
        if (b.stargazers_count !== a.stargazers_count) {
          return b.stargazers_count - a.stargazers_count;
        }
        return new Date(b.updated_at || b.pushed_at || '').getTime() - new Date(a.updated_at || a.pushed_at || '').getTime();
      })
      .slice(0, 6);
  } catch (error) {
    console.error('GitHub fetch error:', error);
    return [];
  }
}
