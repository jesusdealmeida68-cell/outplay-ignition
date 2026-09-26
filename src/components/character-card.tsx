import { useState } from "react";

export type CharacterState = "idle" | "attack" | "hit" | "defeat";
export type CharacterKind = "warrior" | "archer" | "mage";

const PALETTE: Record<CharacterKind, { body: string; accent: string; weapon: string }> = {
  warrior: {
    body: "color-mix(in oklch, var(--crimson) 70%, var(--surface))",
    accent: "var(--gold)",
    weapon: "var(--gold)",
  },
  archer: {
    body: "color-mix(in oklch, var(--primary) 55%, var(--surface))",
    accent: "var(--gold)",
    weapon: "var(--foreground)",
  },
  mage: {
    body: "color-mix(in oklch, var(--gold) 45%, var(--surface))",
    accent: "var(--crimson)",
    weapon: "var(--crimson)",
  },
};

/**
 * A small original vector character (not based on any existing game's art)
 * that reacts to a game-state prop with CSS animation instead of a video/sprite
 * file. Cheap to render, easy to theme, and easy to extend with more states.
 * If an `image` is provided, that art is used as the "actor" instead of the
 * built-in SVG — same state classes, same animations, real artwork.
 */
export function CharacterCard({
  name,
  kind,
  hp = 100,
  image,
}: {
  name: string;
  kind: CharacterKind;
  hp?: number;
  image?: string;
}) {
  const [state, setState] = useState<CharacterState>("idle");
  const [health, setHealth] = useState(hp);
  const palette = PALETTE[kind];

  function attack() {
    if (state === "defeat") return;
    setState("attack");
    window.setTimeout(() => setState("idle"), 420);
  }

  function takeHit() {
    if (state === "defeat") return;
    const next = Math.max(0, health - 25);
    setHealth(next);
    if (next === 0) {
      setState("defeat");
      return;
    }
    setState("hit");
    window.setTimeout(() => setState("idle"), 320);
  }

  function reset() {
    setHealth(hp);
    setState("idle");
  }

  return (
    <div className="wood-panel flex flex-col items-center gap-3 rounded-md px-4 py-5">
      <div
        className={`char-stage char-${state}`}
        style={{
          ["--char-body" as string]: palette.body,
          ["--char-accent" as string]: palette.accent,
          ["--char-weapon" as string]: palette.weapon,
        }}
      >
        {image ? (
          <img src={image} alt={name} className="char-portrait" />
        ) : (
          <svg viewBox="0 0 120 140" className="char-svg" aria-hidden="true">
            <ellipse className="char-shadow" cx="60" cy="128" rx="30" ry="7" />
            <g className="char-body-group">
              <rect x="38" y="58" width="44" height="52" rx="14" fill="var(--char-body)" />
              <circle cx="60" cy="40" r="22" fill="var(--char-body)" />
              <circle cx="52" cy="38" r="3.2" fill="var(--background)" />
              <circle cx="68" cy="38" r="3.2" fill="var(--background)" />
              <rect x="46" y="18" width="28" height="10" rx="5" fill="var(--char-accent)" />
              <g className="char-arm">
                <rect x="76" y="62" width="12" height="34" rx="6" fill="var(--char-body)" />
                <g className="char-weapon">
                  <rect x="82" y="34" width="7" height="40" rx="3" fill="var(--char-weapon)" />
                  <rect x="76" y="30" width="19" height="9" rx="3" fill="var(--char-weapon)" />
                </g>
              </g>
              <rect x="32" y="62" width="12" height="32" rx="6" fill="var(--char-body)" />
              <rect x="42" y="106" width="14" height="26" rx="6" fill="var(--char-accent)" />
              <rect x="64" y="106" width="14" height="26" rx="6" fill="var(--char-accent)" />
            </g>
          </svg>
        )}
      </div>

      <div className="w-full text-center">
        <p className="font-display text-sm font-bold uppercase tracking-wide text-foreground">
          {name}
        </p>
        <div className="mx-auto mt-1.5 h-1.5 w-28 overflow-hidden rounded-full bg-black/40">
          <div
            className="h-full rounded-full bg-gradient-to-r from-crimson to-gold transition-all duration-300"
            style={{ width: `${health}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={attack}
          disabled={state === "defeat"}
          className="btn-plate rounded-md border border-border-strong px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-foreground disabled:opacity-40"
        >
          Atacar
        </button>
        <button
          type="button"
          onClick={takeHit}
          disabled={state === "defeat"}
          className="btn-plate rounded-md border border-border-strong px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-foreground disabled:opacity-40"
        >
          Sofrer dano
        </button>
        {state === "defeat" && (
          <button
            type="button"
            onClick={reset}
            className="btn-plate rounded-md border border-border-strong px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-gold"
          >
            Reviver
          </button>
        )}
      </div>
    </div>
  );
}
