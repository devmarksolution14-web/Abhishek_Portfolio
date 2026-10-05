"use client";

import { Compass, Leaf, Mountain, Sparkles, Sun, type LucideIcon } from "lucide-react";
import { m } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { clients, type Client } from "@/data/clients";
import { gsap, MQ } from "@/lib/gsap";
import { useDeferredGSAP } from "@/lib/gsap-queue";

const iconMap: Record<Client["icon"], LucideIcon> = {
  mountain: Mountain,
  sun: Sun,
  leaf: Leaf,
  compass: Compass,
  sparkles: Sparkles,
};

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * "Clients" logo strip. GSAP staggers each cell in on scroll (outer <li>);
 * Motion handles the hover lift and icon spin (inner elements).
 */
export function Clients() {
  const root = useRef<HTMLElement>(null);

  useDeferredGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(".client-cell", {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".client-grid", start: "top 88%", once: true },
        });
        gsap.from(".client-intro", {
          x: -30,
          autoAlpha: 0,
          duration: 0.9,
          scrollTrigger: { trigger: ".client-grid", start: "top 88%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="clients-title" className="pb-[calc(var(--section-y)*0.5)] pt-10">
      <div className="container-page grid items-center gap-8 lg:grid-cols-12">
        <div className="client-intro lg:col-span-3">
          <p className="text-label text-muted">Clients</p>
          <h2 id="clients-title" className="mt-3 font-display text-xl font-bold leading-tight tracking-[-0.02em]">
            Trusted by brands and students who want to grow.
          </h2>
        </div>

        <ul className="client-grid grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-border bg-border lg:col-span-9 lg:grid-cols-5">
          {clients.map((client, i) => (
            <li key={client.name} className={`client-cell bg-bg ${i === clients.length - 1 && clients.length % 2 === 1 ? "col-span-2 lg:col-span-1" : ""}`}>
              <ClientLogo client={client} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ClientLogo({ client }: { client: Client }) {
  const Icon = iconMap[client.icon];
  return (
    <m.div
      className="group flex h-28 flex-col items-center justify-center gap-1.5 px-4 text-muted transition-colors duration-300 hover:text-text"
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <m.div
        className="flex items-center gap-2"
        variants={{ rest: { y: 0 }, hover: { y: -3 } }}
        transition={{ duration: 0.4, ease }}
      >
        {client.logo ? (
          <Image src={client.logo} alt={`${client.name} logo`} width={120} height={32} className="h-8 w-auto opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
        ) : (
          <>
            <m.span
              aria-hidden="true"
              className="inline-flex text-current transition-colors duration-300 group-hover:text-accent-ink"
              variants={{ rest: { rotate: 0, scale: 1 }, hover: { rotate: -12, scale: 1.12 } }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Icon size={20} strokeWidth={2} />
            </m.span>
            <span className="whitespace-nowrap font-display text-base font-bold tracking-[-0.03em] xl:text-lg">{client.name}</span>
          </>
        )}
      </m.div>
      <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em]">{client.sector}</span>
    </m.div>
  );
}
