'use client';

import { useEffect, useId, useMemo, useState } from 'react';

export type GemProps = {
  type: 'gold' | 'ruby' | 'emerald' | 'sapphire';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
};

type Palette = {
  outer: string;
  mid: string;
  deep: string;
  glow: string;
  highlight: string;
};

const SIZE_MAP: Record<NonNullable<GemProps['size']>, string> = {
  sm: 'size-10',
  md: 'size-14',
  lg: 'size-20'
};

const PALETTES: Record<GemProps['type'], Palette> = {
  gold: {
    outer: '#FFD66B',
    mid: '#F6B73C',
    deep: '#A8731D',
    glow: 'rgba(246,183,60,0.34)',
    highlight: 'rgba(255,244,201,0.95)'
  },
  ruby: {
    outer: '#FF4FA3',
    mid: '#D54A9F',
    deep: '#A13D8F',
    glow: 'rgba(213,74,159,0.34)',
    highlight: 'rgba(255,220,242,0.92)'
  },
  emerald: {
    outer: '#3BD39A',
    mid: '#27BF8B',
    deep: '#1FAF77',
    glow: 'rgba(39,191,139,0.34)',
    highlight: 'rgba(219,255,242,0.9)'
  },
  sapphire: {
    outer: '#4FA3FF',
    mid: '#4A87FF',
    deep: '#3A6BFF',
    glow: 'rgba(74,135,255,0.34)',
    highlight: 'rgba(220,237,255,0.92)'
  }
};

export default function Gem({ type, size = 'md', animated = true }: GemProps) {
  const [burst, setBurst] = useState(false);
  const id = useId();
  const palette = PALETTES[type];

  useEffect(() => {
    if (!burst) return;
    const timer = window.setTimeout(() => setBurst(false), 520);
    return () => window.clearTimeout(timer);
  }, [burst]);

  const defs = useMemo(
    () => ({
      body: `gem-body-${id}`,
      facetA: `gem-facet-a-${id}`,
      facetB: `gem-facet-b-${id}`,
      facetC: `gem-facet-c-${id}`,
      sheen: `gem-sheen-${id}`
    }),
    [id]
  );

  return (
    <div
      role="img"
      aria-label={`${type} gem`}
      onPointerDown={() => animated && setBurst(true)}
      className={`gem-root ${SIZE_MAP[size]} ${animated ? 'is-animated' : ''} ${burst ? 'is-bursting' : ''}`}
      style={{ ['--gem-glow' as string]: palette.glow }}
    >
      <div className="gem-shell">
        <svg viewBox="0 0 120 120" className="gem-svg" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id={defs.body} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={palette.outer} />
              <stop offset="52%" stopColor={palette.mid} />
              <stop offset="100%" stopColor={palette.deep} />
            </linearGradient>
            <linearGradient id={defs.facetA} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={palette.highlight} />
              <stop offset="100%" stopColor="rgba(255,255,255,0.12)" />
            </linearGradient>
            <linearGradient id={defs.facetB} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
            </linearGradient>
            <linearGradient id={defs.facetC} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.48)" />
            </linearGradient>
            <linearGradient id={defs.sheen} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.55)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.0)" />
            </linearGradient>
          </defs>

          <path d="M60 10 97 42 84 85 60 108 36 85 23 42Z" fill={`url(#${defs.body})`} />
          <path d="M60 10 42 34 60 44 78 34Z" fill={`url(#${defs.facetA})`} opacity="0.8" />
          <path d="M23 42 42 34 60 44 47 69Z" fill={`url(#${defs.facetB})`} opacity="0.72" />
          <path d="M97 42 78 34 60 44 73 69Z" fill={`url(#${defs.facetB})`} opacity="0.72" />
          <path d="M60 44 47 69 60 84 73 69Z" fill={`url(#${defs.facetC})`} opacity="0.82" />
          <path d="M36 85 47 69 60 84 60 108Z" fill={`url(#${defs.facetB})`} opacity="0.66" />
          <path d="M84 85 73 69 60 84 60 108Z" fill={`url(#${defs.facetC})`} opacity="0.66" />

          <path d="M29 46 55 20" stroke="rgba(255,255,255,0.28)" strokeWidth="2" strokeLinecap="round" />
          <path d="M91 46 65 20" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeLinecap="round" />
          <path d="M45 92 60 84 75 92" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        {animated && <span className="gem-sweep" />}
      </div>

      {animated && (
        <>
          <span className="gem-particle gem-particle-a" />
          <span className="gem-particle gem-particle-b" />
          <span className="gem-particle gem-particle-c" />
        </>
      )}
    </div>
  );
}