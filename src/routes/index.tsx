import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const heroArt = "/hero-key-art.png";
const SPLASH_MS = 5000;

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
      const remaining = Math.max(0, SPLASH_MS - (Date.now() - start));
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

  return <main className="relative flex min-h-dvh flex-col items-center justify-end overflow-hidden bg-black">
    <img src={heroArt} alt="OUTPLAY" className="absolute inset-0 z-0 h-full w-full object-cover" />
    <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/0 to-black/30" />
    {ready ? <div className="relative z-[2] mb-10 text-center"><p className="font-display text-2xl font-bold uppercase text-gold drop-shadow-lg">A arena está a chegar.</p><Button variant="link" onClick={signOut} className="mt-6 text-white/80">Sair da conta</Button></div> : <div className="relative z-[2] mb-[max(44px,env(safe-area-inset-bottom))] flex w-[min(80vw,320px)] flex-col items-center gap-2" aria-label="A carregar">
      <div className="loading-track h-1.5 w-full overflow-hidden rounded-full bg-white/20" />
      <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white/90">A preparar a arena…</span>
    </div>}
  </main>;
}