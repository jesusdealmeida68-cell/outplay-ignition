import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loginSchema, registerSchema, emailSchema } from "@/lib/auth-validation";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import artwork from "@/assets/outplay-key-art.png.asset.json";

type Mode = "login" | "register";

function GoogleIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 shrink-0"><path fill="#4285F4" d="M21.35 12.23c0-.7-.06-1.38-.18-2.03H12v3.86h5.24a4.48 4.48 0 0 1-1.95 2.94v2.45h3.15c1.84-1.7 2.91-4.2 2.91-7.22Z"/><path fill="#34A853" d="M12 21.5c2.62 0 4.82-.87 6.43-2.35l-3.15-2.45c-.87.59-1.98.94-3.28.94a5.8 5.8 0 0 1-5.44-4.02H3.31v2.53A9.5 9.5 0 0 0 12 21.5Z"/><path fill="#FBBC05" d="M6.56 13.62a5.7 5.7 0 0 1 0-3.24V7.85H3.31a9.5 9.5 0 0 0 0 8.3l3.25-2.53Z"/><path fill="#EA4335" d="M12 6.36c1.42 0 2.68.49 3.68 1.44l2.76-2.77A9.2 9.2 0 0 0 12 2.5a9.5 9.5 0 0 0-8.69 5.35l3.25 2.53A5.8 5.8 0 0 1 12 6.36Z"/></svg>;
}

function errorMessage(message: string) {
  if (/invalid login credentials/i.test(message)) return "E-mail ou palavra-passe incorretos.";
  if (/user already registered/i.test(message)) return "Este e-mail já tem uma conta. Entra com a tua palavra-passe.";
  if (/email rate limit/i.test(message)) return "Muitas tentativas. Aguarda um momento e tenta novamente.";
  return "Não foi possível concluir. Tenta novamente.";
}

