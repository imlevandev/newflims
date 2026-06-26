import { StackList } from "@/components/cards/stack-list";
import { SectionHeader } from "@/components/navigation/section-header";

const productNotes = [
  "Use server components for catalog pages when SEO matters.",
  "Move filters and search into client components when interaction grows.",
  "Keep data access inside src/server/modules/products later.",
];

export default function ProductsPage() {
  return (
    <>
      <section className="hero panel compact-hero">
        <SectionHeader
          badge="Client page"
          description="A sample area for user-facing features like products, pricing, profile, or orders."
          title="Products and customer screens live in the (client) group."
        />
      </section>
      <StackList items={productNotes} title="Implementation notes" />
    </>
  );
}
