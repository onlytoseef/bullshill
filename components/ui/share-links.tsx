"use client";

import { SocialIcon } from "@/components/ui/social-icons";

const endpoints: Record<string, (url: string) => string> = {
  Facebook: (url) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
  X: (url) => `https://twitter.com/intent/tweet?url=${url}`,
  LinkedIn: (url) =>
    `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
};

export function ShareLinks({ networks }: { networks: readonly string[] }) {
  const share = (network: string) => {
    const url = encodeURIComponent(window.location.href);
    window.open(endpoints[network]?.(url), "_blank", "noopener,noreferrer");
  };

  return (
    <ul className="blog-share-links">
      {networks.map((network) => (
        <li key={network}>
          <button
            type="button"
            onClick={() => share(network)}
            aria-label={`Share on ${network}`}
          >
            <SocialIcon name={network} />
          </button>
        </li>
      ))}
    </ul>
  );
}
