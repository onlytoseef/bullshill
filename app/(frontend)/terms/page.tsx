import type { Metadata } from "next";

import { FinalCta } from "@/components/sections/final-cta";
import { LegalDoc } from "@/components/sections/legal-doc";
import { termsOfService } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "The terms that govern your use of the Bullshill website and the marketing services we provide.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <LegalDoc doc={termsOfService} />
      <FinalCta variant="page" />
    </>
  );
}
