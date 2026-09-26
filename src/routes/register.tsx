import { createFileRoute } from "@tanstack/react-router";
import { GameAuth } from "@/components/game-auth";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [
    { title: "Criar conta — OUTPLAY" }, { name: "description", content: "Cria a tua conta e reserva o teu nome de jogador OUTPLAY." },
    { property: "og:title", content: "Criar conta — OUTPLAY" }, { property: "og:description", content: "Cria a tua conta e reserva o teu nome de jogador OUTPLAY." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <GameAuth mode="register" />,
});