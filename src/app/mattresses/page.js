import CategoryShopPage, {
  buildCategoryMetadata,
} from "@/components/CategoryShopPage";

export const metadata = buildCategoryMetadata("mattresses");

export default function MattressesPage() {
  return <CategoryShopPage categoryKey="mattresses" />;
}
