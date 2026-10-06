"use client";

import { Code2, Database, Settings2, Wrench, type LucideIcon } from "lucide-react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PROOF_HREF, skillGroups } from "@/data/skills";

const ICONS: LucideIcon[] = [Settings2, Database, Code2, Wrench];

export function Skills() {
  const { t, l } = useI18n();
  const s = t.skills;
  return (
    <section id="skills" aria-labelledby="skills-title" className="relative border-t border-line py-24 md:py-32">
      <div className="container-page">
        <SectionHeader index="07" eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} titleId="skills-title" />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group, i) => {
            const Icon = ICONS[i];
            const meta = s.groups[i];
            return (
              <Reveal as="li" key={meta.title} delay={i * 70} className="flex flex-col rounded-2xl border border-line bg-ink-900 p-6">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl border border-line-strong bg-ink-800 text-accent-soft">
                    <Icon className="size-[18px]" aria-hidden />
                  </span>
                  <span className="font-mono text-xs text-fg-subtle">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em]">{meta.title}</h3>
                <p className="text-sm text-fg-subtle">{meta.caption}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li key={item.en} className="rounded-lg border border-line bg-white/[0.02] px-2.5 py-1.5 text-[13px] text-fg">
                      {l(item)}
                    </li>
                  ))}
                </ul>
                <p className="mt-auto pt-6 text-xs text-fg-subtle">
                  {s.proof}{" "}
                  {group.proof.map((key, k) => (
                    <span key={key}>
                      {k > 0 ? " · " : ""}
                      <a href={PROOF_HREF[key]} className="text-fg-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent-soft hover:decoration-accent">
                        {s.proofLinks[key]}
                      </a>
                    </span>
                  ))}
                </p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
