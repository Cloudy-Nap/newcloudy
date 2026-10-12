import {
  HiOutlineShieldCheck,
  HiOutlineTrophy,
  HiOutlineUserGroup,
} from "react-icons/hi2";

const benefits = [
  {
    id: "authentic",
    icon: HiOutlineShieldCheck,
    title: "100% Authentic",
    subtitle: "All reviews are from real customers on Google",
  },
  {
    id: "rated",
    icon: HiOutlineTrophy,
    title: "Top Rated Store",
    subtitle: "Highly rated by hundreds of customers across Pakistan",
  },
  {
    id: "trusted",
    icon: HiOutlineUserGroup,
    title: "Trusted by Thousands",
    subtitle: "Join thousands of satisfied Cloudy Nap customers",
  },
];

export default function TrustBenefits() {
  return (
    <section className="relative z-20 w-full overflow-x-clip bg-white">
      <div className="mx-auto w-full max-w-[1800px] px-3 py-5 sm:px-8 sm:py-6 lg:px-8 xl:px-10">
        <ul className="grid grid-cols-1 divide-y divide-[#E8EEF4] overflow-hidden rounded-2xl border border-[#E8EEF4] bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {benefits.map(({ id, icon: Icon, title, subtitle }) => (
            <li
              key={id}
              className="flex items-start gap-3.5 px-5 py-5 sm:items-center sm:px-6 sm:py-6 lg:gap-4 lg:px-8"
            >
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF5FF] text-[#2F7BFF]">
                <Icon
                  aria-hidden="true"
                  className="h-5 w-5"
                  strokeWidth={1.75}
                />
              </span>
              <div className="min-w-0">
                <p className="text-[15px] font-bold leading-tight tracking-[-0.02em] text-[#0B1F3A] sm:text-[16px]">
                  {title}
                </p>
                <p className="mt-1.5 text-[13px] font-normal leading-snug text-[#64748B]">
                  {subtitle}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
