import CategoryShopPage, {
  buildCategoryMetadata,
} from "@/components/CategoryShopPage";

export const metadata = buildCategoryMetadata("accessories");

export default function AccessoriesPage() {
  return <CategoryShopPage categoryKey="accessories" />;
}
