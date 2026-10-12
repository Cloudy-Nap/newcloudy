import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";
import { fetchStorefrontProductBySlug } from "@/lib/storeApi";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const product = await fetchStorefrontProductBySlug(slug);
    if (!product) return { title: "Product | CloudyNap" };
    return {
      title: `${product.name} | CloudyNap`,
      description: product.description,
    };
  } catch {
    return { title: "Product | CloudyNap" };
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  let product = null;
  try {
    product = await fetchStorefrontProductBySlug(slug);
  } catch {
    product = null;
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="relative min-h-full bg-gradient-to-b from-[#EAF3FF] to-[#F5F9FF] font-sans text-slate-900">
      <Navbar variant="solid" />
      <ProductDetail product={product} />
      <Footer />
    </div>
  );
}
