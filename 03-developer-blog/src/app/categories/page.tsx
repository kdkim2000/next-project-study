import Link from "next/link";
import { getCategoriesWithCount } from "@/lib/blog";

export const dynamic = "force-static";

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCount();

  return (
    <section>
      <h2>Categories</h2>
      <ul>
        {categories.map((c) => (
          <li key={c.category}>
            <Link href={`/categories/${encodeURIComponent(c.category)}`}>
              #{c.category} ({c.count})
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
