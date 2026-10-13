import type { Metadata } from "next";

import { FinalCta } from "@/components/sections/final-cta";
import { LegalDoc } from "@/components/sections/legal-doc";
import { privacyPolicy } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How BullShill collects, uses and protects your personal information, and the privacy choices you have.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <LegalDoc doc={privacyPolicy} />
      <FinalCta variant="page" />
    </>
  );
}
