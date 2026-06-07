"use client";

import { Fragment } from "react";
import { SwedishWord } from "./SwedishWord";

// Words are runs of letters (incl. Swedish åäö), optionally joined by hyphens
// or apostrophes. Everything between matches (spaces, punctuation) is preserved
// as plain, non-clickable text.
const WORD_RE = /[\p{L}]+(?:[-'][\p{L}]+)*/gu;

export function SwedishText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of children.matchAll(WORD_RE)) {
    const start = match.index;
    if (start > lastIndex) {
      nodes.push(
        <Fragment key={key++}>{children.slice(lastIndex, start)}</Fragment>,
      );
    }
    nodes.push(
      <SwedishWord
        key={key++}
        word={match[0]}
        className="rounded transition-colors hover:bg-[#FECC02]/40"
      />,
    );
    lastIndex = start + match[0].length;
  }

  if (lastIndex < children.length) {
    nodes.push(<Fragment key={key++}>{children.slice(lastIndex)}</Fragment>);
  }

  return <span className={className}>{nodes}</span>;
}
