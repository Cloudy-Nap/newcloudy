import CategoryShopPage, {
  buildCategoryMetadata,
} from "@/components/CategoryShopPage";

export const metadata = buildCategoryMetadata("pillows");

export default function PillowsPage() {
  return <CategoryShopPage categoryKey="pillows" />;
}
