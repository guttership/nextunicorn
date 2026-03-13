"use client";

import { useMemo, useState } from "react";

type IdeaShareActionsProps = {
  ideaTitle: string;
  canonicalUrl: string;
  pitch: string;
};

function encode(value: string) {
  return encodeURIComponent(value);
}

export default function IdeaShareActions({ ideaTitle, canonicalUrl, pitch }: IdeaShareActionsProps) {
  const [copied, setCopied] = useState(false);

  const xUrl = useMemo(() => {
    const text = `${ideaTitle} on NextUnicorn. Practical startup idea with market, MVP, and voting signals.`;
    return `https://x.com/intent/tweet?text=${encode(text)}&url=${encode(canonicalUrl)}`;
  }, [ideaTitle, canonicalUrl]);

  const linkedInUrl = useMemo(() => {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encode(canonicalUrl)}`;
  }, [canonicalUrl]);

  async function copyPitch() {
    try {
      await navigator.clipboard.writeText(`${pitch}\n\n${canonicalUrl}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <a
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded border border-slate-700 px-4 py-2 text-sm font-mono font-bold text-slate-200 hover:border-pink-600 hover:text-white"
      >
        Share on X
      </a>
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded border border-slate-700 px-4 py-2 text-sm font-mono font-bold text-slate-200 hover:border-pink-600 hover:text-white"
      >
        Share on LinkedIn
      </a>
      <button
        type="button"
        onClick={copyPitch}
        className="rounded border border-slate-700 px-4 py-2 text-sm font-mono font-bold text-slate-200 hover:border-pink-600 hover:text-white"
      >
        {copied ? "Pitch copied" : "Copy startup pitch"}
      </button>
    </div>
  );
}