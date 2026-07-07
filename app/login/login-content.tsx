import { LoginForm } from "./login-form";

export function LoginContent() {
  return (
    <main className="login-luxury relative min-h-screen overflow-hidden bg-[var(--port-ink)] text-[var(--port-ivory)]">
      <div
        className="absolute inset-0 scale-[1.03] bg-cover bg-center"
        style={{ backgroundImage: "url('/dp-world-login-bg.png')" }}
      />
      <div className="login-noise absolute inset-0" />
      <div className="login-grid absolute inset-0" />
      <div className="login-grain absolute inset-0" />

      <section className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center px-5 py-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-12">
        <div className="login-reveal-mark max-w-2xl pb-8 pt-4 lg:-translate-y-8">
          <img
            src="/dp-world-logo-transparent.png"
            alt="DP World"
            className="h-auto w-56 object-contain drop-shadow-[0_6px_18px_rgba(255,255,255,0.52)]"
          />
        </div>

        <div className="login-reveal-panel login-panel mx-auto w-full max-w-[440px] p-px shadow-[0_36px_100px_rgba(0,0,0,0.55)] lg:translate-x-8">
          <div className="relative overflow-hidden px-7 py-7 sm:px-9">
            <div className="login-scan pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/12 to-transparent" />
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
