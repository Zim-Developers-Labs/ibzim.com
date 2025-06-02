"use client";

import { getSlugForBreadcrumb } from "@/lib/slug-utils";
import { usePathname } from "next/navigation";

export default function SlugSpan() {
  const pathname = usePathname();
  const slug = getSlugForBreadcrumb(pathname);
  return <span>{slug}</span>;
}
