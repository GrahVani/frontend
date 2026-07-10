/**
 * Partitioned dynamic loader.
 * Solves Turbopack OOM by splitting 860+ chunks into small alphabetical buckets.
 */

export async function loadInteractive(slug: string) {
  let char = slug[0].toLowerCase();
  if (!/[a-z]/.test(char)) char = "other";
  
  try {
    const mod = await import(`./registries/registry-${char}`);
    return mod.REGISTRY[slug] || null;
  } catch (err) {
    console.error("Failed to load registry bucket for", slug, err);
    return null;
  }
}
