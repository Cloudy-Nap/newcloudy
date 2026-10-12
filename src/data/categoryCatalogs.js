/**
 * Category page copy only — products load from the API.
 */
export function getCategoryConfig(key) {
  const configs = {
    mattresses: {
      key: "mattresses",
      path: "/mattresses",
      eyebrow: "Shop Mattresses",
      title: "Mattresses Made for Better Sleep",
      tagline:
        "Explore supportive foams, cooling covers, and everyday comfort — engineered for the way you rest, night after night.",
      metaTitle: "Mattresses | CloudyNap",
      metaDescription:
        "Shop CloudyNap mattresses engineered for deeper rest, lasting support, and everyday comfort.",
      itemLabel: "mattresses",
      emptyLabel: "mattresses",
      sizeFilter: { title: "Size", dynamic: true },
    },
    sofas: {
      key: "sofas",
      path: "/sofas",
      eyebrow: "Shop Sofas",
      title: "Sofas Built for Everyday Lounging",
      tagline:
        "From compact seats to generous sofa-cum-beds — soft seating designed for real living rooms.",
      metaTitle: "Sofas | CloudyNap",
      metaDescription:
        "Shop CloudyNap sofa cum beds with lasting everyday comfort.",
      itemLabel: "sofas",
      emptyLabel: "sofas",
      sizeFilter: { title: "Options", dynamic: true },
    },
    furniture: {
      key: "furniture",
      path: "/furniture",
      eyebrow: "Shop Furniture",
      title: "Furniture for Comfort at Home",
      tagline:
        "Comfortable pieces made for movies, naps, and everything between.",
      metaTitle: "Furniture | CloudyNap",
      metaDescription: "Shop CloudyNap furniture and lounge pieces.",
      itemLabel: "products",
      emptyLabel: "products",
      sizeFilter: { title: "Options", dynamic: true },
    },
    accessories: {
      key: "accessories",
      path: "/accessories",
      eyebrow: "Shop Accessories",
      title: "Accessories That Complete Your Setup",
      tagline:
        "Toppers, protectors, supports, and everyday comfort essentials — everything except pillows.",
      metaTitle: "Accessories | CloudyNap",
      metaDescription: "Shop CloudyNap sleep and comfort accessories.",
      itemLabel: "accessories",
      emptyLabel: "accessories",
      sizeFilter: { title: "Size", dynamic: true },
    },
    pillows: {
      key: "pillows",
      path: "/pillows",
      eyebrow: "Shop Pillows",
      title: "Pillows for Soft, Supported Nights",
      tagline:
        "Loft and support options that keep necks happy — side, back, or both.",
      metaTitle: "Pillows | CloudyNap",
      metaDescription: "Shop CloudyNap pillows for better sleep support.",
      itemLabel: "pillows",
      emptyLabel: "pillows",
      sizeFilter: { title: "Size", dynamic: true },
    },
  };

  return configs[key] || null;
}
