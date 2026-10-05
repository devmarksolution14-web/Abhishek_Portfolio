"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, LoaderCircle, Send } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { budgetOptions, serviceOptions } from "@/data/skills";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * The contact form (React Hook Form + Zod) and its success state.
 * Loaded lazily by Contact.tsx when the section nears the viewport, so the
 * form libraries stay out of the initial page bundle.
 */
export default function ContactFormPanel() {
  const [sent, setSent] = useState(false);
  return (
    <AnimatePresence mode="wait" initial={false}>
      {sent ? (
        <Success key="success" onReset={() => setSent(false)} />
      ) : (
        <m.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4, ease }}>
          <ContactForm onSent={() => setSent(true)} />
        </m.div>
      )}
    </AnimatePresence>
  );
}

function ContactForm({ onSent }: { onSent: () => void }) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", services: [], message: "", company: "" },
    mode: "onTouched",
  });

  const onSubmit = async (data: ContactInput) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      onSent();
    } catch (err) {
      setError("root", { message: err instanceof Error ? err.message : "Something went wrong." });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-7" aria-describedby={errors.root ? "form-error" : undefined}>
      <div className="grid gap-7 sm:grid-cols-2">
        <Field id="name" label="Your name" error={errors.name?.message}>
          <input id="name" type="text" autoComplete="name" className={inputClass(!!errors.name)} {...aria("name", errors.name?.message)} {...register("name")} />
        </Field>
        <Field id="email" label="Email address" error={errors.email?.message}>
          <input id="email" type="email" autoComplete="email" inputMode="email" className={inputClass(!!errors.email)} {...aria("email", errors.email?.message)} {...register("email")} />
        </Field>
      </div>

      {/* Honeypot for bots: hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      <fieldset aria-describedby={errors.services ? "services-error" : undefined}>
        <legend className="mb-3 text-sm font-medium">What can I help with?</legend>
        <Controller
          control={control}
          name="services"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {serviceOptions.map((opt) => {
                const checked = field.value?.includes(opt);
                return (
                  <label key={opt} className="relative">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={checked}
                      onBlur={field.onBlur}
                      onChange={(e) =>
                        field.onChange(e.target.checked ? [...(field.value ?? []), opt] : field.value.filter((v) => v !== opt))
                      }
                    />
                    <m.span
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "inline-flex min-h-11 cursor-pointer select-none items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-ink",
                        checked ? "border-accent bg-accent text-accent-contrast" : "border-border text-text hover:border-text",
                      )}
                    >
                      {checked && <Check size={14} aria-hidden="true" />}
                      {opt}
                    </m.span>
                  </label>
                );
              })}
            </div>
          )}
        />
        <ErrorText id="services-error" message={errors.services?.message} />
      </fieldset>

      <fieldset aria-describedby={errors.budget ? "budget-error" : undefined}>
        <legend className="mb-3 text-sm font-medium">Budget range (USD)</legend>
        <div className="flex flex-wrap gap-2">
          {budgetOptions.map((opt) => (
            <label key={opt} className="relative">
              <input type="radio" value={opt} className="peer sr-only" {...register("budget")} />
              <span className="inline-flex min-h-11 cursor-pointer select-none items-center rounded-full border border-border px-4 py-2 text-sm transition-colors duration-200 hover:border-text peer-checked:border-accent peer-checked:bg-accent peer-checked:text-accent-contrast peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-ink">
                {opt}
              </span>
            </label>
          ))}
        </div>
        <ErrorText id="budget-error" message={errors.budget?.message} />
      </fieldset>

      <Field id="message" label="Project details" error={errors.message?.message}>
        <textarea
          id="message"
          rows={5}
          className={cn(inputClass(!!errors.message), "resize-y")}
          placeholder="Goals, timeline, links… anything that helps."
          {...aria("message", errors.message?.message)}
          {...register("message")}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-5">
        <MagneticButton type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoaderCircle size={18} className="animate-spin" aria-hidden="true" /> Sending…
            </>
          ) : (
            <>
              Send message <Send size={16} aria-hidden="true" />
            </>
          )}
        </MagneticButton>
        <AnimatePresence>
          {errors.root?.message && (
            <m.p
              id="form-error"
              role="alert"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-danger"
            >
              {errors.root.message}
            </m.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

const inputClass = (invalid: boolean) =>
  cn(
    "w-full rounded-2xl border bg-bg px-4 py-3.5 text-text placeholder:text-muted/80 transition-colors duration-200 focus:outline-none focus-visible:border-accent-ink focus-visible:outline-none",
    invalid ? "border-danger" : "border-border hover:border-muted",
  );

const aria = (id: string, error?: string) => ({
  "aria-invalid": error ? true : undefined,
  "aria-describedby": error ? `${id}-error` : undefined,
});

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      {children}
      <ErrorText id={`${id}-error`} message={error} />
    </div>
  );
}

function ErrorText({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <m.p
          id={id}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-2 text-sm text-danger"
        >
          {message}
        </m.p>
      )}
    </AnimatePresence>
  );
}

function Success({ onReset }: { onReset: () => void }) {
  return (
    <m.div
      role="status"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease }}
      className="flex min-h-[28rem] flex-col items-start justify-center gap-6"
    >
      <m.svg width="88" height="88" viewBox="0 0 88 88" aria-hidden="true">
        <m.circle
          cx="44"
          cy="44"
          r="40"
          fill="var(--accent)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          style={{ transformOrigin: "44px 44px" }}
        />
        <m.path
          d="M27 45 l11 11 l23 -24"
          fill="none"
          stroke="var(--accent-contrast)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
        />
      </m.svg>
      <h3 className="text-h2">Message sent.</h3>
      <p className="max-w-md text-muted">Thanks for reaching out. I&apos;ll read your message and get back to you soon, usually within one working day.</p>
      <button type="button" onClick={onReset} className="text-sm font-semibold underline decoration-accent decoration-2 underline-offset-4">
        Send another message
      </button>
    </m.div>
  );
}
