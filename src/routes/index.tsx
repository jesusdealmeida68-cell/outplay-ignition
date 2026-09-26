import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Swords, Sparkles, Gem, Coins, Menu, Bell, Package, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CornerBrackets, Crown, Rivets } from "@/components/ornament";
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

function Chip({
  icon,
  value,
  tone,
}: {
  icon: React.ReactNode;
  value: string;
  tone?: "gold" | "crimson";
}) {
  return (
    <span className="btn-plate flex items-center gap-1.5 rounded-full border border-border-strong px-3 py-1.5 text-xs font-bold text-foreground">
      <span
        className={
          tone === "gold" ? "text-gold" : tone === "crimson" ? "text-crimson" : "text-foreground"
        }
      >
        {icon}
      </span>
      {value}
    </span>
  );
}

function HomeDashboard() {
  const navigate = useNavigate();
  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const chests = [
    { label: "Bronze", time: "2h 40m" },
    { label: "Prata", time: "5h 10m" },
    { label: "Épico", time: "8h 00m" },
    { label: "Vazio", time: "" },
  ];

  const navItems = [
    { icon: Package, label: "Loja" },
    { icon: Users, label: "Clã" },
    { icon: Swords, label: "Combate", active: true },
    { icon: Gem, label: "Coleção" },
    { icon: Bell, label: "Eventos" },
  ];

  return (
    <main className="game-stage game-grain arena-ground relative min-h-dvh overflow-hidden pb-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-1 bg-gradient-to-r from-crimson via-gold to-crimson" />

      {/* Top status bar */}
      <div className="relative z-[2] flex items-center justify-between gap-2 px-4 pt-[max(14px,env(safe-area-inset-top))]">
        <Chip icon={<Crown className="size-4" />} value="Nível 7" tone="gold" />
        <div className="flex items-center gap-2">
          <Chip icon={<Coins className="size-3.5" />} value="24 300" tone="gold" />
          <Chip icon={<Gem className="size-3.5" />} value="480" tone="crimson" />
        </div>
        <Button
          variant="gameOutline"
          size="icon"
          onClick={signOut}
          aria-label="Menu"
          className="size-9 rounded-full"
        >
          <Menu className="size-4" />
        </Button>
      </div>

      {/* Player strip */}
      <div className="wood-panel relative z-[2] mx-4 mt-4 flex items-center justify-between rounded-md px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-crimson to-gold text-xs font-black text-primary-foreground">
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
      <div className="wood-panel relative z-[2] mx-4 mt-3 flex items-center gap-3 rounded-md px-3 py-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-crimson/40 to-gold/40 text-gold">
          <Package className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-xs font-bold uppercase tracking-wide text-gold">
            Passe da Temporada
          </p>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-black/40">
            <div className="h-full w-[15%] rounded-full bg-gradient-to-r from-crimson to-gold" />
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-bold text-foreground">
          3/20
        </span>
      </div>

      {/* Hero art with trophy road */}
      <div className="relative z-[1] mt-6 flex flex-col items-center px-4">
        <div className="arena-beam art-plate relative h-[190px] w-full max-w-[280px] overflow-hidden">
          <img
            src={heroArt}
            alt=""
            className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover object-top"
          />
          <CornerBrackets offset={-8} />
        </div>
        <div className="btn-plate -mt-4 flex w-full max-w-[280px] items-center gap-2.5 rounded-full border border-border-strong px-3.5 py-2">
          <Sparkles className="size-4 shrink-0 text-gold" />
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/40">
            <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-crimson to-gold" />
          </div>
          <span className="shrink-0 text-[11px] font-bold text-muted-foreground">Arena 6</span>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="relative z-[1] mt-6 flex gap-3 px-4">
        <Button variant="game" className="h-16 flex-1 flex-col gap-0.5 text-base">
          <Swords className="size-6" />
          Combate
        </Button>
        <Button variant="gameOutline" className="h-16 flex-1 flex-col gap-0.5 text-base">
          <Users className="size-6" />
          Modo Equipa
        </Button>
      </div>

      {/* Chest row */}
      <div className="relative z-[1] mt-7 grid grid-cols-4 gap-2.5 px-4">
        {chests.map((chest, index) => (
          <div
            key={index}
            className="wood-panel relative flex flex-col items-center gap-1.5 rounded-md px-1.5 py-3.5 text-center"
          >
            {index === 0 && <Rivets inset={6} />}
            {chest.time ? (
              <>
                <span className="flex size-9 items-center justify-center rounded-md bg-gradient-to-br from-crimson/50 to-gold/50 text-gold">
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
      <nav className="wood-panel fixed inset-x-0 bottom-0 z-[3] flex items-center justify-around px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-2.5">
        {navItems.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            type="button"
            className={`flex flex-col items-center gap-1 rounded-md px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${active ? "text-gold" : "text-muted-foreground"}`}
          >
            <Icon className="size-5" />
            {label}
          </button>
        ))}
      </nav>
    </main>
  );
}
