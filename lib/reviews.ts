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
   * the image's alt text and the card caption.
   */
  name: string;
  /** The client's feedback transcribed from the screenshot. */
  quote: string;
  rating: number;
  country?: string;
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
  {
    id: "6251",
    src: r6251,
    platform: "fiverr",
    name: "jmundloch",
    quote:
      "Jawad and his team have been very professional and are talented at what they do. Communication has been great and I will be using again in the future.",
    rating: 5,
    country: "United States",
  },
  {
    id: "6252",
    src: r6252,
    platform: "fiverr",
    name: "jmundloch",
    quote:
      "Javad and his team has been very helpful. Whether spending time with me discussing the project ahead of hiring him to he initial stages, he has been a great resource and partner.",
    rating: 5,
    country: "United States",
  },
  {
    id: "6253",
    src: r6253,
    platform: "fiverr",
    name: "albeearound",
    quote:
      "Great everything! would highly recommend.",
    rating: 5,
    country: "United States",
  },
  {
    id: "6254",
    src: r6254,
    platform: "fiverr",
    name: "tomekngo",
    quote:
      "Great service would recommend",
    rating: 5,
    country: "Poland",
  },
  {
    id: "6255",
    src: r6255,
    platform: "fiverr",
    name: "haris_mladenov",
    quote:
      "Jawad was very professional and exceeded expectations",
    rating: 4.7,
    country: "Bulgaria",
  },
  {
    id: "6256",
    src: r6256,
    platform: "fiverr",
    name: "strongkitchen",
    quote:
      "Another great month with Jawad's team.",
    rating: 4,
    country: "United States",
  },
  {
    id: "6257",
    src: r6257,
    platform: "fiverr",
    name: "strongkitchen",
    quote:
      "Another solid month of growth with Jawad and his team.",
    rating: 5,
    country: "United States",
  },
  {
    id: "6258",
    src: r6258,
    platform: "fiverr",
    name: "anthony_1303",
    quote:
      "Wonderful working with Jawad. Highly recommended !!!!",
    rating: 5,
    country: "United Arab Emirates",
  },
  {
    id: "6259",
    src: r6259,
    platform: "fiverr",
    name: "haroldtho",
    quote:
      "Jawad is highly professional at making content for token projects. Really impressed by the quality. Highly Recommended!",
    rating: 5,
    country: "United Kingdom",
  },
  {
    id: "6260",
    src: r6260,
    platform: "fiverr",
    name: "randeepahwa",
    quote:
      "Jawad did an excellent job laying the baseline for our project launch from a marketing perspective. He clearly knows his craft and approaches his work with structure, clarity, and planned execution. Great to collaborate with someone so professional and results-oriented.",
    rating: 5,
    country: "Canada",
  },
  {
    id: "6261",
    src: r6261,
    platform: "fiverr",
    name: "bitnaro",
    quote:
      "Mr Jawad is truly impressed with a flawless delivery that exceeded expectations. Sounds professional and analytical, Well-founded estimate which is based on data and solid reasoning, His deep understanding and proactive communication made working with him a Breeze. His deep understanding and proactive communication made his work HIGHLY RECOMMEND",
    rating: 5,
    country: "Germany",
  },
  {
    id: "6262",
    src: r6262,
    platform: "fiverr",
    name: "bitnaro",
    quote:
      "Mr Jawad Suggests reasonable and well thought out, Realistic assessment, Sounds more professional and analytical, Well-founded estimate,His estimate is based on data and solid reasoning, His deep understanding and proactive communication made working with him a breeze. HIGHLY RECOMMEND",
    rating: 5,
    country: "Germany",
  },
  {
    id: "6263",
    src: r6263,
    platform: "fiverr",
    name: "crypto717",
    quote:
      "Jawad, i loved working with you, but as you know, the fight between trump and Musk has ruined the market trends, i have to pause the project and reach out to you later for the collaboration. I highly recommend Jawad for crypto projects. Thank you",
    rating: 5,
    country: "United Arab Emirates",
  },
  {
    id: "6264",
    src: r6264,
    platform: "fiverr",
    name: "belsongavin",
    quote:
      "Jawad's work in Social Media Marketing was OUTSTANDING! His professionalism and high level of cooperation made this a seamless experience. Highly recommended! 🙌",
    rating: 5,
    country: "Albania",
  },
  {
    id: "6265",
    src: r6265,
    platform: "fiverr",
    name: "holly_wpu",
    quote:
      "jawad really gets me, I just share what I want, not only did he provide solution, but also with his own insights and suggestions.",
    rating: 5,
    country: "Hong Kong",
  },
  {
    id: "6266",
    src: r6266,
    platform: "fiverr",
    name: "belsongavin",
    quote:
      "Jawad showed incredible PROFESSIONALISM in delivering top-notch social media marketing services. His DEEP UNDERSTANDING of the industry made collaborating with him a pleasant and fruitful experience. HIGHLY recommend working with him! 👍",
    rating: 5,
    country: "Albania",
  },
  {
    id: "6267",
    src: r6267,
    platform: "fiverr",
    name: "dylangavin",
    quote:
      "Jawad is an exceptional Social Media Marketer. Finger on the pulse when it comes to crypto and Web3. Knows all the angles and trends to grow social profiles.",
    rating: 5,
    country: "Ireland",
  },
  {
    id: "6268",
    src: r6268,
    platform: "fiverr",
    name: "johnshacklette",
    quote:
      "There's not much I cannot say. I've learned so much watching these guys grow with me. The transparency, trust, faith, and market awareness is invaluable. They truly understand my goals, ensure we are on the same page and come up with some really exciting ideas. The next step is the fun part, prep for launch. I have all the confidence that this team will put everything they can into making this project successful and I couldn't be happier to take the next steps with them by my side. I highly recommend any offerings from this team, you will not be sorry! But you'll have to wait in line 😉",
    rating: 5,
    country: "United States",
  },
  {
    id: "6269",
    src: r6269,
    platform: "fiverr",
    name: "ballersclubkikz",
    quote:
      "Jawad truly impressed me with his incredible ATTENTION TO DETAILS and PROFESSIONALISM in social media marketing. His DEEP UNDERSTANDING of the field made working with him an absolute pleasure. I wholeheartedly recommend him for any social media project! 🙌",
    rating: 5,
    country: "United States",
  },
  {
    id: "6270",
    src: r6270,
    platform: "fiverr",
    name: "talktravel22",
    quote:
      "Was very prompt in reviewing our White Paper and made some very important suggestions for improvements. We will continue to work with him as we are very pleased with the results.",
    rating: 5,
    country: "Canada",
  },
  {
    id: "6271",
    src: r6271,
    platform: "fiverr",
    name: "johnshacklette",
    quote:
      "I couldn't be happier with the progress we have made with the project and I look forward to continuing our relationship. Jawad has gone well above expectations and has been very professional throughout the gig. He has also come up with some very cool content that really made our project stand out. I look forward to continuing into the next phases of the project. I highly recommend Jawad!",
    rating: 5,
    country: "United States",
  },
  {
    id: "6272",
    src: r6272,
    platform: "upwork",
    name: "X (Twitter) Growth Strategist + AI Launch Growth Operator",
    quote:
      "Great to work with",
    rating: 5,
  },
  {
    id: "6273",
    src: r6273,
    platform: "upwork",
    name: "Graphics Designer & Discord Server Manager for NFT and Game Launch",
    quote:
      "Muhammad is definitely a shot above the rest. He worked for me for months, quietly, independently, patient even when i forgot to pay his milestones, he would just keep ticking along doing the work. Sent my discord and social media to a respectable number from ZERO with minimal direction and showed real interest in doing the work with me. I will definitely be back to hire him again. I have put the project on a hiatus so had to end his contract but will definitely be looking him up when we are ready to go again. Great job!!!",
    rating: 5,
  },
  {
    id: "6274",
    src: r6274,
    platform: "upwork",
    name: "Crypto Marketing / CEX marketing / Community build",
    quote:
      "Very nice team - always ready and available",
    rating: 5,
  },
  {
    id: "6275",
    src: r6275,
    platform: "upwork",
    name: "Top Crypto Marketers for Life Protocol's Global DeFi Adoption Campaign (Test Phase)",
    quote:
      "I had the pleasure of working with Mr. Muhammad, and I couldn't be more impressed. His expertise, dedication, and attention to detail were truly exceptional. He communicated clearly, met deadlines efficiently, and delivered top-notch results. His professionalism and commitment to quality made this experience seamless and enjoyable. I highly recommend him to anyone looking for a skilled and reliable freelancer.",
    rating: 5,
  },
  {
    id: "6276",
    src: r6276,
    platform: "upwork",
    name: "Crypto Marketing | Community management",
    quote:
      "Muhammad has been an exceptional professional to work with. He consistently demonstrated clear communication, a proactive approach, and strong dedication to our project's success. Despite some delays in animation (due to its complexity), Muhammad ensured that other critical tasks were progressing and kept us updated throughout the process. His expertise in design and project management has added great value to our project. Highly recommend working with him for any creative or technical endeavors!",
    rating: 5,
  },
  {
    id: "6277",
    src: r6277,
    platform: "upwork",
    name: "Web3 marketing expert needed for memecoin project.",
    quote:
      "Jawad created a detailed marketing plan for my meme coin project. He clearly has strong understanding of crypto space. Highly recommended",
    rating: 5,
  },
];
