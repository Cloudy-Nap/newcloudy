import { Suspense } from "react";
import ProfilePageClient from "@/components/ProfilePageClient";

export const metadata = {
  title: "Account | CloudyNap",
  description: "Manage your CloudyNap profile, orders, and settings.",
};

function ProfileFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAF3FF] via-[#F5F9FF] to-white px-3 py-16 text-center text-[14px] text-[#64748B]">
      Loading account…
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileFallback />}>
      <ProfilePageClient />
    </Suspense>
  );
}
