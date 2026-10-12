import CategoryShopPage, {
  buildCategoryMetadata,
} from "@/components/CategoryShopPage";

export const metadata = buildCategoryMetadata("sofas");

export default function SofasPage() {
  return <CategoryShopPage categoryKey="sofas" />;
}
