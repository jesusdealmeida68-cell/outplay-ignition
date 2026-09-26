import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loginSchema, registerSchema, emailSchema } from "@/lib/auth-validation";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

const heroArt = "/hero-key-art.png";

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

const STEPS = ["Entrar", "Verificar", "Confirmar"];

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
      setFieldErrors(parsed.error.issues.reduce<Record<string, string>>((errors, issue) => {
        const field = String(issue.path[0]);
        if (!errors[field]) errors[field] = issue.message;
        return errors;
      }, {}));
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

  const stepIndex = recovery ? 1 : 0;

  return <main className="relative flex min-h-dvh flex-col bg-white">
    {/* Blue header with step progress, like the reference design */}
    <div className="relative overflow-hidden bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] pb-6 pt-[max(20px,env(safe-area-inset-top))]">
      <img src={heroArt} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-luminosity" />
      <div className="relative mx-auto flex w-full max-w-[460px] items-center justify-between px-6">
        <span className="font-display text-lg font-black uppercase tracking-wide text-white">OUTPLAY</span>
        <Link to="/" aria-label="Fechar" className="flex size-9 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10"><X className="size-5" /></Link>
      </div>
      <div className="relative mx-auto mt-5 w-full max-w-[460px] px-6">
        <div className="flex items-center justify-between text-xs font-semibold text-white/70">
          {STEPS.map((step, index) => <span key={step} className={index === stepIndex ? "text-white" : ""}>{step}</span>)}
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/25">
          <div className="h-full rounded-full bg-white transition-all" style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>
    </div>

    {/* White card */}
    <div className="relative mx-auto flex w-full max-w-[460px] flex-1 flex-col px-6 pb-10 pt-8 sm:px-8">
      <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[#EFF4FF]">
        <Mail className="size-9 text-[#2563EB]" />
      </div>
      <h1 className="mt-6 text-center text-2xl font-bold text-[#0F172A]">{recovery ? "Recuperar acesso" : mode === "register" ? "Criar conta" : "Entrar"}</h1>
      <p className="mt-2 text-center text-sm text-[#64748B]">{recovery ? "Indica o teu e-mail para receberes um link de acesso." : mode === "register" ? "Indica os teus dados para criar a tua conta OUTPLAY." : "Indica o teu e-mail e palavra-passe para entrar."}</p>

      {sent ? <div className="mt-8 rounded-xl bg-[#EFF4FF] p-4 text-sm leading-relaxed text-[#1E3A8A]">Se existir uma conta com este e-mail, receberás um link para redefinir a palavra-passe.</div> :
        <form onSubmit={submit} noValidate className="mt-7 space-y-4">
          {mode === "register" && !recovery && <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-[#475569]">Nome de jogador</span>
            <input autoComplete="nickname" maxLength={24} value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder="O teu nome na arena" aria-invalid={Boolean(fieldErrors["playerName"])} className="h-13 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-base text-[#0F172A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20" />
            {fieldErrors["playerName"] && <span className="mt-1 block text-xs text-red-600">{fieldErrors["playerName"]}</span>}
          </label>}
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-[#475569]">E-mail</span>
            <input type="email" inputMode="email" autoComplete="email" maxLength={255} value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email" aria-invalid={Boolean(fieldErrors["email"])} className="h-13 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-base text-[#0F172A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20" />
            {fieldErrors["email"] && <span className="mt-1 block text-xs text-red-600">{fieldErrors["email"]}</span>}
          </label>
          {!recovery && <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-[#475569]">Palavra-passe</span>
            <span className="relative block">
              <input type={visible ? "text" : "password"} autoComplete={mode === "register" ? "new-password" : "current-password"} maxLength={128} value={password} onChange={e => setPassword(e.target.value)} placeholder="A tua palavra-passe" aria-invalid={Boolean(fieldErrors["password"])} className="h-13 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 pr-12 text-base text-[#0F172A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20" />
              <Button variant="ghost" size="icon" type="button" onClick={() => setVisible(!visible)} aria-label={visible ? "Ocultar palavra-passe" : "Mostrar palavra-passe"} className="absolute right-1 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:bg-transparent hover:text-[#2563EB]">{visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}</Button>
            </span>
            {fieldErrors["password"] && <span className="mt-1 block text-xs text-red-600">{fieldErrors["password"]}</span>}
          </label>}
          {mode === "register" && !recovery && <p className="text-xs text-[#94A3B8]">Mínimo de 8 caracteres, com maiúscula, minúscula e número.</p>}
          {mode === "login" && !recovery && <div className="text-right"><Button variant="link" type="button" onClick={() => { setRecovery(true); setError(""); setFieldErrors({}); }} className="h-auto p-0 text-sm font-semibold text-[#2563EB]">Esqueceste a palavra-passe?</Button></div>}
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <div className="flex gap-3 pt-2">
            {recovery ? <Button type="button" variant="outline" onClick={() => { setRecovery(false); setSent(false); setError(""); }} className="h-13 flex-1 rounded-xl border-[#E2E8F0] text-[#475569]">CANCELAR</Button> : <Link to="/" className="flex h-13 flex-1 items-center justify-center rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] transition-colors hover:bg-[#F8FAFC]">CANCELAR</Link>}
            <Button type="submit" disabled={pending} className="h-13 flex-1 rounded-xl bg-[#2563EB] text-sm font-semibold text-white hover:bg-[#1D4ED8]">{pending ? "Aguarda..." : recovery ? "ENVIAR" : mode === "register" ? "CRIAR CONTA" : "ENTRAR"}</Button>
          </div>
        </form>}

      {mode === "login" && !recovery && <div className="mt-6">
        <div className="flex items-center gap-3 text-xs font-medium text-[#94A3B8]"><span className="h-px flex-1 bg-[#E2E8F0]" />ou<span className="h-px flex-1 bg-[#E2E8F0]" /></div>
        <Button type="button" variant="outline" disabled={pending} onClick={googleSignIn} className="mt-5 h-13 w-full rounded-xl border-[#E2E8F0] text-sm text-[#0F172A] hover:bg-[#F8FAFC]"><GoogleIcon />Continuar com Google</Button>
      </div>}

      {!recovery && <p className="mt-8 text-center text-sm text-[#94A3B8]">{mode === "register" ? "Já tens uma conta? " : "Ainda não tens uma conta? "}<Link to={mode === "register" ? "/auth" : "/register"} className="font-semibold text-[#2563EB] underline-offset-4 hover:underline">{mode === "register" ? "Entrar" : "Criar conta"}</Link></p>}
    </div>
  </main>;
}
