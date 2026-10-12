import Image from "next/image";
import Link from "next/link";
import { HiOutlineArrowRight } from "react-icons/hi2";

function CardArrow() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute bottom-5 left-5 z-20 text-[#2F7BFF] opacity-0 -translate-x-2 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 sm:bottom-6 sm:left-6 lg:bottom-7 lg:left-7"
    >
      <HiOutlineArrowRight className="h-5 w-5" strokeWidth={1.75} />
    </span>
  );
}

const cardBase =
  "group relative flex overflow-hidden rounded-[1.5rem] bg-[#F6F7FA] transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-[#F1F3F7] hover:shadow-[0_10px_28px_rgba(15,23,42,0.07)]";

const imageMotion =
  "transition-transform duration-300 ease-out group-hover:-translate-y-1";

const pillowsImageClass = `h-auto w-[92%] max-w-[275px] object-contain sm:w-full sm:max-w-[300px] ${imageMotion}`;
const sofaImageClass = `h-auto w-[95%] max-w-[300px] object-contain object-bottom sm:max-w-[320px] ${imageMotion}`;

export default function ShopCategories() {
  return (
    <section className="w-full overflow-x-clip bg-white">
      <div className="mx-auto w-full max-w-[1800px] px-3 py-5 sm:px-8 sm:py-12 lg:px-8 lg:py-14">
        <div className="mb-3.5 flex items-end justify-between gap-3 sm:mb-8 lg:mb-9">
          <h2 className="text-[1.15rem] font-bold tracking-[-0.03em] text-[#0B1F3A] sm:text-[1.6rem] lg:text-[1.75rem]">
            Shop By The Top Categories
          </h2>
          <Link
            href="/mattresses"
            className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-[#2F7BFF] transition-colors hover:text-[#2569e0] sm:text-[14px]"
          >
            View all categories
            <HiOutlineArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Phone: asymmetric 3-col like Figma */}
        <div className="grid min-h-[210px] grid-cols-3 grid-rows-2 gap-2 md:hidden">
          <Link
            href="/mattresses"
            className={`${cardBase} row-span-2 min-h-0 flex-col rounded-2xl p-2.5`}
          >
            <Image
              src="/mattress3.png"
              alt="CloudyNap mattresses"
              fill
              className={`object-cover object-[40%_58%] ${imageMotion}`}
              sizes="34vw"
              priority
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-br from-white/45 via-white/15 to-transparent to-55%"
            />
            <div className="relative z-10">
              <h3 className="text-[11px] font-semibold tracking-[-0.02em] text-[#0B1F3A]">
                Mattresses
              </h3>
              <p className="mt-0.5 text-[9px] leading-snug text-[#0B1F3A]/75">
                Engineered for perfect sleep comfort.
              </p>
            </div>
          </Link>

          <Link
            href="/pillows"
            className={`${cardBase} min-h-0 flex-col justify-between rounded-2xl p-2`}
          >
            <div className="relative z-10">
              <h3 className="text-[10px] font-semibold leading-snug tracking-[-0.02em] text-[#0B1F3A]">
                Pillows
              </h3>
            </div>
            <div className="relative mt-1 flex flex-1 items-center justify-center">
              <Image
                src="/pillows.png"
                alt="CloudyNap pillows and accessories"
                width={1448}
                height={1086}
                className={`h-auto w-[85%] max-w-[72px] object-contain ${imageMotion}`}
                sizes="20vw"
              />
            </div>
          </Link>

          <Link
            href="/furniture"
            className={`${cardBase} row-span-2 min-h-0 flex-col rounded-2xl p-2.5`}
          >
            <div className="relative z-10">
              <h3 className="text-[10px] font-semibold leading-snug tracking-[-0.02em] text-[#0B1F3A]">
                Furniture &amp; Living Room
              </h3>
              <p className="mt-0.5 text-[9px] leading-snug text-[#64748B]">
                Relax in style, your way.
              </p>
            </div>
            <div className="relative mt-auto flex flex-1 items-end justify-center pb-1">
              <Image
                src="/recliners.png"
                alt="CloudyNap furniture"
                width={1086}
                height={1448}
                className={`h-auto w-[78%] max-w-[88px] object-contain object-bottom ${imageMotion}`}
                sizes="30vw"
              />
            </div>
          </Link>

          <Link
            href="/accessories"
            className={`${cardBase} min-h-0 flex-col justify-between rounded-2xl p-2`}
          >
            <div className="relative z-10">
              <h3 className="text-[10px] font-semibold leading-snug tracking-[-0.02em] text-[#0B1F3A]">
                <span className="block">View All</span>
                <span className="block">Accessories</span>
              </h3>
            </div>
            <div className="relative mt-1 flex flex-1 items-end justify-center">
              <Image
                src="/scb.png"
                alt="CloudyNap sofa"
                width={1448}
                height={1086}
                className={`h-auto w-[85%] max-w-[72px] object-contain object-bottom ${imageMotion}`}
                sizes="20vw"
              />
            </div>
          </Link>
        </div>

        {/* Tablet/desktop: approved asymmetric layout */}
        <div className="hidden gap-2 md:grid md:grid-cols-2 md:gap-3 lg:grid-cols-3 lg:grid-rows-2 lg:gap-3">
          <Link
            href="/mattresses"
            className={`${cardBase} min-h-[360px] flex-col p-6 sm:min-h-[400px] sm:p-7 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:min-h-0 lg:p-8`}
          >
            <Image
              src="/mattress3.png"
              alt="CloudyNap mattresses"
              fill
              className={`object-cover object-[40%_58%] sm:object-[42%_55%] ${imageMotion}`}
              sizes="(max-width: 1024px) 90vw, 32vw"
              priority
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-br from-white/40 via-white/12 to-transparent to-55%"
            />
            <div className="relative z-10 max-w-[9.25rem]">
              <h3 className="text-[1.15rem] font-semibold tracking-[-0.02em] text-[#0B1F3A] sm:text-[1.25rem]">
                Mattresses
              </h3>
              <p className="mt-1.5 max-w-[7.75rem] text-[13px] leading-snug text-[#0B1F3A]/80 sm:text-[14px]">
                Engineered for perfect sleep comfort.
              </p>
            </div>
            <CardArrow />
          </Link>

          <Link
            href="/pillows"
            className={`${cardBase} min-h-[200px] flex-col p-5 sm:min-h-[220px] sm:flex-row sm:items-center sm:p-6 lg:col-start-2 lg:row-start-1 lg:min-h-0 lg:p-6`}
          >
            <div className="relative z-10 w-full shrink-0 sm:w-[48%] sm:pr-2">
              <h3 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-[#0B1F3A] sm:text-[1.15rem]">
                Pillows
              </h3>
              <p className="mt-1.5 text-[13px] leading-snug text-[#64748B]">
                Soft support for better nights.
              </p>
            </div>
            <div className="relative mt-4 flex flex-1 items-center justify-center pb-10 sm:mt-0 sm:justify-end sm:pb-0">
              <Image
                src="/pillows.png"
                alt="CloudyNap pillows and accessories"
                width={1448}
                height={1086}
                className={pillowsImageClass}
                sizes="(max-width: 1024px) 50vw, 22vw"
              />
            </div>
            <CardArrow />
          </Link>

          <Link
            href="/accessories"
            className={`${cardBase} min-h-[200px] flex-col p-5 sm:min-h-[220px] sm:flex-row sm:items-end sm:p-6 lg:col-start-2 lg:row-start-2 lg:min-h-0 lg:p-6`}
          >
            <div className="relative z-10 w-full shrink-0 sm:w-[46%] sm:self-center sm:pr-2">
              <h3 className="text-[1.05rem] font-semibold leading-snug tracking-[-0.02em] text-[#0B1F3A] sm:text-[1.15rem]">
                <span className="block">View All</span>
                <span className="block">Accessories</span>
              </h3>
            </div>
            <div className="relative mt-4 flex flex-1 items-end justify-center pb-10 sm:mt-0 sm:justify-end sm:pb-0">
              <Image
                src="/scb.png"
                alt="CloudyNap sofa"
                width={1448}
                height={1086}
                className={sofaImageClass}
                sizes="(max-width: 1024px) 50vw, 22vw"
              />
            </div>
            <CardArrow />
          </Link>

          <Link
            href="/furniture"
            className={`${cardBase} min-h-[360px] flex-col p-6 sm:min-h-[400px] sm:p-7 md:col-span-2 lg:col-span-1 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:min-h-0 lg:p-8`}
          >
            <div className="relative z-10 max-w-[18rem]">
              <h3 className="text-[1.15rem] font-semibold tracking-[-0.02em] text-[#0B1F3A] sm:text-[1.25rem]">
                Furniture &amp; Living Room
              </h3>
              <p className="mt-1.5 text-[13px] leading-snug text-[#64748B] sm:text-[14px]">
                Relax in style, your way.
              </p>
            </div>
            <div className="relative mt-auto flex min-h-[200px] flex-1 items-end justify-end pt-6 pb-10 lg:min-h-0 lg:pb-12">
              <Image
                src="/recliners.png"
                alt="CloudyNap furniture"
                width={1086}
                height={1448}
                className={`h-auto w-[78%] max-w-[300px] object-contain object-bottom sm:w-[70%] lg:w-[85%] ${imageMotion}`}
                sizes="(max-width: 1024px) 70vw, 30vw"
              />
            </div>
            <CardArrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
