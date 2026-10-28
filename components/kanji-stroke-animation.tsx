"use client";

import { useState } from "react";

import { Button, buttonClass } from "@/components/ui/button";
import { cx } from "@/components/ui/cx";
import { getKakijunKanjiPageUrl, getKakijunStrokeGifUrl } from "@/lib/kakijun";

interface KanjiStrokeAnimationProps {
  character: string;
  strokeCount?: number;
  className?: string;
}

/** Stroke-order animation from kakijun.com. */
export function KanjiStrokeAnimation({ character, strokeCount, className }: KanjiStrokeAnimationProps) {
  const gifUrl = getKakijunStrokeGifUrl(character);
  const pageUrl = getKakijunKanjiPageUrl(character);
  const [replay, setReplay] = useState(0);

  if (!gifUrl) {
    return null;
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-2">
        <span className="eyebrow">Ordem dos traços</span>
        {strokeCount ? <span className="text-[13px] text-text-2">{strokeCount} traços</span> : null}
      </div>
      <div className="flex justify-center rounded-[10px] border border-line bg-white p-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- animated GIF from kakijun.com */}
        <img
          key={replay}
          src={gifUrl}
          alt={`Ordem dos traços de ${character}`}
          lang="ja"
          width={200}
          height={200}
          className="size-[min(100%,200px)] object-contain"
          loading="lazy"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="secondary" className="min-h-11! flex-1" onClick={() => setReplay((n) => n + 1)}>
          Repetir animação
        </Button>
        {pageUrl ? (
          <a
            href={pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cx(buttonClass("ghost"), "min-h-11! inline-flex")}
          >
            kakijun.com
          </a>
        ) : null}
      </div>
    </div>
  );
}
