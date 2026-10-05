import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TransitionProvider } from "@/components/providers/TransitionProvider";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { Cursor } from "@/components/ui/Cursor";
import { Preloader } from "@/components/ui/Preloader";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { isPlaceholder, site } from "@/data/site";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});
const body = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-instrument",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
  // Only used for small labels: don’t compete with the hero fonts for bandwidth.
  preload: false,
});

const title = `${site.name} — ${site.roles.slice(1).join(", ")} & USA Counsellor`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: `${site.name} Portfolio`,
  authors: [{ name: site.name }],
  creator: site.name,
  keywords: [
    "Abhishek",
    "Nepal",
    "digital marketer Nepal",
    "graphic designer Nepal",
    "USA education counsellor Nepal",
    "study in USA Nepal",
    "DevMark IT Studio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: `${site.name} Portfolio`,
    title,
    description: site.description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0B0D12" },
    { media: "(prefers-color-scheme: light)", color: "#F4F2EC" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Runs before first paint: flags JS for split-text hiding, and skips the
// preloader if it already played in this browser session.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('preloader-seen'))d.setAttribute('data-preloaded','')}catch(e){}})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  image: `${site.url}${site.photo}`,
  jobTitle: site.roles,
  description: site.description,
  address: { "@type": "PostalAddress", addressCountry: "NP" },
  worksFor: { "@type": "Organization", name: site.agency },
  knowsAbout: ["USA Education Counselling", "Student Visas", "Digital Marketing", "SEO", "Graphic Design", "Branding"],
  ...(isPlaceholder(site.email) ? {} : { email: `mailto:${site.email}` }),
  sameAs: site.socials.map((s) => s.href).filter((h) => !isPlaceholder(h)),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable} dark`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <noscript>
          <style>{`.preloader{display:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body>
        <ThemeProvider>
          <MotionProvider>
            <LenisProvider>
              <TransitionProvider>
                <Preloader />
                <ScrollProgress />
                <Navbar />
                {children}
                <Footer />
                <Cursor />
              </TransitionProvider>
            </LenisProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
