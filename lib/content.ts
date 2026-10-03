/**
 * All page copy, in one place.
 *
 * Sections stay structural and the client can get a wording change without
 * anyone hunting through JSX. Data only — no markup.
 */

export type HeadlineSegment = {
  text: string;
  /** Renders in the brand orange. */
  accent?: boolean;
};

export const site = {
  name: "BullShill",
  announcement: "Marketing built for Web3 success",
} as const;

export const nav = {
  /** Shown to the left of the wordmark on desktop. */
  left: [
    { label: "Services", href: "/services" },
    { label: "Case Studies", href: "/#projects" },
    { label: "Blog", href: "/#blog" },
  ],
  /** Shown to the right of the wordmark on desktop. */
  right: [
    { label: "Team", href: "/#about" },
    { label: "Testimonials", href: "/#testimonials" },
  ],
  cta: { label: "Contact Us", href: "/#contact" },
} as const;

export const hero = {
  headline: [
    [{ text: "Dominate the " }, { text: "Crypto Market", accent: true }],
    [{ text: "Launch Without Limits" }],
  ] satisfies HeadlineSegment[][],
  subcopy:
    "We deliver data-driven, end-to-end marketing strategies that build hype, drive community engagement, and secure lasting conversions.",
  cta: { label: "Get Started", href: "#contact" },
} as const;

/**
 * Placeholder coin badges for the hero arc. `from`/`to` drive a CSS gradient
 * stand-in until real 3D renders land in `public/assets/images/`.
 */
export const heroCoins = [
  { symbol: "₳", name: "Cardano", from: "#3468d1", to: "#0a2a6b" },
  { symbol: "₮", name: "Tether", from: "#2fc79b", to: "#11624a" },
  { symbol: "Ξ", name: "Ethereum", from: "#9aa2c4", to: "#3c4166" },
  { symbol: "₿", name: "Bitcoin", from: "#f7a21a", to: "#9c5a06" },
  { symbol: "◎", name: "Solana", from: "#9945ff", to: "#19a67d" },
  { symbol: "B", name: "BNB", from: "#f3ba2f", to: "#8a6a10" },
  { symbol: "✕", name: "XRP", from: "#5b6b7d", to: "#1d2730" },
] as const;

export const intro = {
  eyebrow: "Who we are",
  body: "From website development and content creation to social media management and community building, we offer everything you need to achieve your marketing goals.",
} as const;

export const stats = [
  { value: 100, suffix: "%", label: "Retention Clients" },
  { value: 3000, suffix: "+", label: "Digital Marketing Projects" },
  { value: 300, suffix: "+", label: "Web3 Marketing Projects" },
  { value: 10, prefix: "$", suffix: "M", label: "Client Revenue Generated" },
] as const;

/**
 * The standalone /services page.
 *
 * Longer list than the four highlighted on the home page. `caption` repeats the
 * same supporting line across every card in the design — kept as one constant
 * so it reads as deliberate and can be given per-service copy later by adding a
 * `caption` to any item.
 */
const SERVICE_CAPTION =
  "End-to-end launch strategies designed to build massive hype, drive presales, and secure token momentum";

