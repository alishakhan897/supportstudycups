// src/utils/seo.ts

export const toSeoSlug = (text: string = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/\([^)]*\)/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const toCourseSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/\[.*?\]/g, "")      // strip [PGP-FABM]
    .replace(/\([^)]*\)/g, "")    // strip (nested)
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")         // spaces → hyphens
    .replace(/-+/g, "-")          // collapse multiple hyphens
    .replace(/^-+|-+$/g, "");     // ❗ trim leading/trailing hyphens

export const normalize = (text?: string | null) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/\([^)]*\)/g, "")
    .replace(/[^a-z0-9]/g, "");
};

