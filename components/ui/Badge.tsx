import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLSpanElement> & {
  dot?: boolean;
};

export function Badge({ className, children, dot = true, ...rest }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary-300 uppercase',
        className,
      )}
      {...rest}
    >
      {dot && <span className="inline-block h-[7px] w-[7px] rounded-full bg-primary-400" />}
      {children}
    </span>
  );
}
