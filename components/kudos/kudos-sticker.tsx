import type { CSSProperties } from 'react';

import { cn } from '@/lib/utils';

export function KudosSticker({
  src,
  size,
  className,
  style,
}: {
  src: string;
  size: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      draggable={false}
      decoding="async"
      style={style}
      className={cn(
        'pointer-events-none select-none object-contain',
        className,
      )}
    />
  );
}
