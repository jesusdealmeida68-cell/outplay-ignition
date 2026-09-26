import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import artwork from "@/assets/outplay-key-art.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "OUTPLAY — A arena começa aqui" }, { name: "description", content: "OUTPLAY: entra na arena." },
    { property: "og:title", content: "OUTPLAY — A arena começa aqui" }, { property: "og:description", content: "OUTPLAY: entra na arena." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
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
      const remaining = Math.max(0, 2000 - (Date.now() - start));
      window.setTimeout(() => {
        if (!active) return;
        if (data.user) setReady(true);
        else navigate({ to: "/auth", replace: true });
      }, remaining);
    }
    void check();
    return () => { active = false; };
  }, [navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const embers = [
    { left: "18%", delay: "-1.2s", duration: "5.5s" },
    { left: "34%", delay: "-3.8s", duration: "6.4s" },
    { left: "58%", delay: "-.6s", duration: "5s" },
    { left: "74%", delay: "-4.6s", duration: "6.8s" },
    { left: "87%", delay: "-2.4s", duration: "5.9s" },
  ];

  return <main className="game-stage game-grain arena-beam arena-ground relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4">
    <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-crimson via-gold to-crimson" />
    {embers.map((ember, index) => <span key={index} className="ember" style={{ left: ember.left, animationDelay: ember.delay, animationDuration: ember.duration }} aria-hidden="true" />)}
    <img src={artwork.url} alt="OUTPLAY" className="splash-enter relative z-[1] w-[min(112vw,850px)] max-w-none drop-shadow-2xl" />
    {ready ? <div className="relative z-[1] mt-8 text-center"><p className="font-display text-2xl font-bold uppercase text-gold">A arena está a chegar.</p><Button variant="link" onClick={signOut} className="mt-6 text-muted-foreground">Sair da conta</Button></div> : <div className="absolute bottom-[max(44px,env(safe-area-inset-bottom))] z-[1] flex items-center gap-2" aria-label="A carregar">
      <span className="size-1.5 rotate-45 bg-gold" />
      <div className="loading-track h-0.5 w-32 overflow-hidden bg-muted" />
      <span className="size-1.5 rotate-45 bg-gold" />
    </div>}
  </main>;
}