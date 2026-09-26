import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { RibbonTag } from "@/components/ornament";
import { passwordSchema } from "@/lib/auth-validation";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Nova palavra-passe — OUTPLAY" }, { name: "description", content: "Define uma nova palavra-passe para a tua conta OUTPLAY." },
    { property: "og:title", content: "Nova palavra-passe — OUTPLAY" }, { property: "og:description", content: "Define uma nova palavra-passe para a tua conta OUTPLAY." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ResetPassword,
});

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const recoveryLink = typeof window !== "undefined" && (window.location.hash.includes("type=recovery") || new URLSearchParams(window.location.search).get("type") === "recovery");
  async function submit(event: FormEvent) {
    event.preventDefault();
    const result = passwordSchema.safeParse(password);
    if (!result.success) { setError(result.error.issues[0]?.message ?? "Palavra-passe inválida."); return; }
    setBusy(true); setError("");
    const { error: updateError } = await supabase.auth.updateUser({ password: result.data });
    setBusy(false);
    if (updateError) setError("O link expirou ou não é válido. Pede um novo link.");
    else setDone(true);
  }
  return <main className="game-stage game-grain relative flex min-h-dvh items-center justify-center overflow-hidden px-7">
    <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-crimson via-gold to-crimson" />
    <div className="relative w-full max-w-sm">
      <span className="block font-display text-xl font-black uppercase text-gold">OUTPLAY <span className="text-crimson">◆</span></span>
      <div className="mt-8"><RibbonTag>Nova palavra-passe</RibbonTag></div>
      <h1 className="mt-4 font-display text-[clamp(32px,9vw,42px)] font-black uppercase leading-[.95]">Definir palavra-passe</h1>
      {done ? <p className="mt-6 text-sm leading-relaxed">Palavra-passe atualizada. <Link to="/auth" className="font-bold text-gold underline-offset-4 hover:underline">Entrar</Link></p> : recoveryLink ? <form onSubmit={submit} className="mt-7 space-y-4">
        <label className="block"><span className="mb-2 block text-xs font-bold uppercase text-muted-foreground">Nova palavra-passe</span><input type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} className="field-slot h-13 w-full rounded-sm border border-border px-4 text-base text-foreground outline-none transition-colors focus:border-primary" /></label>
        <p className="text-xs text-muted-foreground">Mínimo de 8 caracteres, com maiúscula, minúscula e número.</p>
        {error && <p role="alert" className="border-l-2 border-destructive bg-surface p-3 text-sm text-destructive">{error}</p>}
        <Button variant="game" type="submit" className="mt-2 h-14 w-full text-lg" disabled={busy}>{busy ? "Aguarda..." : "GUARDAR"}</Button>
      </form> : <p className="mt-6 text-muted-foreground">Este link não é válido. <Link to="/auth" className="font-bold text-gold underline-offset-4 hover:underline">Voltar ao login</Link></p>}
    </div>
  </main>;
}