import { MagneticButton } from "@/components/ui/MagneticButton";

export default function NotFound() {
  return (
    <main id="main" className="container-page flex min-h-[80svh] flex-col justify-center pt-[var(--nav-h)]">
      <p className="text-label text-accent-ink">404</p>
      <h1 className="text-hero mt-4 max-w-[12ch]">This page took a wrong turn.</h1>
      <p className="text-lead mt-6 max-w-lg text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <div className="mt-10">
        <MagneticButton href="/">Back to home</MagneticButton>
      </div>
    </main>
  );
}
