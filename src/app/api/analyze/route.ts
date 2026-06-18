import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

async function fetchRepoData(owner: string, repo: string) {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
  };

  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  const repoResponse = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}`,
    { headers }
  );

  const treeResponse = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`,
    { headers }
  );

  let readme = '';
  try {
    const readmeResponse = await axios.get(
      `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/README.md`,
      { headers }
    );
    readme = readmeResponse.data;
  } catch {
    readme = 'No README found';
  }

  return {
    repo: repoResponse.data,
    tree: treeResponse.data,
    readme,
  };
}

async function generatePrompt(repoData: any): Promise<string> {
  const { repo, tree, readme } = repoData;

  const fileTree = tree.tree
    .slice(0, 50)
    .map((item: any) => (item.type === 'tree' ? `${item.path}/` : item.path))
    .join('\n');

  const prompt = `You are analyzing a GitHub repository to reverse-engineer the original creation prompt. Based on the following repository metadata and structure, generate a detailed synthetic prompt that someone might have used with an AI coding assistant to create this project.

Repository Name: ${repo.name}
Description: ${repo.description || 'No description'}
Language: ${repo.language || 'Unknown'}
Stars: ${repo.stargazers_count}
Forks: ${repo.forks_count}
Topics: ${repo.topics?.join(', ') || 'None'}
License: ${repo.license?.name || 'None'}

File Structure (first 50 items):
${fileTree}

README Content:
${readme.substring(0, 2000)}${readme.length > 2000 ? '\n...(truncated)' : ''}

Based on this information, generate a comprehensive and detailed prompt that describes what this repository is, what it does, and how it should be built. The prompt should be written as if someone is requesting this project from an AI coding assistant. Make it realistic and include specific technical requirements, architecture decisions, and feature descriptions that match what appears to be in the actual repository.`;

  return prompt;
}

export async function POST(request: NextRequest) {
  try {
    const { owner, repo } = await request.json();

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Missing owner or repo' },
        { status: 400 }
      );
    }

    const repoData = await fetchRepoData(owner, repo);
    const generatedPrompt = await generatePrompt(repoData);

    return NextResponse.json({
      prompt: generatedPrompt,
    });
  } catch (error: any) {
    console.error('Error analyzing repository:', error);

    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: 'Repository not found' },
        { status: 404 }
      );
    }

    if (error.response?.status === 403) {
      return NextResponse.json(
        { error: 'Rate limited. Please try again later.' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to analyze repository' },
      { status: 500 }
    );
  }
}
