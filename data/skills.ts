/**
 * Skills / services shown in the Skills section, and the words in the marquee.
 * `icon` must be one of the keys in components/sections/Skills.tsx (iconMap).
 */
export type Skill = {
  title: string;
  icon: "counselling" | "marketing" | "design";
  description: string;
  tags: string[];
};

export const skills: Skill[] = [
  {
    title: "USA Education Counselling",
    icon: "counselling",
    description:
      "Guidance for students planning to study in the USA, from shortlisting universities and preparing applications to getting ready for the visa interview.",
    tags: ["University Selection", "Applications", "SOP Review", "F-1 Visa Prep", "Scholarships"],
  },
  {
    title: "Digital Marketing",
    icon: "marketing",
    description:
      "Social media content, festive campaigns and SEO articles built around what your audience actually searches for and shares.",
    tags: ["Social Media", "SEO", "Content Calendars", "Campaigns", "Video Scripts"],
  },
  {
    title: "Graphic Design",
    icon: "design",
    description:
      "Brand identities, social graphics and proposal decks that look considered and stay consistent across every channel.",
    tags: ["Branding", "UI Design", "Social Graphics", "Pitch Decks", "Motion"],
  },
];

export const marqueeItems = [
  "USA Counselling",
  "Social Media",
  "Content Strategy",
  "Branding",
  "SEO",
  "UI Design",
  "Student Visas",
  "Video Scripts",
];

/** The four steps in the Process section. */
export const processSteps = [
  {
    title: "Listen",
    description:
      "We start with your goals, numbers and audience. I ask the awkward questions early so nothing surprises us later.",
  },
  {
    title: "Plan",
    description:
      "A clear scope, timeline and budget, with the metrics we will use to judge success written down before any work begins.",
  },
  {
    title: "Build",
    description:
      "Design and content made in short cycles, with something real for you to review every week.",
  },
  {
    title: "Grow",
    description:
      "Launch, measure and improve. I track what moves the numbers and double down on what works.",
  },
];

/**
 * Testimonials. These are DUMMY quotes from made-up people at the dummy
 * clients in data/clients.ts, so the carousel looks complete.
 * `sample: true` shows a small "Sample" tag on the card. Replace each one with
 * a real quote (with the client's permission) and set `sample: false`.
 */
export type Testimonial = { quote: string; name: string; role: string; sample?: boolean };

export const testimonials: Testimonial[] = [
  {
    quote:
      "Abhishek planned our festive campaign end to end. The content felt like us, went out on time, and our enquiries picked up within the first week.",
    name: "Riya Shrestha",
    role: "Marketing Lead, Northpeak",
    sample: true,
  },
  {
    quote:
      "He helped me shortlist universities I hadn't even considered, reviewed my SOP three times and prepared me for the visa interview. I felt ready walking in.",
    name: "Aarav Karki",
    role: "Student, now studying in the USA",
    sample: true,
  },
  {
    quote:
      "Our brand finally looks consistent everywhere, from Instagram to our proposal decks. Clients notice the difference.",
    name: "Sneha Gurung",
    role: "Founder, Lumina Studio",
    sample: true,
  },
  {
    quote:
      "Clear plan, honest advice and no wasted budget. He tells you what will work and what won't, then delivers.",
    name: "Bikash Thapa",
    role: "Director, Trailmark",
    sample: true,
  },
  {
    quote:
      "The social content and visuals he created gave our wellness brand a voice. Engagement has grown steadily since we started working together.",
    name: "Anisha Rai",
    role: "Co-founder, Everleaf",
    sample: true,
  },
];

/** Options for the contact form. */
export const serviceOptions = [
  "USA Counselling",
  "Digital Marketing",
  "Graphic Design",
  "Something else",
] as const;

export const budgetOptions = [
  "Under $500",
  "$500 – $1,500",
  "$1,500 – $5,000",
  "$5,000+",
  "Not sure yet",
] as const;
