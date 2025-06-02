/**
 * Extracts and formats a slug from a URL or path for use in breadcrumb navigation
 * @param path - The URL or path to extract the slug from
 * @returns The formatted slug for display in breadcrumbs
 */
export function getSlugForBreadcrumb(path: string): string {
  // Handle empty paths
  if (!path) return "";

  // Remove query parameters and hash fragments
  const cleanPath = path.split("?")[0]!.split("#")[0];

  // Extract the last segment of the path
  const segments = cleanPath!.split("/").filter(Boolean);
  const slug = segments[segments.length - 1];

  // If no slug was found, return empty string
  if (!slug) return "";

  // Handle dynamic route parameters (remove brackets)
  const cleanSlug = slug.replace(/^\[|\]$/g, "");

  // Format the slug for display
  return formatSlug(cleanSlug);
}

/**
 * Formats a slug for display in a breadcrumb
 * @param slug - The raw slug to format
 * @returns The formatted slug
 */
export function formatSlug(slug: string): string {
  // Replace hyphens and underscores with spaces
  let formatted = slug.replace(/[-_]/g, " ");

  // Handle catch-all routes
  if (formatted.startsWith("...")) {
    formatted = formatted.replace("...", "");
  }

  // Capitalize each word
  formatted = formatted
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return formatted;
}

/**
 * Generates a breadcrumb path array from a URL
 * @param path - The URL or path to generate breadcrumbs from
 * @returns An array of breadcrumb items with href and label
 */
export function generateBreadcrumbs(
  path: string
): Array<{ href: string; label: string }> {
  // Handle empty paths
  if (!path) return [];

  // Remove query parameters and hash fragments
  const cleanPath = path.split("?")[0]!.split("#")[0];

  // Split the path into segments
  const segments = cleanPath!.split("/").filter(Boolean);

  // Generate breadcrumb items
  const breadcrumbs = segments.map((segment, index) => {
    // Create the href for this breadcrumb item
    const href = "/" + segments.slice(0, index + 1).join("/");

    // Format the segment for display
    const label = formatSlug(segment);

    return { href, label };
  });

  // Add home breadcrumb at the beginning
  return [{ href: "/", label: "Home" }, ...breadcrumbs];
}
