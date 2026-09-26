import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
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
  return <main className="game-stage flex min-h-dvh items-center justify-center px-7"><div className="w-full max-w-sm"><p className="font-display text-3xl font-black text-gold">OUTPLAY</p><h1 className="mt-8 font-display text-4xl font-black uppercase">Nova palavra-passe</h1>{done ? <p className="mt-6">Palavra-passe atualizada. <Link to="/auth" className="text-gold underline">Entrar</Link></p> : recoveryLink ? <form onSubmit={submit} className="mt-8 space-y-4"><label className="block text-sm">Nova palavra-passe<input type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} className="mt-2 h-13 w-full rounded-sm border border-border bg-input px-4 text-base outline-none focus:border-primary" /></label><p className="text-xs text-muted-foreground">Mínimo de 8 caracteres, com maiúscula, minúscula e número.</p>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button variant="game" className="h-14 w-full" disabled={busy}>GUARDAR</Button></form> : <p className="mt-6 text-muted-foreground">Este link não é válido. <Link to="/auth" className="text-gold underline">Voltar ao login</Link></p>}</div></main>;
}