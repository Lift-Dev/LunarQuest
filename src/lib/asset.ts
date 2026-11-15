/**
 * Builds the URL of a file in `public/`, so the game works both at the site
 * root (Vercel) and inside a sub-folder (GitHub Pages: /LunarQuest/).
 */
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, '');
}
