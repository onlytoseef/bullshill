import type { Metadata } from "next";
import { PageJsonLd } from "@/components/seo/page-json-ld";

import { FinalCta } from "@/components/sections/final-cta";
import { LegalDoc } from "@/components/sections/legal-doc";
import { privacyPolicy } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Bullshill collects, uses and protects your personal information, and the privacy choices you have.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageJsonLd path="/privacy-policy" name={privacyPolicy.title} description={privacyPolicy.intro} />
      <LegalDoc doc={privacyPolicy} />
      <FinalCta variant="page" />
    </>
  );
}
