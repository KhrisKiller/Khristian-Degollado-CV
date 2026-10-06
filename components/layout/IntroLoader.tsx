/**
 * Server-rendered, CSS-only intro. It never blocks content: the page renders
 * underneath and the overlay fades out on its own (~1.2s), even without JS.
 * Skipped on repeat visits within a session and for reduced-motion users.
 */
export function IntroLoader() {
  return (
    <div
      aria-hidden
      className="intro-loader pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-ink-950"
    >
      <div className="flex flex-col items-center">
        <span className="intro-loader__mark text-5xl font-semibold tracking-[-0.06em] text-fg">
          K<span className="text-accent">D</span>
        </span>
        <span className="intro-loader__bar mt-5 h-px w-28 bg-gradient-to-r from-transparent via-accent to-transparent" />
        <span className="intro-loader__label mt-4 font-mono text-[11px] uppercase tracking-[0.32em] text-fg-subtle">
          <span className="intro-l-en">Digital portfolio</span>
          <span className="intro-l-es">Portafolio digital</span>
        </span>
      </div>
    </div>
  );
}