export const servicesPage = {
  eyebrow: "Our services",
  title: "What We Do",
  caption: SERVICE_CAPTION,
  /** The design shows the same four capability tags on every service. */
  tags: ["Token Launch", "NFT Promotion", "Memecoin Hype", "ICO Strategy"],
  cta: { label: "Find out more", href: "/#contact" },
  items: [
    {
      title: "Meme Coins",
      body: "From crafting a strategic marketing plan for a successful launch to assisting in community building, we specialise in memecoin marketing for any Web3 or crypto project. Whether you're launching an NFT, ICO, memecoin, DEX, DAO or crypto gaming platform, we're here to support every aspect of your marketing journey.",
      visual: { label: "Memecoin launch", from: "#1b1033", to: "#05030c" },
    },
    {
      title: "Social Media Marketing",
      body: "Grow your brand with our social media marketing services. We create engaging posts, manage your accounts and run targeted ads to help you reach more people. Straightforward strategies that connect you with your audience and move the numbers you care about.",
      visual: { label: "Social channels", from: "#2f7cf6", to: "#0b2a63" },
    },
    {
      title: "AI Product Launch",
      body: "Positioning, narrative and go-to-market for AI products. We help you launch something that reads as a category definition rather than another model announcement — landing pages, launch content and the press angle to carry it.",
      visual: { label: "AI go-to-market", from: "#2a2a30", to: "#0a0a0d" },
    },
    {
      title: "NFT Marketing / Promotion",
      body: "We create high-quality content that tells your story — articles, blogs, social posts and more. The focus is engaging, useful content that connects with collectors and gives your drop a reason to be shared.",
      visual: { label: "NFT collection", from: "#3b5bdb", to: "#141a4d" },
    },
    {
      title: "Community Growth & Management",
      body: "We help you build and grow your online community. Our growth and management services focus on engaging your audience, answering their questions and creating a positive space for discussion — attracting new members while keeping the existing ones active.",
      visual: { label: "Community channels", from: "#0f2b4a", to: "#04101c" },
    },
    {
      title: "X Marketing",
      body: "Daily posting, thread strategy and reply-guy coverage on the platform where crypto actually argues. We run the account, seed conversations with the right people, and turn impressions into followers who stay.",
      visual: { label: "X / Twitter", from: "#f4f4f5", to: "#b8babf" },
    },
    {
      title: "Reddit Marketing",
      body: "Subreddit-native campaigns that survive moderation. We find the communities your buyers are already in, post in a way that earns upvotes rather than removals, and handle the AMAs and launch threads that follow.",
      visual: { label: "Reddit campaigns", from: "#f2501f", to: "#8a2708" },
    },
  ],
} as const;

export const worried = {
  title: "Worried about Marketing of the Project?",
  subtitle:
    "You build the product. We'll make sure the right people hear about it — and stay.",
  cta: { label: "Talk to a strategist", href: "#contact" },
} as const;

/**
 * Process steps. `x`/`y` are percentages of the desktop flow container and are
 * shared by both the cards and the SVG connectors, so the two can't drift out
 * of alignment. Ignored on mobile, where the steps simply stack.
 */
export const process = {
  eyebrow: "How we work",
  title: "From first call to compounding growth",
  steps: [
    {
      title: "Onboarding",
      body: "We learn your token, your market and your community before we write a single post.",
      x: 0,
      y: 0,
    },
    {
      title: "Strategy & Planning",
      body: "A channel-by-channel plan with named owners, budgets and the metrics each one answers to.",
      x: 54,
      y: 19,
    },
    {
      title: "Execution & Implementation",
      body: "Content, campaigns and community management run by the same team that wrote the plan.",
      x: 4,
      y: 38,
    },
    {
      title: "Reporting & Optimisation",
      body: "Weekly numbers against the plan, with the next sprint's changes already proposed.",
      x: 54,
      y: 57,
    },
    {
      title: "Ongoing Communication",
      body: "A shared channel with your strategist — no ticket queues, no account-manager relay.",
      x: 8,
      y: 76,
    },
  ],
} as const;

export const partners = {
  title: "Our partners",
  subtitle: "Trusted by teams at over 1,000 of the world's leading organisations",
  logos: [
    "DELL",
    "zendesk",
    "Rakuten",
    "PACIFIC FUNDS",
    "NCR",
    "Lattice",
    "TED",
  ],
} as const;

