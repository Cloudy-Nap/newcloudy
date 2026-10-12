import Image from "next/image";
import Link from "next/link";
import { HiOutlineArrowRight } from "react-icons/hi2";

const features = [
  {
    id: "mattress",
    title: "Dolce Vita Mattress",
    description: ["Premium comfort", "and timeless design", "for restful sleep."],
    image: "/urban1.png",
    alt: "Dolce Vita mattress",
    objectPosition: "object-[78%_center]",
    href: "/mattresses?brand=Dolce%20Vita",
  },
  {
    id: "pillows",
    title: "Dolce Vita Pillows",
    description: [
      "Luxury pillows",
      "crafted for perfect",
      "support and softness.",
    ],
    image: "/urban2.png",
    alt: "Dolce Vita pillows",
    objectPosition: "object-[82%_center]",
    href: "/pillows",
  },
];

export default function DolceVitaFeatures() {
  return (
    <section className="w-full overflow-x-clip bg-white">
      <div className="mx-auto w-full max-w-[1800px] -mt-4 px-3 pb-8 pt-0 max-md:-mt-3 max-md:px-3 max-md:pb-8 sm:-mt-10 sm:px-8 sm:pb-14 lg:-mt-12 lg:px-8 lg:pb-16">
        <div className="grid grid-cols-2 items-stretch gap-2 md:gap-3">
          {features.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group relative block h-[148px] w-full overflow-hidden rounded-[1rem] md:h-[288px] md:rounded-[1.5rem] lg:h-[305px]"
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                className={`object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.02] ${item.objectPosition}`}
                sizes="(max-width: 768px) 50vw, 50vw"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent"
              />

              <div className="absolute inset-y-0 left-0 z-10 flex max-w-[70%] flex-col justify-center px-3 py-3 max-md:max-w-[72%] max-md:px-3 max-md:py-3 sm:max-w-[55%] sm:px-7 sm:py-7 lg:px-8">
                <h3 className="text-[0.85rem] font-semibold leading-tight tracking-[-0.02em] text-white max-md:text-[0.85rem] sm:text-[1.45rem] lg:text-[1.55rem]">
                  {item.title}
                </h3>

                <p className="mt-1 hidden text-[13px] font-normal leading-[1.45] text-white/80 sm:mt-3 sm:block sm:text-[14px]">
                  {item.description.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>

                <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-white transition-colors duration-300 group-hover:text-white max-md:mt-2 sm:mt-6 sm:gap-1.5 sm:text-[14px]">
                  Explore Now
                  <HiOutlineArrowRight
                    aria-hidden="true"
                    className="h-3 w-3 transition-transform duration-300 ease-out group-hover:translate-x-1.5 sm:h-4 sm:w-4"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
