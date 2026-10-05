"use client";

import { Check, Copy, MessageCircle } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { SplitText } from "@/components/ui/SplitText";
import { isPlaceholder, site } from "@/data/site";

const ContactFormPanel = dynamic(() => import("./ContactForm"), {
  ssr: false,
  loading: () => <FormSkeleton />,
});

export function Contact() {
  const section = useRef<HTMLElement>(null);
  const [loadForm, setLoadForm] = useState(false);

  // Fetch the form code only when the visitor gets close to this section.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadForm(true);
          io.disconnect();
        }
      },
      { rootMargin: "1200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={section} id="contact" tabIndex={-1} aria-labelledby="contact-title" className="section-y outline-none">
      <div className="container-page">
        <p className="mb-5 flex items-center gap-3 text-label text-muted">
          <span className="text-accent-ink">07</span>
          <span className="h-px w-8 bg-border" aria-hidden="true" />
          Contact
        </p>
        <SplitText as="h2" id="contact-title" className="text-display max-w-[14ch] text-balance">
          Let&apos;s build something that <span className="text-accent-ink">grows.</span>
        </SplitText>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12">
          <aside className="space-y-10 lg:col-span-4">
            <p className="text-lead text-muted">
              Tell me about your brand, your study plans or your next launch. I usually reply within one working day.
            </p>
            <EmailCopy />
            <div>
              <p className="text-label text-muted">WhatsApp</p>
              {site.whatsappLink ? (
                <a href={`https://wa.me/${site.whatsappLink}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 text-lg font-medium hover:text-accent-ink">
                  <MessageCircle size={18} aria-hidden="true" /> {site.whatsapp}
                </a>
              ) : (
                <p className="mt-2 inline-flex items-center gap-2 text-lg font-medium">
                  <MessageCircle size={18} aria-hidden="true" /> {site.whatsapp}
                </p>
              )}
            </div>
            <ul className="flex gap-2">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.label} (opens in a new tab)`}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border transition-colors hover:border-accent hover:text-accent-ink"
                  >
                    <SocialIcon name={s.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <div className="lg:col-span-8">
            <div className="relative rounded-[var(--radius-card)] border border-border bg-surface p-6 sm:p-10">
              {loadForm ? <ContactFormPanel /> : <FormSkeleton />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EmailCopy() {
  const [copied, setCopied] = useState(false);
  const placeholder = isPlaceholder(site.email);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the address is still visible to copy by hand */
    }
  };

  return (
    <div>
      <p className="text-label text-muted">Email</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        {placeholder ? (
          <span className="break-all text-xl font-semibold">{site.email}</span>
        ) : (
          <a href={`mailto:${site.email}`} className="break-all text-xl font-semibold hover:text-accent-ink">
            {site.email}
          </a>
        )}
        <m.button
          type="button"
          onClick={copy}
          whileTap={{ scale: 0.9 }}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-4 text-sm transition-colors hover:border-text"
          aria-label={copied ? "Email copied" : "Copy email address"}
        >
          <AnimatePresence mode="wait" initial={false}>
            <m.span
              key={copied ? "c" : "n"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="inline-flex items-center gap-2"
            >
              {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
              {copied ? "Copied" : "Copy"}
            </m.span>
          </AnimatePresence>
        </m.button>
        <span className="sr-only" aria-live="polite">
          {copied ? "Email address copied to clipboard" : ""}
        </span>
      </div>
    </div>
  );
}

/** Same footprint as the form, shown until its code has loaded (avoids layout shift). */
function FormSkeleton() {
  return (
    <div aria-hidden="true" className="grid min-h-[44rem] animate-pulse content-start gap-7 motion-reduce:animate-none">
      <div className="grid gap-7 sm:grid-cols-2">
        <div className="h-[5.25rem] rounded-2xl bg-bg" />
        <div className="h-[5.25rem] rounded-2xl bg-bg" />
      </div>
      <div className="h-24 rounded-2xl bg-bg" />
      <div className="h-24 rounded-2xl bg-bg" />
      <div className="h-40 rounded-2xl bg-bg" />
      <div className="h-12 w-44 rounded-full bg-bg" />
    </div>
  );
}