export const testimonials = {
  eyebrow: "Testimonials",
  title: "What Our Clients Say About Us",
  subtitle:
    "Hear from the founders and marketing leads who've shipped launches with us.",
  items: [
    {
      quote:
        "They treated our launch like it was their own token. Mint sold out in under four hours and the Discord is still active a year later.",
      name: "Arjun Mehta",
      role: "Founder, Nebula Labs",
      initials: "AM",
      from: "#ef7914",
      to: "#7a3c08",
    },
    {
      quote:
        "The weekly reporting changed how our board talks about marketing. For the first time we could point at a number and say what caused it.",
      name: "Sofia Almeida",
      role: "CMO, Pyre Protocol",
      initials: "SA",
      from: "#2563eb",
      to: "#132a5e",
    },
    {
      quote:
        "We'd burned through two agencies before this. BullShill shipped more in the first month than either managed in a quarter.",
      name: "Daniel Osei",
      role: "Head of Growth, Arclight",
      initials: "DO",
      from: "#7c3aed",
      to: "#2a1358",
    },
  ],
} as const;

export const projects = {
  eyebrow: "Our work",
  title: "Built hundreds of Web3 projects",
  items: [
    {
      category: "Crypto / ICO / DEX",
      title: "Liquidity from day one",
      body: "Token launch strategy covering exchange relationships, market-maker introductions and the investor narrative that carried the raise.",
      visual: { label: "DEX launch", from: "#f7a21a", to: "#4a2a04" },
    },
    {
      category: "NFT",
      title: "Collections that sell out",
      body: "Whitelist mechanics, creator partnerships and mint-day coordination for collections that needed demand, not just impressions.",
      visual: { label: "NFT drop", from: "#ea580c", to: "#431407" },
    },
    {
      category: "Gaming",
      title: "Players before launch",
      body: "Playtest funnels, creator seeding and Discord programmes that filled servers ahead of early access.",
      visual: { label: "Game launch", from: "#16a34a", to: "#052e16" },
    },
    {
      category: "Infrastructure",
      title: "Developer adoption",
      body: "Technical content, hackathon sponsorships and docs-led growth for protocols selling to engineers rather than traders.",
      visual: { label: "Protocol growth", from: "#2563eb", to: "#0a1a3d" },
    },
  ],
} as const;

export const blog = {
  eyebrow: "Blog & insights",
  title: "Check Our Company Inside Story",
  subtitle:
    "Playbooks, post-mortems and the occasional strong opinion about this industry.",
  posts: [
    {
      title: "How to price a token launch campaign",
      category: "Strategy",
      readTime: "6 min read",
      from: "#1d4ed8",
      to: "#0b1d4a",
    },
    {
      title: "Discord is not a marketing channel",
      category: "Community",
      readTime: "4 min read",
      from: "#7c3aed",
      to: "#2a1358",
    },
    {
      title: "What we learned from 300 Web3 launches",
      category: "Research",
      readTime: "11 min read",
      from: "#ea580c",
      to: "#431407",
    },
    {
      title: "Paid social for products nobody understands yet",
      category: "Paid",
      readTime: "7 min read",
      from: "#0891b2",
      to: "#083344",
    },
    {
      title: "The metrics your investors actually ask about",
      category: "Reporting",
      readTime: "5 min read",
      from: "#16a34a",
      to: "#052e16",
    },
    {
      title: "Writing a narrative that survives a bear market",
      category: "Positioning",
      readTime: "9 min read",
      from: "#be123c",
      to: "#4c0519",
    },
  ],
} as const;

export const awards = {
  title: "Award Winning",
  subtitle:
    "Recognised for the work, not the pitch deck — by the people who had to live with the results.",
  people: [
    {
      name: "Zain Haider",
      role: "Founder & Strategy Lead",
      from: "#ef7914",
      to: "#2a1402",
    },
    {
      name: "Marcus Hale",
      role: "Head of Community",
      from: "#2563eb",
      to: "#0a1a3d",
    },
    {
      name: "Imran Qureshi",
      role: "Creative Director",
      from: "#7c3aed",
      to: "#1f0f3d",
    },
  ],
} as const;

