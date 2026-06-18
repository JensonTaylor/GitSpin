'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Copy, Download, Loader } from 'lucide-react';

interface RepoAnalyzerProps {
  owner: string;
  repo: string;
}

export default function RepoAnalyzer({ owner, repo }: RepoAnalyzerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchAndAnalyze = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ owner, repo }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to analyze repository');
        }

        const data = await response.json();
        setPrompt(data.prompt);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAndAnalyze();
  }, [owner, repo]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy');
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([prompt], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${owner}-${repo}-prompt.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="w-full max-w-4xl mx-auto">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 shadow-2xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {owner}/{repo}
            </h2>
            <p className="text-slate-400">Generated prompt for this repository</p>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader className="w-8 h-8 text-blue-400 animate-spin" />
              <p className="text-slate-300">Analyzing repository...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-900 border border-red-700 rounded-lg p-4 text-red-100 mb-6">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && prompt && (
            <>
              <div className="output-box mb-6 max-h-96 overflow-y-auto">
                {prompt}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="btn btn-primary flex items-center gap-2 flex-1"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy Prompt'}
                </button>
                <button
                  onClick={handleDownload}
                  className="btn btn-primary flex items-center gap-2 flex-1"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
