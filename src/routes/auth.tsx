import { createFileRoute } from "@tanstack/react-router";
import { GameAuth } from "@/components/game-auth";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Entrar — OUTPLAY" }, { name: "description", content: "Entra na tua conta OUTPLAY e prepara-te para a arena." },
    { property: "og:title", content: "Entrar — OUTPLAY" }, { property: "og:description", content: "Entra na tua conta OUTPLAY e prepara-te para a arena." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <GameAuth mode="login" />,
});