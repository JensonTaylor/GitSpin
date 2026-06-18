'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import RepoAnalyzer from '@/components/RepoAnalyzer';

export default function RepoPage() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;

  if (!owner || !repo) {
    return <div>Loading...</div>;
  }

  return <RepoAnalyzer owner={owner} repo={repo} />;
}
