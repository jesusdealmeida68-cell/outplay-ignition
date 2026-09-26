import { createFileRoute, Link } from "@tanstack/react-router";
import { CharacterCard } from "@/components/character-card";

export const Route = createFileRoute("/characters")({
  head: () => ({
    meta: [
      { title: "Personagens — OUTPLAY" },
      { name: "description", content: "Demonstração de personagens animados do OUTPLAY." },
    ],
  }),
  component: CharactersDemo,
});

function CharactersDemo() {
  return (
    <main className="game-stage game-grain arena-ground relative min-h-dvh overflow-hidden px-4 pb-12 pt-[max(20px,env(safe-area-inset-top))]">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-1 bg-gradient-to-r from-crimson via-gold to-crimson" />
      <div className="relative z-[1] mx-auto flex w-full max-w-[460px] flex-col">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="btn-plate rounded-md border border-border-strong px-3 py-1.5 text-xs font-bold uppercase text-foreground"
          >
            ← Voltar
          </Link>
          <h1 className="font-display text-lg font-black uppercase text-gold">Personagens</h1>
          <span className="w-[74px]" />
        </div>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Toca em "Atacar" ou "Sofrer dano" para veres a animação de cada personagem reagir em tempo
          real.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CharacterCard name="Bárbaro" kind="warrior" />
          <CharacterCard name="Arqueira" kind="archer" />
          <CharacterCard name="Feiticeira" kind="mage" />
        </div>
      </div>
    </main>
  );
}
