import CategoryShopPage, {
  buildCategoryMetadata,
} from "@/components/CategoryShopPage";

export const metadata = buildCategoryMetadata("furniture");

export default function FurniturePage() {
  return <CategoryShopPage categoryKey="furniture" />;
}
