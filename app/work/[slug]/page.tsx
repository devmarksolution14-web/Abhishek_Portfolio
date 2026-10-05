import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/sections/CaseStudy";
import { NextProject } from "@/components/sections/NextProject";
import { getNextProject, getProject, projects } from "@/data/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const description = `${project.summary} ${project.challenge}`.slice(0, 160);
  return {
    title: project.title,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      url: `/work/${project.slug}`,
      title: project.title,
      description,
      images: [{ url: project.cover, width: 1600, height: 1200, alt: `${project.title} cover` }],
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main id="main" tabIndex={-1} className="overflow-x-clip outline-none">
      <CaseStudy project={project} index={projects.indexOf(project)} />
      <NextProject project={getNextProject(slug)} />
    </main>
  );
}