export function GameAuth({ mode }: { mode: Mode }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [recovery, setRecovery] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    if (recovery) {
      const result = emailSchema.safeParse(email);
      if (!result.success) { setFieldErrors({ email: result.error.issues[0]?.message ?? "E-mail inválido." }); return; }
      setPending(true);
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(result.data, { redirectTo: `${window.location.origin}/reset-password` });
      setPending(false);
      if (resetError) setError(errorMessage(resetError.message));
      else setSent(true);
      return;
    }
    const parsed = mode === "register" ? registerSchema.safeParse({ email, password, playerName }) : loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setFieldErrors(Object.fromEntries(parsed.error.issues.map(issue => [String(issue.path[0]), issue.message])));
      return;
    }
    setPending(true);
    try {
      if (mode === "register") {
        const { data, error: signUpError } = await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: window.location.origin, data: { player_name: playerName.trim() } } });
        if (signUpError) throw signUpError;
        if (!data.session || !data.user) throw new Error("Não foi possível iniciar sessão após criar a conta.");
        const { error: profileError } = await supabase.from("profiles").insert({ id: data.user.id, player_name: playerName.trim() });
        if (profileError) throw new Error("Conta criada, mas não foi possível guardar o nome de jogador. Tenta novamente mais tarde.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (signInError) throw signInError;
      }
      navigate({ to: "/", replace: true });
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "";
      setError(message.startsWith("Conta criada") || message.startsWith("Não foi possível iniciar") ? message : errorMessage(message));
    } finally { setPending(false); }
  }

  async function googleSignIn() {
    setError(""); setPending(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (result.error) throw result.error;
      if (!result.redirected) navigate({ to: "/", replace: true });
    } catch (cause) {
      setError(errorMessage(cause instanceof Error ? cause.message : ""));
      setPending(false);
    }
  }

  return <main className="game-stage game-grain relative min-h-dvh overflow-hidden">
    <div className="pointer-events-none absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-crimson via-gold to-crimson" />
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[460px] flex-col px-7 pb-8 pt-[max(28px,env(safe-area-inset-top))] sm:px-10">
      <header className="flex items-center justify-between gap-4">
        {recovery ? <Button variant="ghost" size="icon" type="button" onClick={() => { setRecovery(false); setSent(false); setError(""); }} aria-label="Voltar ao login"><ArrowLeft /></Button> : <span className="h-9 w-9" />}
        <span className="font-display text-xl font-black uppercase text-gold">OUTPLAY <span className="text-crimson">◆</span></span>
        <span className="h-9 w-9" />
      </header>

      <div className="relative mx-auto mt-4 h-[clamp(150px,23dvh,220px)] w-full max-w-[360px] overflow-hidden" aria-hidden="true">
        <img src={artwork.url} alt="" className="absolute left-1/2 top-1/2 w-full max-w-none -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-2xl" />
      </div>

      <div className="relative mt-1 flex-1">
        <div className="mb-5 h-[2px] w-12 bg-primary" />
        <h1 className="font-display text-[clamp(36px,11vw,48px)] font-black uppercase leading-[.95] text-foreground">{recovery ? "Recuperar acesso" : mode === "register" ? "Criar conta" : "Bem-vindo de volta"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{recovery ? "Enviaremos um link para o teu e-mail." : mode === "register" ? "A tua jornada começa aqui." : "A arena está à tua espera."}</p>

        {sent ? <div className="mt-8 border-l-2 border-primary bg-surface p-4 text-sm leading-relaxed">Se existir uma conta com este e-mail, receberás um link para redefinir a palavra-passe.</div> :
          <form onSubmit={submit} noValidate className="mt-6 space-y-4">
            {mode === "register" && !recovery && <label className="block"><span className="mb-2 block text-xs font-bold uppercase text-muted-foreground">Nome de jogador</span><input autoComplete="nickname" maxLength={24} value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder="O teu nome na arena" aria-invalid={Boolean(fieldErrors.playerName)} className="h-13 w-full rounded-sm border border-border bg-input px-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary" />{fieldErrors.playerName && <span className="mt-1 block text-xs text-destructive">{fieldErrors.playerName}</span>}</label>}
            <label className="block"><span className="mb-2 block text-xs font-bold uppercase text-muted-foreground">E-mail</span><input type="email" inputMode="email" autoComplete="email" maxLength={255} value={email} onChange={e => setEmail(e.target.value)} placeholder="O teu e-mail" aria-invalid={Boolean(fieldErrors.email)} className="h-13 w-full rounded-sm border border-border bg-input px-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary" />{fieldErrors.email && <span className="mt-1 block text-xs text-destructive">{fieldErrors.email}</span>}</label>
            {!recovery && <label className="block"><span className="mb-2 block text-xs font-bold uppercase text-muted-foreground">Palavra-passe</span><span className="relative block"><input type={visible ? "text" : "password"} autoComplete={mode === "register" ? "new-password" : "current-password"} maxLength={128} value={password} onChange={e => setPassword(e.target.value)} placeholder="A tua palavra-passe" aria-invalid={Boolean(fieldErrors.password)} className="h-13 w-full rounded-sm border border-border bg-input px-4 pr-14 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary" /><Button variant="ghost" size="icon" type="button" onClick={() => setVisible(!visible)} aria-label={visible ? "Ocultar palavra-passe" : "Mostrar palavra-passe"} title={visible ? "Ocultar palavra-passe" : "Mostrar palavra-passe"} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">{visible ? <EyeOff /> : <Eye />}</Button></span>{fieldErrors.password && <span className="mt-1 block text-xs text-destructive">{fieldErrors.password}</span>}</label>}
            {mode === "register" && !recovery && <p className="text-xs text-muted-foreground">Mínimo de 8 caracteres, com maiúscula, minúscula e número.</p>}
            {mode === "login" && !recovery && <div className="text-right"><Button variant="link" type="button" onClick={() => { setRecovery(true); setError(""); setFieldErrors({}); }} className="h-auto p-0 text-sm font-semibold text-gold">Esqueceu a palavra-passe?</Button></div>}
            {error && <p role="alert" className="border-l-2 border-destructive bg-surface p-3 text-sm text-destructive">{error}</p>}
            <Button variant="game" type="submit" disabled={pending} className="mt-2 h-14 w-full text-lg">{pending ? "Aguarda..." : recovery ? "ENVIAR LINK" : mode === "register" ? "CRIAR CONTA" : "ENTRAR"}<ArrowRight className="ml-auto" /></Button>
          </form>}
        {mode === "login" && !recovery && <div className="mt-7"><div className="flex items-center gap-4 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /><span>ou</span><span className="h-px flex-1 bg-border" /></div><Button type="button" variant="gameOutline" disabled={pending} onClick={googleSignIn} className="mt-5 h-13 w-full text-sm"><GoogleIcon />Continuar com Google</Button></div>}
      </div>

      {!recovery && <footer className="relative mt-7 text-center text-sm text-muted-foreground">{mode === "register" ? "Já tens uma conta? " : "Ainda não tens uma conta? "}<Link to={mode === "register" ? "/auth" : "/register"} className="font-bold text-gold underline-offset-4 hover:underline">{mode === "register" ? "Entrar" : "Criar conta"}</Link></footer>}
    </div>
  </main>;
}