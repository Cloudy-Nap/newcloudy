import Image from "next/image";
import Link from "next/link";
import { FiFacebook, FiInstagram, FiLinkedin } from "react-icons/fi";

const shopLinks = [
  { label: "Mattresses", href: "/mattresses" },
  { label: "Sofas", href: "/sofas" },
  { label: "Pillows", href: "/pillows" },
  { label: "Accessories", href: "/accessories" },
  { label: "Furniture", href: "/furniture" },
  { label: "Offers", href: "/mattresses" },
];

const customerCareLinks = [
  { label: "Contact Us", href: "#" },
  { label: "Delivery Information", href: "#" },
  { label: "Returns & Exchanges", href: "#" },
  { label: "Warranty", href: "#" },
  { label: "FAQs", href: "#" },
];

const companyLinks = [
  { label: "About CloudyNap", href: "#" },
  { label: "Our Story", href: "#" },
  { label: "Sleep Guide", href: "#" },
  { label: "Reviews", href: "#" },
  { label: "Careers", href: "#" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms & Conditions", href: "#" },
  { label: "Refund Policy", href: "#" },
  { label: "Shipping Policy", href: "#" },
];

const mobileRows = [
  {
    heading: "Shop",
    links: [
      { label: "Mattresses", href: "/mattresses" },
      { label: "Sofas", href: "/sofas" },
      { label: "Pillows", href: "/pillows" },
      { label: "Accessories", href: "/accessories" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Delivery", href: "#" },
      { label: "Returns", href: "#" },
      { label: "Warranty", href: "#" },
      { label: "FAQs", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Reviews", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Refund Policy", href: "#" },
    ],
  },
];

const socialLinks = [
  { label: "Facebook", href: "#", Icon: FiFacebook },
  { label: "Instagram", href: "#", Icon: FiInstagram },
  { label: "LinkedIn", href: "#", Icon: FiLinkedin },
];

function DesktopColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#0B1F3A]">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[14px] leading-snug text-[#475569] transition-colors duration-200 hover:text-[#2F7BFF]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-2 border-t border-[#E8EEF4] bg-[#F8FBFF] sm:mt-4">
      <div className="mx-auto w-full max-w-[1800px] px-3 pb-5 pt-6 sm:px-8 sm:pb-8 sm:pt-12 lg:px-8 lg:pb-10 lg:pt-14">
        {/* Desktop / tablet */}
        <div className="hidden sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-[minmax(0,1.35fr)_repeat(4,minmax(0,1fr))] lg:gap-x-10 xl:gap-x-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex" aria-label="CloudyNap home">
              <Image
                src="/cloudynap1.png"
                alt="CloudyNap"
                width={2172}
                height={724}
                className="h-9 w-auto max-w-[160px] object-contain sm:h-10 sm:max-w-[180px]"
              />
            </Link>
            <p className="mt-4 max-w-[18rem] text-[14px] leading-snug tracking-[-0.01em] text-[#0B1F3A]">
              Better sleep starts with better comfort.
            </p>
            <p className="mt-2 text-[13px] leading-snug text-[#64748B]">
              Comfort delivered across the Pakistan.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#475569] transition-colors duration-200 hover:border-[#C7DBF5] hover:text-[#2F7BFF]"
                >
                  <Icon className="h-[15px] w-[15px]" strokeWidth={1.75} />
                </Link>
              ))}
            </div>
          </div>

          <DesktopColumn title="Shop" links={shopLinks} />
          <DesktopColumn title="Customer Care" links={customerCareLinks} />
          <DesktopColumn title="Company" links={companyLinks} />
          <DesktopColumn title="Legal" links={legalLinks} />
        </div>

        {/* Phone — compact brand + 4 horizontal link rows */}
        <div className="sm:hidden">
          <div>
            <Link href="/" className="inline-flex" aria-label="CloudyNap home">
              <Image
                src="/cloudynap1.png"
                alt="CloudyNap"
                width={2172}
                height={724}
                className="h-8 w-auto max-w-[128px] object-contain"
              />
            </Link>
            <p className="mt-2.5 max-w-[16rem] text-[12px] leading-snug tracking-[-0.01em] text-[#0B1F3A]">
              Better sleep starts with better comfort.
            </p>
            <div className="mt-3 flex items-center gap-2.5">
              {socialLinks.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#475569] transition-colors duration-200 hover:text-[#2F7BFF]"
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                </Link>
              ))}
            </div>
          </div>

          <nav className="mt-5 space-y-3.5" aria-label="Footer">
            {mobileRows.map((row) => (
              <div key={row.heading}>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#0B1F3A]">
                  {row.heading}
                </h3>
                <ul className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                  {row.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[12px] leading-snug text-[#64748B] transition-colors duration-200 hover:text-[#2F7BFF]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 border-t border-[#E8EEF4] pt-4 sm:mt-10 sm:pt-5">
          <div className="hidden items-center justify-between gap-4 sm:flex">
            <p className="text-[13px] leading-snug text-[#64748B]">
              © 2026 CloudyNap. All rights reserved.
            </p>
            <div className="flex shrink-0 items-center gap-5">
              <Link
                href="#"
                className="text-[13px] text-[#64748B] transition-colors duration-200 hover:text-[#2F7BFF]"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-[13px] text-[#64748B] transition-colors duration-200 hover:text-[#2F7BFF]"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>

          <div className="sm:hidden">
            <p className="text-[11px] leading-snug text-[#64748B]">
              © 2026 CloudyNap
            </p>
            <p className="mt-0.5 text-[11px] leading-snug text-[#94A3B8]">
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
