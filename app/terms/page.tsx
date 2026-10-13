import type { Metadata } from "next";

import { FinalCta } from "@/components/sections/final-cta";
import { LegalDoc } from "@/components/sections/legal-doc";
import { termsOfService } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of the BullShill website and the marketing services we provide.",
};

export default function TermsPage() {
  return (
    <>
      <LegalDoc doc={termsOfService} />
      <FinalCta variant="page" />
    </>
  );
}
