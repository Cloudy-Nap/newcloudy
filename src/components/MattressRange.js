import Image from "next/image";
import Link from "next/link";

const mattresses = [
  {
    id: "dolce-vita",
    name: "Dolce Vita",
    subtitle: "Medium Luxe",
    image: "/dvseries.png",
    href: "/mattresses?brand=Dolce%20Vita",
  },
  {
    id: "supreme",
    name: "Supreme",
    subtitle: "Firm Support",
    image: "/sseries.png",
    href: "/mattresses?brand=SupremeFoam",
  },
  {
    id: "ortho",
    name: "Ortho",
    subtitle: "Extra Firm Support",
    image: "/orticas.png",
    href: "/mattresses?brand=Ortica",
  },
];

function MattressCard({ item, compact = false }) {
  return (
    <Link
      href={item.href}
      className={`group relative block overflow-hidden transition-transform duration-300 ease-out hover:-translate-y-0.5 ${
        compact
          ? "h-[112px] rounded-xl"
          : "h-[300px] rounded-[1.5rem] sm:h-[340px] lg:h-[360px]"
      }`}
    >
      <Image
        src={item.image}
        alt={`${item.name} mattress — ${item.subtitle}`}
        fill
        className="object-cover object-center transition-transform duration-[350ms] ease-out group-hover:scale-[1.03]"
        sizes={compact ? "33vw" : "(max-width: 1024px) 50vw, 33vw"}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent ${
          compact ? "h-[70%]" : "h-[45%]"
        }`}
      />
      <div
        className={`absolute z-10 ${
          compact ? "bottom-2 left-2 right-1" : "bottom-5 left-5 sm:bottom-6 sm:left-6"
        }`}
      >
        <h3
          className={`font-semibold tracking-[-0.02em] text-white ${
            compact ? "text-[11px] leading-tight" : "text-[1.25rem] sm:text-[1.35rem]"
          }`}
        >
          {item.name}
        </h3>
        <p
          className={`font-normal text-white/85 ${
            compact ? "mt-0.5 text-[9px] leading-tight" : "mt-0.5 text-[13px] sm:text-[14px]"
          }`}
        >
          {item.subtitle}
        </p>
      </div>
    </Link>
  );
}

export default function MattressRange() {
  return (
    <section className="w-full overflow-x-clip bg-white">
      <div className="mx-auto w-full max-w-[1800px] px-3 pb-5 pt-1 sm:px-8 sm:pb-14 sm:pt-6 lg:px-8 lg:pb-16 lg:pt-4">
        <h2 className="mb-3 text-[1.15rem] font-bold tracking-[-0.03em] text-[#0B1F3A] sm:mb-8 sm:text-[1.6rem] lg:mb-9 lg:text-[1.75rem]">
          Explore Our Mattress Range
        </h2>

        {/* Phone: 3 compact image cards in a row (Figma) */}
        <div className="grid grid-cols-3 gap-2 md:hidden">
          {mattresses.map((item) => (
            <MattressCard key={item.id} item={item} compact />
          ))}
        </div>

        {/* Tablet/desktop: large image cards */}
        <div className="hidden gap-2 md:grid md:grid-cols-2 md:gap-3 lg:grid-cols-3 lg:gap-3">
          {mattresses.map((item) => (
            <MattressCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
