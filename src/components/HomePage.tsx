'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Github, Zap } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const parseRepoInput = (value: string): { owner: string; repo: string } | null => {
    const trimmed = value.trim();

    if (trimmed.startsWith('http')) {
      const urlMatch = trimmed.match(/github\.com\/([^\/]+)\/([^\/\.]+)/);
      if (urlMatch) {
        return { owner: urlMatch[1], repo: urlMatch[2] };
      }
    } else {
      const parts = trimmed.split('/');
      if (parts.length === 2) {
        return { owner: parts[0], repo: parts[1] };
      }
    }

    return null;
  };

  const handleAnalyze = () => {
    setError('');

    if (!input.trim()) {
      setError('Please enter a repository URL or owner/repo');
      return;
    }

    const parsed = parseRepoInput(input);
    if (!parsed) {
      setError('Invalid format. Use: owner/repo or https://github.com/owner/repo');
      return;
    }

    router.push(`/${parsed.owner}/${parsed.repo}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Github className="w-12 h-12 text-blue-400" />
            <h1 className="text-5xl font-bold text-white">GitSpin</h1>
          </div>
          <p className="text-xl text-slate-300 mb-2">Reverse Engineer GitHub Repositories</p>
          <p className="text-slate-400">Generate synthetic prompts from any public GitHub repo</p>
        </div>

        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 shadow-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Repository URL or Shorthand
              </label>
              <input
                type="text"
                placeholder="https://github.com/vercel/next.js or vercel/next.js"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                className="input-field"
              />
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            <button
              onClick={handleAnalyze}
              className="btn btn-primary w-full flex items-center justify-center gap-2 text-lg py-3"
            >
              <Zap className="w-5 h-5" />
              Analyze Repository
            </button>

            <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
              <div className="bg-slate-700 rounded-lg p-3">
                <p className="font-medium text-slate-200 mb-1">Supported Formats</p>
                <p>owner/repo</p>
                <p>github.com/owner/repo</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-3">
                <p className="font-medium text-slate-200 mb-1">Shareable</p>
                <p>Use /owner/repo</p>
                <p>in the URL bar</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>Made by Jenson Taylor</p>
        </div>
      </div>
    </div>
  );
}
