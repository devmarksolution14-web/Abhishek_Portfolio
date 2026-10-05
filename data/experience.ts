/**
 * Timeline entries for the Experience section, newest first.
 * Replace the [year] placeholders with real dates.
 */
export type ExperienceItem = {
  period: string;
  role: string;
  org: string;
  description: string;
  highlights: string[];
};

export const experience: ExperienceItem[] = [
  {
    period: "[year] – Present",
    role: "Digital Marketer & Graphic Designer",
    org: "DevMark IT Studio",
    description:
      "Running marketing and design projects for clients in hospitality, real estate, education and healthcare.",
    highlights: [
      "Social media content and festive campaigns for resorts and brands",
      "Brand identities, social graphics and pitch decks",
      "Growth proposals, brand videos and SEO content",
    ],
  },
  {
    period: "[year] – [year]",
    role: "USA Education Counsellor",
    org: "[Consultancy name]",
    description:
      "Guided students from Nepal through every step of applying to study in the USA.",
    highlights: [
      "Helped students shortlist US universities that fit their goals and budget",
      "Reviewed SOPs, documents and scholarship applications",
      "Prepared students for F-1 visa interviews",
    ],
  },
  {
    period: "[year]",
    role: "Bachelor's Degree",
    org: "[University / College]",
    description: "[Field of study]",
    highlights: [],
  },
];
