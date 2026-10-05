/**
 * Your personal details. Edit the values here and they update everywhere
 * on the site (hero, footer, contact section, SEO metadata, JSON-LD).
 *
 * Anything in [square brackets] is a placeholder waiting for real info.
 */
export const site = {
  name: "Abhishek",
  wordmark: "Abhishek.",
  location: "Nepal",
  agency: "DevMark IT Studio",
  roles: ["USA Counsellor", "Digital Marketer", "Graphic Designer"],
  tagline: "Numbers, code & design that grow your brand.",
  /** The word in the tagline that gets the accent colour. */
  accentWord: "grow",
  intro:
    "I'm Abhishek, a USA education counsellor, digital marketer and graphic designer. I guide students toward US universities, and help brands in Nepal and beyond reach the right audience and tell clearer stories.",
  description:
    "Abhishek is a Nepal-based USA education counsellor, digital marketer and graphic designer at DevMark IT Studio, helping students reach US universities and brands grow with marketing and design.",

  email: "[your email]",
  whatsapp: "[number]",
  /** Digits only, with country code, e.g. 9779800000000. Used for the wa.me link. */
  whatsappLink: "",

  socials: [
    { label: "LinkedIn", href: "[url]", icon: "linkedin" },
    { label: "Behance", href: "[url]", icon: "behance" },
    { label: "GitHub", href: "[url]", icon: "github" },
    { label: "Instagram", href: "[url]", icon: "instagram" },
  ] as const,

  /** Years as a USA counsellor, shown in the About counter. Set a number when ready. */
  counsellingYears: null as number | null,

  /** Shown in the "[XX] projects" counter in the About section. Set a number when ready. */
  projectsCount: null as number | null,

  /** Place your photo here. A styled placeholder shows until the file exists. */
  photo: "/images/profile.jpg",

  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
} as const;

export const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
] as const;

/** True when a value is still a [placeholder]. */
export const isPlaceholder = (value: string | null | undefined) =>
  !value || /^\[.*\]$/.test(value.trim());
