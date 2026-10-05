/**
 * All projects live here. Each one powers a card in the Work section and a
 * case study page at /work/[slug].
 *
 * - To add a project: copy an object, give it a unique `slug`, and fill it in.
 * - Images: drop files in /public/images/projects/ and point `cover` / `gallery`
 *   at them. Generated placeholder covers are there until you replace them.
 * - Results: keep the [placeholders] until you have real numbers to share.
 */
export const categories = ["Marketing", "Design", "Strategy"] as const;
export type Category = (typeof categories)[number];

export type Project = {
  slug: string;
  title: string;
  category: Category;
  summary: string;
  role: string;
  year: string;
  tools: string[];
  cover: string;
  gallery: { src: string; alt: string }[];
  challenge: string;
  whatIDid: string[];
  process: { title: string; description: string }[];
  results: { value: string; label: string }[];
};

const img = (slug: string, n: number) => `/images/projects/${slug}-${n}.jpg`;

export const projects: Project[] = [
  {
    slug: "khanchi-darbar-resort",
    title: "Khanchi Darbar Resort",
    category: "Marketing",
    summary: "Social media content and festive campaigns for a resort brand.",
    role: "Social media strategist & designer",
    year: "[year]",
    tools: ["Photoshop", "Illustrator", "Meta Business Suite", "Canva"],
    cover: img("khanchi-darbar-resort", 1),
    gallery: [
      { src: img("khanchi-darbar-resort", 2), alt: "Festive campaign post designs for Khanchi Darbar Resort" },
      { src: img("khanchi-darbar-resort", 3), alt: "Monthly social media content grid for the resort" },
    ],
    challenge:
      "The resort needed a steady, recognisable social presence, with campaigns ready for Dashain, Tihar and other festive seasons when bookings peak.",
    whatIDid: [
      "Planned a monthly content calendar around rooms, food, events and the surrounding area",
      "Designed post and story templates so the feed stayed consistent",
      "Wrote and designed festive campaigns timed to the booking calendar",
    ],
    process: [
      { title: "Audit", description: "Reviewed past posts, competitors and what guests were already sharing." },
      { title: "Calendar", description: "Mapped content pillars and festival dates into a monthly plan." },
      { title: "Create", description: "Designed templates, wrote captions and prepared campaign assets." },
      { title: "Review", description: "Checked reach and enquiries each month and adjusted the mix." },
    ],
    results: [
      { value: "[XX%]", label: "Growth in followers" },
      { value: "[XX]", label: "Campaigns delivered" },
      { value: "[XX%]", label: "Change in booking enquiries" },
    ],
  },
  {
    slug: "devmark-agency-website",
    title: "DevMark Agency Website",
    category: "Design",
    summary: "Visual design and motion direction for a digital agency's website.",
    role: "UI & visual designer",
    year: "[year]",
    tools: ["Figma", "Illustrator", "After Effects"],
    cover: img("devmark-agency-website", 1),
    gallery: [
      { src: img("devmark-agency-website", 2), alt: "Home page hero of the DevMark agency website" },
      { src: img("devmark-agency-website", 3), alt: "Services and case study layout on the DevMark website" },
    ],
    challenge:
      "DevMark IT Studio needed a website design that shows its craft in the first five seconds and stays clear and easy to use on mobile.",
    whatIDid: [
      "Designed the layout, type system and motion language in Figma",
      "Created the visual style for the services and case study pages",
      "Prepared design handoff files with motion notes for the build team",
    ],
    process: [
      { title: "Discovery", description: "Defined the services, audience and the story the site needed to tell." },
      { title: "Design", description: "Created wireframes, then a high-fidelity design with motion notes." },
      { title: "Prototype", description: "Built an interactive prototype to test the flow and motion." },
      { title: "Handoff", description: "Delivered specs, assets and motion notes to the developers." },
    ],
    results: [
      { value: "[XX]", label: "Pages designed" },
      { value: "[XX]", label: "Reusable components" },
      { value: "[XX%]", label: "Change in contact enquiries" },
    ],
  },
  {
    slug: "real-estate-platform",
    title: "Real Estate Platform",
    category: "Design",
    summary: "UX and UI design for a property listing, search and enquiry platform.",
    role: "Product designer",
    year: "[year]",
    tools: ["Figma", "FigJam"],
    cover: img("real-estate-platform", 1),
    gallery: [
      { src: img("real-estate-platform", 2), alt: "Property search results with filters" },
      { src: img("real-estate-platform", 3), alt: "Property detail page with gallery and enquiry form" },
    ],
    challenge:
      "Buyers needed a simple way to search and compare properties, and agents needed to manage listings without technical help.",
    whatIDid: [
      "Mapped the buyer, agent and admin journeys",
      "Designed search, filtering and property detail pages",
      "Designed listing management and enquiry flows",
    ],
    process: [
      { title: "Research", description: "Studied how people search for property and where they drop off." },
      { title: "Structure", description: "Planned how listings, agents and enquiries connect." },
      { title: "Design", description: "Designed the search experience and admin dashboard." },
      { title: "Iterate", description: "Refined filters and forms after testing with agents." },
    ],
    results: [
      { value: "[XX]", label: "Listings managed" },
      { value: "[XX%]", label: "Enquiry conversion rate" },
      { value: "[XX]", label: "Agents onboarded" },
    ],
  },
  {
    slug: "ride-sharing-app-nepal",
    title: "Ride-Sharing App for Nepal",
    category: "Strategy",
    summary: "System planning for rider, driver and admin apps.",
    role: "Product planner & designer",
    year: "[year]",
    tools: ["Figma", "FigJam", "Notion"],
    cover: img("ride-sharing-app-nepal", 1),
    gallery: [
      { src: img("ride-sharing-app-nepal", 2), alt: "Rider app booking flow screens" },
      { src: img("ride-sharing-app-nepal", 3), alt: "Admin dashboard concept for managing drivers and trips" },
    ],
    challenge:
      "A ride-sharing service in Nepal has to work with local payment habits, patchy connectivity and three very different users: riders, drivers and admins.",
    whatIDid: [
      "Planned the rider, driver and admin systems and how they talk to each other",
      "Designed core flows: booking, matching, trip tracking and payments",
      "Wrote feature specs and a phased roadmap for development",
    ],
    process: [
      { title: "Map", description: "Mapped every actor, trip state and edge case." },
      { title: "Flows", description: "Designed key screens for each of the three apps." },
      { title: "Spec", description: "Documented features, data and priorities for the build team." },
      { title: "Roadmap", description: "Split the work into an MVP and later phases." },
    ],
    results: [
      { value: "[XX]", label: "Screens designed" },
      { value: "[X]", label: "Apps planned" },
      { value: "[XX]", label: "Features specified" },
    ],
  },
  {
    slug: "nova-decor",
    title: "Nova Decor",
    category: "Strategy",
    summary: "A growth proposal for a furniture brand.",
    role: "Growth strategist",
    year: "[year]",
    tools: ["Google Analytics", "Meta Ads", "Excel", "Figma"],
    cover: img("nova-decor", 1),
    gallery: [
      { src: img("nova-decor", 2), alt: "Nova Decor growth proposal cover and summary pages" },
      { src: img("nova-decor", 3), alt: "Channel plan and budget breakdown from the Nova Decor proposal" },
    ],
    challenge:
      "Nova Decor wanted to grow online sales but had no clear picture of which channels and budgets would pay back.",
    whatIDid: [
      "Reviewed the brand's current channels, audience and competitors",
      "Built a channel plan with budgets and expected returns",
      "Designed the proposal deck so the numbers were easy to follow",
    ],
    process: [
      { title: "Audit", description: "Looked at the website, social channels and sales data." },
      { title: "Model", description: "Built budget and return scenarios in a spreadsheet." },
      { title: "Plan", description: "Prioritised channels and set a 90-day roadmap." },
      { title: "Present", description: "Turned the plan into a clear, designed proposal." },
    ],
    results: [
      { value: "[XX%]", label: "Projected revenue growth" },
      { value: "[XX]", label: "Day roadmap" },
      { value: "[X]", label: "Channels prioritised" },
    ],
  },
  {
    slug: "connectuni-brand-video",
    title: "ConnectUni Brand Video",
    category: "Design",
    summary: "Hero video script and animation for an education brand.",
    role: "Scriptwriter & motion designer",
    year: "[year]",
    tools: ["After Effects", "Illustrator", "Premiere Pro"],
    cover: img("connectuni-brand-video", 1),
    gallery: [
      { src: img("connectuni-brand-video", 2), alt: "Storyboard frames from the ConnectUni brand video" },
      { src: img("connectuni-brand-video", 3), alt: "Animated title cards from the ConnectUni video" },
    ],
    challenge:
      "ConnectUni needed a short hero video that explains what it does in under a minute and works with the sound off.",
    whatIDid: [
      "Wrote the script around a single, clear student story",
      "Created the storyboard and visual style",
      "Animated the final video with captions for silent autoplay",
    ],
    process: [
      { title: "Brief", description: "Agreed the message, audience and where the video would play." },
      { title: "Script", description: "Drafted and tightened the script to fit the runtime." },
      { title: "Storyboard", description: "Sketched every scene and the transitions between them." },
      { title: "Animate", description: "Produced, captioned and exported the final cuts." },
    ],
    results: [
      { value: "[XX]s", label: "Final runtime" },
      { value: "[XX%]", label: "Average watch-through rate" },
      { value: "[XX]", label: "Formats delivered" },
    ],
  },
  {
    slug: "annapurna-dental-blog",
    title: "Annapurna Dental Blog",
    category: "Marketing",
    summary: "SEO content for dental tourism.",
    role: "SEO content writer",
    year: "[year]",
    tools: ["Google Search Console", "Ahrefs", "WordPress", "Google Docs"],
    cover: img("annapurna-dental-blog", 1),
    gallery: [
      { src: img("annapurna-dental-blog", 2), alt: "Blog article layout for Annapurna Dental" },
      { src: img("annapurna-dental-blog", 3), alt: "Keyword cluster map for dental tourism content" },
    ],
    challenge:
      "Annapurna Dental wanted to reach international patients researching dental treatment in Nepal, a niche with little quality content.",
    whatIDid: [
      "Researched the questions overseas patients ask before travelling",
      "Built keyword clusters and an editorial calendar",
      "Wrote and optimised articles for search and for trust",
    ],
    process: [
      { title: "Research", description: "Found the search terms and questions that matter to patients." },
      { title: "Cluster", description: "Grouped keywords into topics with a pillar page for each." },
      { title: "Write", description: "Produced clear, accurate articles reviewed by the clinic." },
      { title: "Measure", description: "Tracked rankings and traffic in Search Console." },
    ],
    results: [
      { value: "[XX]", label: "Articles published" },
      { value: "[XX%]", label: "Growth in organic traffic" },
      { value: "[XX]", label: "Keywords on page one" },
    ],
  },
  {
    slug: "bagmati-school-proposal",
    title: "Bagmati School Proposal",
    category: "Strategy",
    summary: "A marketing proposal for a school.",
    role: "Marketing strategist",
    year: "[year]",
    tools: ["Excel", "Figma", "Google Slides"],
    cover: img("bagmati-school-proposal", 1),
    gallery: [
      { src: img("bagmati-school-proposal", 2), alt: "Admissions funnel from the Bagmati School proposal" },
      { src: img("bagmati-school-proposal", 3), alt: "Campaign calendar pages from the proposal" },
    ],
    challenge:
      "Bagmati School wanted more admissions enquiries before the new academic year without overspending its budget.",
    whatIDid: [
      "Mapped how parents discover and choose schools locally",
      "Proposed a campaign mix across social, search and community events",
      "Costed the plan and set targets for each stage of admissions",
    ],
    process: [
      { title: "Listen", description: "Met the school team to understand goals and constraints." },
      { title: "Research", description: "Looked at competing schools and parent decision factors." },
      { title: "Plan", description: "Built the campaign calendar and budget." },
      { title: "Propose", description: "Presented a designed proposal with clear targets." },
    ],
    results: [
      { value: "[XX%]", label: "Target growth in enquiries" },
      { value: "[XX]", label: "Week campaign plan" },
      { value: "[X]", label: "Channels in the mix" },
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const getNextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
