'use client';

import Gem, { type GemProps } from '@/components/Gem';

type GemTokenSize = 'chip' | 'sm' | 'md' | 'lg';

type GemTokenProps = {
  type: GemProps['type'];
  size?: GemTokenSize;
  animated?: boolean;
  muted?: boolean;
  className?: string;
  ringClassName?: string;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

const SHELL_SIZE_MAP: Record<GemTokenSize, string> = {
  chip: 'size-8',
  sm: 'size-11',
  md: 'size-14',
  lg: 'size-[4.75rem]'
};

const GEM_SIZE_MAP: Record<GemTokenSize, GemProps['size']> = {
  chip: 'sm',
  sm: 'sm',
  md: 'md',
  lg: 'lg'
};

const GEM_SCALE_MAP: Record<GemTokenSize, string> = {
  chip: 'scale-[0.78]',
  sm: 'scale-100',
  md: 'scale-100',
  lg: 'scale-100'
};

export default function GemToken({
  type,
  size = 'md',
  animated = true,
  muted = false,
  className,
  ringClassName
}: GemTokenProps) {
  return (
    <span
      className={cn(
        'relative grid place-items-center rounded-full bg-white/[0.06] p-[2px] ring-1 ring-white/14',
        'shadow-[0_10px_28px_rgba(4,7,20,0.42)]',
        SHELL_SIZE_MAP[size],
        muted && 'opacity-55 saturate-75',
        ringClassName,
        className
      )}
    >
      <span className='grid size-full place-items-center overflow-hidden rounded-full bg-[#0d1736]/90'>
        <span className={cn('relative translate-y-[0.5px]', GEM_SCALE_MAP[size])}>
          <Gem type={type} size={GEM_SIZE_MAP[size]} animated={animated} />
        </span>
      </span>
    </span>
  );
}
