import type { StaticImageData } from "next/image";

import r6251 from "../app/assets/client-reviews/IMG_6251.webp";
import r6252 from "../app/assets/client-reviews/IMG_6252.webp";
import r6253 from "../app/assets/client-reviews/IMG_6253.webp";
import r6254 from "../app/assets/client-reviews/IMG_6254.webp";
import r6255 from "../app/assets/client-reviews/IMG_6255.webp";
import r6256 from "../app/assets/client-reviews/IMG_6256.webp";
import r6257 from "../app/assets/client-reviews/IMG_6257.webp";
import r6258 from "../app/assets/client-reviews/IMG_6258.webp";
import r6259 from "../app/assets/client-reviews/IMG_6259.webp";
import r6260 from "../app/assets/client-reviews/IMG_6260.webp";
import r6261 from "../app/assets/client-reviews/IMG_6261.webp";
import r6262 from "../app/assets/client-reviews/IMG_6262.webp";
import r6263 from "../app/assets/client-reviews/IMG_6263.webp";
import r6264 from "../app/assets/client-reviews/IMG_6264.webp";
import r6265 from "../app/assets/client-reviews/IMG_6265.webp";
import r6266 from "../app/assets/client-reviews/IMG_6266.webp";
import r6267 from "../app/assets/client-reviews/IMG_6267.webp";
import r6268 from "../app/assets/client-reviews/IMG_6268.webp";
import r6269 from "../app/assets/client-reviews/IMG_6269.webp";
import r6270 from "../app/assets/client-reviews/IMG_6270.webp";
import r6271 from "../app/assets/client-reviews/IMG_6271.webp";
import r6272 from "../app/assets/client-reviews/IMG_6272.webp";
import r6273 from "../app/assets/client-reviews/IMG_6273.webp";
import r6274 from "../app/assets/client-reviews/IMG_6274.webp";
import r6275 from "../app/assets/client-reviews/IMG_6275.webp";
import r6276 from "../app/assets/client-reviews/IMG_6276.webp";
import r6277 from "../app/assets/client-reviews/IMG_6277.webp";

export type ReviewPlatform = "fiverr" | "upwork";

export type Review = {
  id: string;
  /** The screenshot itself. Its intrinsic size drives the card's ratio. */
  src: StaticImageData;
  platform: ReviewPlatform;
  /**
   * Who left it, as shown in the screenshot. Fiverr shows a handle; Upwork
   * shows no reviewer at all, so those carry the job title instead. Used for
   * the image's alt text — the review's own words stay in the screenshot and
   * are never re-typed.
   */
  name: string;
};

/**
 * Every review screenshot, in file order.
 *
 * Intrinsic width and height are read from the imported asset rather than
 * repeated here, so a card always reserves exactly the right space and nothing
 * can drift out of step with the file. The ratios differ a lot on purpose —
 * they range from 0.94 (a portrait Upwork review) to 3.76 — and the wall is
 * built to let every one of them keep its own shape.
 */
export const reviews: readonly Review[] = [
  { id: "6251", src: r6251, platform: "fiverr", name: "jmundloch" },
  { id: "6252", src: r6252, platform: "fiverr", name: "jmundloch" },
  { id: "6253", src: r6253, platform: "fiverr", name: "albeearound" },
  { id: "6254", src: r6254, platform: "fiverr", name: "tomekngo" },
  { id: "6255", src: r6255, platform: "fiverr", name: "haris_mladenov" },
  { id: "6256", src: r6256, platform: "fiverr", name: "strongkitchen" },
  { id: "6257", src: r6257, platform: "fiverr", name: "strongkitchen" },
  { id: "6258", src: r6258, platform: "fiverr", name: "anthony_1303" },
  { id: "6259", src: r6259, platform: "fiverr", name: "haroldtho" },
  { id: "6260", src: r6260, platform: "fiverr", name: "randeepahwa" },
  { id: "6261", src: r6261, platform: "fiverr", name: "bitnaro" },
  { id: "6262", src: r6262, platform: "fiverr", name: "bitnaro" },
  { id: "6263", src: r6263, platform: "fiverr", name: "crypto717" },
  { id: "6264", src: r6264, platform: "fiverr", name: "belsongavin" },
  { id: "6265", src: r6265, platform: "fiverr", name: "holly_wpu" },
  { id: "6266", src: r6266, platform: "fiverr", name: "belsongavin" },
  { id: "6267", src: r6267, platform: "fiverr", name: "dylangavin" },
  { id: "6268", src: r6268, platform: "fiverr", name: "johnshacklette" },
  { id: "6269", src: r6269, platform: "fiverr", name: "ballersclubkikz" },
  { id: "6270", src: r6270, platform: "fiverr", name: "talktaiwe22" },
  { id: "6271", src: r6271, platform: "fiverr", name: "johnshacklette" },
  {
    id: "6272",
    src: r6272,
    platform: "upwork",
    name: "X (Twitter) Growth Strategist + AI Launch Growth Operator",
  },
  {
    id: "6273",
    src: r6273,
    platform: "upwork",
    name: "Graphics Designer & Discord Server Manager for NFT and Game Launch",
  },
  {
    id: "6274",
    src: r6274,
    platform: "upwork",
    name: "Crypto Marketing / CEX marketing / Community build",
  },
  {
    id: "6275",
    src: r6275,
    platform: "upwork",
    name: "Top Crypto Marketers for Life Protocol's Global DeFi Adoption Campaign (Test Phase)",
  },
  {
    id: "6276",
    src: r6276,
    platform: "upwork",
    name: "Crypto Marketing | Community management",
  },
  {
    id: "6277",
    src: r6277,
    platform: "upwork",
    name: "Web3 marketing expert needed for memecoin project.",
  },
];
