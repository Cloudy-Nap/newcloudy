import Image from "next/image";
import Link from "next/link";
import { HiOutlineArrowRight } from "react-icons/hi2";

export default function PromoBanner() {
  return (
    <section className="w-full overflow-x-clip bg-white">
      <div className="mx-auto w-full max-w-[1800px] px-3 pb-6 pt-1 max-md:px-3 max-md:pb-5 max-md:pt-1 sm:px-8 sm:pb-14 lg:px-8 lg:pb-16">
        <div className="relative flex min-h-[148px] flex-row items-stretch overflow-hidden rounded-[1.25rem] max-md:min-h-[148px] sm:min-h-[300px] sm:rounded-[1.75rem] lg:min-h-[300px] xl:min-h-[310px]">
          <Image
            src="/cta-banner.png"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority={false}
            aria-hidden="true"
          />

          <div className="relative z-10 flex w-[48%] shrink-0 flex-col justify-center px-3.5 py-4 max-md:w-[55%] max-md:px-3.5 max-md:py-4 sm:w-full sm:max-w-[22rem] sm:px-8 sm:py-9 lg:w-[44%] lg:max-w-none lg:px-10 lg:py-10 xl:px-12">
            <h2 className="max-w-[11rem] text-[0.95rem] font-bold leading-[1.15] tracking-[-0.03em] text-[#0B1F3A] max-md:max-w-[11rem] max-md:text-[0.95rem] sm:max-w-[20rem] sm:text-[1.65rem] lg:text-[1.75rem]">
              <span className="block">Crafted for Unmatched</span>
              <span className="block">Rest, for a Better Nights.</span>
            </h2>

            {/* <p className="mt-1.5 max-w-[10rem] text-[10px] leading-[1.4] text-[#94A3B8] max-md:mt-1.5 max-md:text-[10px] sm:mt-3.5 sm:max-w-[16rem] sm:text-[15px]">
              <span className="block">Explore our exclusive range</span>
              <span className="block">and sleep better every night.</span>
            </p> */}

            <Link
              href="/mattresses"
              className="mt-2.5 inline-flex h-8 w-fit items-center justify-center gap-1 rounded-full bg-[#2F7BFF] px-3 text-[11px] font-medium text-white shadow-[0_6px_16px_rgba(47,123,255,0.25)] transition-colors hover:bg-[#2569e0] max-md:mt-2.5 max-md:h-8 sm:mt-6 sm:h-11 sm:px-6 sm:text-[14px]"
            >
              Shop Mattresses
              <HiOutlineArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
