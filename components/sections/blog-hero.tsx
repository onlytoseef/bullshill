import Image from "next/image";

import { PageHero } from "@/components/sections/page-hero";
import { Button } from "@/components/ui/button";
import { blogPage } from "@/lib/content";
import findMoreIcon from "../../app/assets/images/find-more-icon.svg";

export function BlogHero() {
  return (
    <PageHero title={blogPage.title} eyebrow={blogPage.eyebrow} subtitle={blogPage.subtitle}>
          <Button
            href={blogPage.cta.href}
            variant="light"
            className="page-hero-button"
          >
            {blogPage.cta.label}
            <Image src={findMoreIcon} alt="" width={24} height={24} />
          </Button>
    </PageHero>
  );
}
