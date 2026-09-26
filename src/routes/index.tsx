import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Swords, Sparkles, Gem, Coins, Menu, Bell, Package, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const heroArt = "/hero-key-art.png";
const SPLASH_MS = 5000;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OUTPLAY — A arena começa aqui" },
      { name: "description", content: "OUTPLAY: entra na arena." },
      { property: "og:title", content: "OUTPLAY — A arena começa aqui" },
      { property: "og:description", content: "OUTPLAY: entra na arena." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    const start = Date.now();
    async function check() {
      const { data } = await supabase.auth.getUser();
      const remaining = Math.max(0, SPLASH_MS - (Date.now() - start));
      window.setTimeout(() => {
        if (!active) return;
        if (data.user) setReady(true);
        else navigate({ to: "/auth", replace: true });
      }, remaining);
    }
    void check();
    return () => {
      active = false;
    };
  }, [navigate]);

  if (ready) return <HomeDashboard />;

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-end overflow-hidden bg-black">
      <img
        src={heroArt}
        alt="OUTPLAY"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/0 to-black/30" />
      <div
        className="relative z-[2] mb-[max(44px,env(safe-area-inset-bottom))] flex w-[min(80vw,320px)] flex-col items-center gap-2"
        aria-label="A carregar"
      >
        <div className="loading-track h-1.5 w-full overflow-hidden rounded-full bg-white/20" />
        <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white/90">
          A preparar a arena…
        </span>
      </div>
    </main>
  );
}

function HomeDashboard() {
  const navigate = useNavigate();
  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const chests = [
    { label: "Baú de Bronze", time: "2h 40m", tone: "from-amber-700 to-amber-500" },
    { label: "Baú de Prata", time: "5h 10m", tone: "from-slate-500 to-slate-300" },
    { label: "Baú Épico", time: "8h 00m", tone: "from-fuchsia-700 to-fuchsia-400" },
    { label: "Vazio", time: "", tone: "" },
  ];

  return (
    <main className="game-stage game-grain relative min-h-dvh overflow-hidden pb-28">
      {/* Top status bar */}
      <div className="relative z-[2] flex items-center justify-between gap-2 px-4 pt-[max(14px,env(safe-area-inset-top))]">
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full border border-border-strong bg-surface px-3 py-1.5 text-sm font-bold text-gold"
        >
          <Sparkles className="size-4" /> 7
        </button>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full border border-border-strong bg-surface px-3 py-1.5 text-xs font-bold text-foreground">
            <Coins className="size-3.5 text-gold" /> 24 300
          </span>
          <span className="flex items-center gap-1 rounded-full border border-border-strong bg-surface px-3 py-1.5 text-xs font-bold text-foreground">
            <Gem className="size-3.5 text-primary" /> 480
          </span>
        </div>
        <button
          type="button"
          onClick={signOut}
          aria-label="Menu"
          className="flex size-9 items-center justify-center rounded-full border border-border-strong bg-surface text-foreground"
        >
          <Menu className="size-4" />
        </button>
      </div>

      {/* Player strip */}
      <div className="relative z-[2] mx-4 mt-3 flex items-center justify-between rounded-lg border border-border-strong bg-surface px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-crimson to-gold text-xs font-black text-primary-foreground">
            OP
          </span>
          <div className="leading-tight">
            <p className="text-sm font-bold text-foreground">Jogador OUTPLAY</p>
            <p className="text-[11px] text-muted-foreground">Divisão Bronze</p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-sm font-bold text-gold">
          <Sparkles className="size-4" /> 1 280
        </span>
      </div>

      {/* Season pass banner */}
      <div className="relative z-[2] mx-4 mt-3 flex items-center gap-3 overflow-hidden rounded-lg border border-border-strong bg-gradient-to-r from-[#3b2410] to-[#1b1006] px-3 py-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-gold/20 text-gold">
          <Package className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold uppercase tracking-wide text-gold">
            Passe da Temporada
          </p>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black/40">
            <div className="h-full w-[15%] rounded-full bg-gradient-to-r from-crimson to-gold" />
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-black/30 px-2 py-1 text-[11px] font-bold text-white">
          3/20
        </span>
      </div>

      {/* Hero art with trophy road */}
      <div className="relative z-[1] mt-6 flex flex-col items-center px-4">
        <div className="relative h-[220px] w-full max-w-[300px] overflow-hidden rounded-xl">
          <img src={heroArt} alt="" className="h-full w-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        <div className="-mt-4 flex w-full max-w-[280px] items-center gap-2 rounded-full border border-border-strong bg-surface px-3 py-1.5">
          <Sparkles className="size-4 shrink-0 text-gold" />
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/40">
            <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-crimson to-gold" />
          </div>
          <span className="shrink-0 text-[11px] font-bold text-muted-foreground">Arena 6</span>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="relative z-[1] mt-6 flex gap-3 px-4">
        <button
          type="button"
          className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl border-b-4 border-amber-800 bg-gradient-to-b from-amber-500 to-amber-600 py-4 text-primary-foreground shadow-lg active:translate-y-0.5 active:border-b-2"
        >
          <Swords className="size-6" />
          <span className="font-display text-lg font-black uppercase">Combate</span>
        </button>
        <button
          type="button"
          className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl border-b-4 border-blue-800 bg-gradient-to-b from-blue-500 to-blue-600 py-4 text-primary-foreground shadow-lg active:translate-y-0.5 active:border-b-2"
        >
          <Users className="size-6" />
          <span className="font-display text-lg font-black uppercase">Modo Equipa</span>
        </button>
      </div>

      {/* Chest row */}
      <div className="relative z-[1] mt-7 grid grid-cols-4 gap-2 px-4">
        {chests.map((chest, index) => (
          <div
            key={index}
            className="wood-panel flex flex-col items-center gap-1.5 rounded-md px-1.5 py-3 text-center"
          >
            {chest.time ? (
              <>
                <span
                  className={`flex size-9 items-center justify-center rounded-md bg-gradient-to-br ${chest.tone} text-primary-foreground`}
                >
                  <Package className="size-5" />
                </span>
                <p className="text-[10px] font-bold leading-tight text-foreground">{chest.label}</p>
                <p className="text-[10px] font-bold text-gold">{chest.time}</p>
              </>
            ) : (
              <span className="flex size-9 items-center justify-center rounded-md border border-dashed border-border-strong text-muted-foreground">
                +
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-[3] flex items-center justify-around border-t border-border-strong bg-surface px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-2">
        {[
          { icon: Package, label: "Loja" },
          { icon: Users, label: "Clã" },
          { icon: Swords, label: "Combate", active: true },
          { icon: Gem, label: "Coleção" },
          { icon: Bell, label: "Eventos" },
        ].map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            type="button"
            className={`flex flex-col items-center gap-0.5 rounded-md px-3 py-1 text-[10px] font-bold ${active ? "text-gold" : "text-muted-foreground"}`}
          >
            <Icon className="size-5" />
            {label}
          </button>
        ))}
      </nav>
    </main>
  );
}
