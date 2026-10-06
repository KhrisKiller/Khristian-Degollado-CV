import type { Lang } from "@/lib/i18n/types";

/** Personal details in one place — every contact button on the site reads from here. */
export const profile = {
  name: "Khristian Degollado",
  brand: "KHRISTIAN.DEV",
  email: "khristiandegollado02@gmail.com",
  linkedin: "https://www.linkedin.com/in/khristian-degollado",
  github: "https://github.com/KhrisKiller",
  /** International format, digits only (used for wa.me links). */
  whatsapp: "524401468119",
  cv: {
    en: "/cv/Khristian-Degollado-CV.pdf",
    es: "/cv/Khristian-Degollado-CV-ES.pdf",
  } satisfies Record<Lang, string>,
} as const;

export function whatsappHref(message: string) {
  return `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(message)}`;
}
