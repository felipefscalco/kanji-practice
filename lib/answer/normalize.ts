export function normalizeAnswer(input: string): string {
  return input
    .trim()
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[.,;:!?]/g, "");
}
