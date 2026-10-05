import type { ReactNode } from "react";
import { SplitText } from "@/components/ui/SplitText";
import { cn } from "@/lib/utils";

type Props = {
  index: string;
  label: string;
  title: ReactNode;
  id?: string;
  description?: ReactNode;
  className?: string;
};

/** Numbered mono label + split-text heading, left aligned. */
export function SectionHeading({ index, label, title, id, description, className }: Props) {
  return (
    <div className={cn("grid gap-6 md:grid-cols-12 md:items-end", className)}>
      <div className="md:col-span-8">
        <p className="mb-5 flex items-center gap-3 text-label text-muted">
          <span className="text-accent-ink">{index}</span>
          <span className="h-px w-8 bg-border" aria-hidden="true" />
          {label}
        </p>
        <SplitText as="h2" id={id} className="text-h2 max-w-[18ch] text-balance">
          {title}
        </SplitText>
      </div>
      {description && <div className="text-muted md:col-span-4 md:pb-2">{description}</div>}
    </div>
  );
}
