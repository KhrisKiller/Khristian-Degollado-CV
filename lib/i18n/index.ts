import en, { type Dictionary } from "./en";
import es from "./es";
import type { Lang } from "./types";

export const dictionaries: Record<Lang, Dictionary> = { en, es };
export type { Dictionary };
export * from "./types";
