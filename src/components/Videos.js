"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";

/** Instagram reel shortcodes — update this list when swapping videos. */
const INSTAGRAM_REEL_IDS = [
  "DYNePvClVxx",
  "DYNg7FnDC45",
  "DYNgjcOEw5B",
  "DYNgEBEAg0C",
  "DYNfiSPjl6c",
];

const embedPermalink = (reelId) =>
  `https://www.instagram.com/reel/${reelId}/?utm_source=ig_embed&utm_campaign=loading`;

const BLOCKQUOTE_STYLE = {
  background: "#fff",
  border: 0,
  borderRadius: 8,
  margin: 0,
  maxWidth: "100%",
  minWidth: 280,
  padding: 0,
  width: "calc(100% - 2px)",
};

export default function Videos() {
  const scrollContainerRef = useRef(null);
  const [embedScriptReady, setEmbedScriptReady] = useState(false);

  useEffect(() => {
    if (!embedScriptReady || typeof window === "undefined") return;
    if (window.instgrm?.Embeds?.process) {
      window.instgrm.Embeds.process();
    }
  }, [embedScriptReady]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -330, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 330, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full overflow-x-clip bg-[#F5F7FA] py-8 sm:py-12 lg:py-14">
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => setEmbedScriptReady(true)}
      />

      <div className="mx-auto w-full max-w-[1800px] px-3 sm:px-8 lg:px-8 xl:px-10">
        <h2 className="mb-8 text-center text-[1.35rem] font-bold tracking-[-0.03em] text-[#0B1F3A] sm:text-[1.75rem] lg:text-[2rem]">
          Like, Follow and Share
        </h2>

        <div className="relative px-10 sm:px-12">
          <button
            type="button"
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#2F7BFF] text-white shadow-lg transition hover:bg-[#2569e0] sm:h-11 sm:w-11"
            aria-label="Scroll left"
          >
            <HiOutlineChevronLeft className="h-5 w-5" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex items-start gap-2 overflow-x-auto scroll-smooth md:gap-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {INSTAGRAM_REEL_IDS.map((reelId) => (
              <div
                key={reelId}
                className="relative flex min-h-[433px] w-[326px] shrink-0 justify-center overflow-hidden rounded-lg border border-[#E8EEF4] bg-white shadow-sm"
              >
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={embedPermalink(reelId)}
                  data-instgrm-version="14"
                  style={BLOCKQUOTE_STYLE}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={scrollRight}
            className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#2F7BFF] text-white shadow-lg transition hover:bg-[#2569e0] sm:h-11 sm:w-11"
            aria-label="Scroll right"
          >
            <HiOutlineChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
