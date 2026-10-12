"use client";

import { useState } from "react";

export default function Map() {
  const [activeCity, setActiveCity] = useState("Karachi");

  const cities = ["Karachi"];

  return (
    <section className="w-full overflow-x-clip bg-white py-8 sm:py-12 lg:py-14">
      <div className="mx-auto w-full max-w-[1800px] px-3 sm:px-8 lg:px-8 xl:px-10">
        <h2 className="mb-8 text-center text-[1.35rem] font-bold tracking-[-0.03em] text-[#0B1F3A] sm:text-[1.75rem] lg:text-[2rem]">
          Our Store Locations
        </h2>

        <div className="mb-6 flex justify-center">
          <div className="mx-auto flex w-full overflow-hidden rounded-xl bg-[#F1F5F9]">
            {cities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setActiveCity(city)}
                className={`flex-1 py-3 text-sm font-medium transition sm:text-base ${
                  activeCity === city
                    ? "bg-[#2F7BFF] text-white"
                    : "text-[#64748B] hover:text-[#0B1F3A]"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full overflow-hidden rounded-xl shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2822.894945469706!2d67.06657919999999!3d24.8864581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f005c988d77%3A0xd0dcddb87f515bd6!2sDiamond%20Supreme%20Foam%20(CLOUDYNAP)!5e1!3m2!1sen!2s!4v1776985975328!5m2!1sen!2s"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Diamond Supreme Foam (CLOUDYNAP) on Google Maps"
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}
