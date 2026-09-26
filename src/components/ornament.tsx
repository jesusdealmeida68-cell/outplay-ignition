import type { CSSProperties, ReactNode } from "react";

function Corner({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className} style={style}>
      <path d="M2 27V10a8 8 0 0 1 8-8h17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <rect x="0" y="0" width="6" height="6" rx="1" transform="translate(2 2) rotate(45)" fill="currentColor" />
    </svg>
  );
}

/** Small three-point crown, used as a flourish above headlines and status tags. */
export function Crown({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 34" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M4 30 2 11l12 8L24 3l10 16 12-8-2 19Z" />
      <circle cx="24" cy="3.5" r="2.6" />
      <circle cx="2.5" cy="11" r="2.1" />
      <circle cx="45.5" cy="11" r="2.1" />
    </svg>
  );
}

/** Four bolt-like rivets in the corners of a relatively-positioned parent, for a riveted wood/metal plaque look. */
export function Rivets({ inset = 10 }: { inset?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <span className="rivet absolute size-[7px] rounded-full" style={{ left: inset, top: inset }} />
      <span className="rivet absolute size-[7px] rounded-full" style={{ right: inset, top: inset }} />
      <span className="rivet absolute size-[7px] rounded-full" style={{ right: inset, bottom: inset }} />
      <span className="rivet absolute size-[7px] rounded-full" style={{ left: inset, bottom: inset }} />
    </div>
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
