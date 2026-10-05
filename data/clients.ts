/**
 * Client logos shown in the "Clients" strip under the hero.
 *
 * These are DUMMY clients (made-up names) so the section looks complete.
 * Replace them with real clients before launch: change `name` and pick an
 * `icon` from components/sections/Clients.tsx (iconMap), or set `logo` to an
 * image in /public (e.g. "/images/clients/acme.svg") to show a real logo.
 */
export type Client = {
  name: string;
  /** Small descriptor under the name. */
  sector: string;
  icon: "mountain" | "sun" | "leaf" | "compass" | "sparkles";
  logo?: string;
};

export const clients: Client[] = [
  { name: "Northpeak", sector: "Travel", icon: "mountain" },
  { name: "Lumina Studio", sector: "Interiors", icon: "sun" },
  { name: "Everleaf", sector: "Wellness", icon: "leaf" },
  { name: "Trailmark", sector: "Education", icon: "compass" },
  { name: "Brightside", sector: "Hospitality", icon: "sparkles" },
];
