type IdeaSlugInput = {
  id: number;
  title: string;
};

export function slugifyIdeaTitle(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}

export function buildIdeaSlug(input: IdeaSlugInput) {
  const base = slugifyIdeaTitle(input.title) || `idea-${input.id}`;
  return `${base}-${input.id}`;
}

export function parseIdeaIdFromSlug(slug: string) {
  const match = slug.match(/-(\d+)$/);
  if (!match) {
    return null;
  }

  const id = Number(match[1]);
  return Number.isInteger(id) && id > 0 ? id : null;
}