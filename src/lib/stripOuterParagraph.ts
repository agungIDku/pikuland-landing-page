/** Removes a single outer `<p>...</p>` wrapper often returned by rich-text fields. */
export function stripOuterParagraph(html: string): string {
  return html
    .replace(/^\s*<p\b[^>]*>/i, "")
    .replace(/<\/p>\s*$/i, "")
    .trim();
}
