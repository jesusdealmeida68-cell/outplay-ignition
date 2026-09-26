import type { CSSProperties, ReactNode } from "react";

function Corner({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className} style={style}>
      <path d="M2 27V10a8 8 0 0 1 8-8h17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <rect x="0" y="0" width="6" height="6" rx="1" transform="translate(2 2) rotate(45)" fill="currentColor" />
    </svg>
  );
}

/** Four gold corner brackets around a relatively-positioned parent, like a card frame in a mobile game UI. */
export function CornerBrackets({ offset = -9, className = "" }: { offset?: number; className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 z-10 text-gold ${className}`} aria-hidden="true">
      <Corner className="absolute size-5" style={{ left: offset, top: offset }} />
      <Corner className="absolute size-5 rotate-90" style={{ right: offset, top: offset }} />
      <Corner className="absolute size-5 rotate-180" style={{ right: offset, bottom: offset }} />
      <Corner className="absolute size-5 -rotate-90" style={{ left: offset, bottom: offset }} />
    </div>
  );
}

/** A pennant-shaped label, like a rank or status tag in a competitive mobile game. */
export function RibbonTag({ children }: { children: ReactNode }) {
  return (
    <span className="ribbon-tag inline-flex items-center py-1.5 pl-4 pr-3 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-primary-foreground">
      {children}
    </span>
  );
}

/** A horizontal rule with a small rotated gem in the middle, used to split sections ("ou", footers). */
export function GemDivider({ label }: { label?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground" role="separator">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-border-strong" />
      <span className="size-[7px] rotate-45 bg-gold" aria-hidden="true" />
      {label && <span>{label}</span>}
      <span className="size-[7px] rotate-45 bg-gold" aria-hidden="true" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-border-strong" />
    </div>
  );
}