export const faqs = {
  title: "Digital Marketing FAQs",
  body: "An everyday digital marketing agency, we are dedicated to providing something extraordinary and valuable to our clients. If your question isn't here, ask us directly.",
  ctas: [
    { label: "More questions", href: "#contact", variant: "primary" },
    { label: "Contact us", href: "#contact", variant: "secondary" },
  ],
  items: [
    {
      question: "Why is digital marketing important for my business?",
      answer:
        "Because that's where your buyers already are. Digital channels let you reach a defined audience, measure what each pound returned, and change course in days rather than at the end of a campaign.",
    },
    {
      question: "How can digital marketing help improve my website's visibility?",
      answer:
        "Search, content and technical SEO compound. We fix what's blocking indexing, build the pages that answer real queries, and earn the links that make them rank.",
    },
    {
      question: "How long does it take to see results from digital marketing?",
      answer:
        "Paid channels show signal within two weeks. Organic search and community typically take three to six months to move meaningfully — we report on leading indicators in the meantime so you aren't flying blind.",
    },
    {
      question: "How do you measure the success of a campaign?",
      answer:
        "Against the metric we agreed before launch — not impressions. Every campaign ships with a target, a baseline and a weekly report showing the gap.",
    },
    {
      question: "Do you work with pre-launch projects?",
      answer:
        "Often. Pre-launch is where positioning decisions are cheapest to make and most expensive to get wrong, so it's usually the best time to bring us in.",
    },
  ],
} as const;

export const finalCta = {
  title: "Ready to work with us ?",
  cta: { label: "Contact us", href: "/#contact" },
} as const;

export const footer = {
  description:
    "We offer a comprehensive suite of digital marketing services that cover all aspects of your online presence. From SEO and social media marketing to content creation and PPC advertising, we have the expertise and resources to handle your diverse marketing needs.",
  newsletter: {
    name: { label: "Your name", placeholder: "Your name" },
    email: { label: "Email address", placeholder: "Enter your email" },
    button: "Get Fresh Leads",
  },
  socials: [
    { label: "X", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "Telegram", href: "#" },
  ],
  legal: "© 2026 BullShill. All Rights Reserved",
  legalLinks: [
    { label: "Contact us", href: "/#contact" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms & Conditions", href: "#" },
  ],
} as const;

export const services = {
  eyebrow: "Our services",
  title: "What We Do",
  cta: { label: "View all services", href: "/services" },
  items: [
    {
      title: "Complete Token Marketing",
      body: "From crafting a strategy marketing plan for a successful token launch, through to exchange listings and sustained community growth — we run the whole campaign.",
      tags: ["Token Launch", "NFT Marketing", "Metaverse Hype"],
      href: "#contact",
      visual: {
        label: "Token launch campaign",
        from: "#1d4ed8",
        to: "#0b1d4a",
      },
    },
    {
      title: "Social Media Marketing",
      body: "We build and run the channels your community actually lives in — X, Telegram, Discord and TikTok — with content calendars, moderation and paid amplification.",
      tags: ["Content Strategy", "Community", "Paid Social"],
      href: "#contact",
      visual: { label: "Always-on social", from: "#2563eb", to: "#111b3d" },
    },
    {
      title: "AI Product Launch",
      body: "Positioning, narrative and go-to-market for AI products — so your launch reads as a category definition rather than another model announcement.",
      tags: ["Positioning", "GTM Strategy", "PR & Media"],
      href: "#contact",
      visual: { label: "AI go-to-market", from: "#7c3aed", to: "#1a0f3d" },
    },
    {
      title: "NFT Marketing & Promotion",
      body: "Mint-day demand, collector acquisition and secondary-market momentum, backed by creator partnerships and whitelist campaigns that convert.",
      tags: ["Mint Strategy", "Creator Partnerships", "Whitelist"],
      href: "#contact",
      visual: { label: "NFT collection launch", from: "#ea580c", to: "#3b1405" },
    },
  ],
} as const;
