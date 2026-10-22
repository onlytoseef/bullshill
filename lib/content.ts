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
  name: "Bullshill",
  announcement: "Hype is engineered, not hoped for",
} as const;

export const nav = {
  /** Shown to the left of the wordmark on desktop. */
  left: [
    { label: "Services", href: "/services" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Blog", href: "/blog" },
  ],
  /** Shown to the right of the wordmark on desktop. */
  right: [
    { label: "Team", href: "/#about" },
    { label: "Testimonials", href: "/#testimonials" },
  ],
  cta: { label: "Contact us", href: "/contact" },
} as const;

export const contactPage = {
  title: "Contact us",
  subtitle: "Submit your query below",
  fields: [
    { name: "name", label: "Name", type: "text", placeholder: "John", autoComplete: "name" },
    { name: "phone", label: "Phone Number", type: "tel", placeholder: "+92 21", autoComplete: "tel" },
    { name: "email", label: "Email", type: "email", placeholder: "submit.com@gmail.com", autoComplete: "email" },
  ],
  message: { name: "message", label: "Message", placeholder: "Write your message here" },
  submit: "Submit",
  schedule: {
    title: "Let's Talk About Your Project",
    subtitle: "Need help with UI/UX, Advertising Design, or AI Creative Campaigns?",
    label: "Schedule a Google Meet Call",
    button: "Google Meet",
    note: "Click to schedule a free 30 min call.",
    /** Placeholder — swap for the real booking link. */
    href: "https://meet.google.com/",
  },
} as const;

export const hero = {
  headline: [
    [{ text: "We Turn Zero Followers into" }],
    [{ text: "Million-Dollar Communities.", accent: true }],
  ] satisfies HeadlineSegment[][],
  subcopy:
    "End-to-end marketing for tokens, memecoins, AI projects and NFTs. We build the community, create the FOMO, and keep the momentum going after launch.",
  cta: { label: "Book your free strategy call", href: "#contact" },
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
  eyebrow: "About Bullshill",
  bodyLead: "You build the product.",
  bodyAccent: "We build the community that believes in it.",
} as const;

export const stats = [
  { value: 500, suffix: "+", label: "Web3 & AI Projects" },
  { value: 3000, suffix: "+", label: "Digital Marketing Projects" },
  { text: "Top Rated", label: "Upwork and Fiverr" },
  { value: 10, prefix: "$", suffix: "M+", label: "Client Revenue Generated" },
] as const;

/**
 * The standalone /services page.
 *
 * Each item carries its own tags, side caption and button label. `cta.href` is
 * where the detail-page button points; the list page's cards link to the
 * per-service route instead.
 */
export const servicesPage = {
  eyebrow: "Our services",
  title: "What We Do",
  cta: { href: "/#contact" },
  items: [
    {
      slug: "ico-token-launches",
      title: "ICO / Token Launches",
      body: "From the first strategy session to post-launch growth, we run full-scale crypto marketing for tokens, ICOs and presales. We handle token promotion across X, Telegram, Discord and Reddit, build the community that fills your presale, and keep momentum going after you list. Whether you're launching a token, memecoin, DEX, DAO or Web3 game, we cover every step of your marketing.",
      tags: ["Token Promotion", "ICO Marketing", "Token Presale", "Crypto Marketing"],
      caption:
        "We support your token at every stage: presale, launch day and everything after.",
      button: "Launch your token",
      visual: { label: "Token launch", from: "#1b1033", to: "#05030c" },
    },
    {
      slug: "memecoin-marketing",
      title: "Memecoin Marketing",
      body: "We help create, launch and market memecoins that get noticed fast. From building the meme narrative and viral content to growing your X, Telegram and Discord community, our memecoin marketing is built to create FOMO, drive early holders and carry your coin toward multi-million market caps. Whether you're launching a new memecoin or growing an existing one, we handle every stage, from pre-launch hype to post-launch retention.",
      tags: ["Memecoin Marketing", "Memecoin Launch", "Memecoin Promotion", "Memecoin Community"],
      caption:
        "Memecoin marketing that builds hype before launch and keeps holders engaged after listing.",
      button: "Launch your memecoin",
      visual: { label: "Memecoin launch", from: "#2f0f3a", to: "#0b0310" },
    },
    {
      slug: "ai-product-marketing",
      title: "AI Tools and Product Marketing",
      body: "We help AI tools, automation products and AI-powered startups get discovered, adopted and talked about. From positioning your product and creating clear educational content to growing your presence on X, Reddit, Telegram and Discord, we build the brand awareness that turns curious visitors into active users. Already building on Web3? We also handle the tokenization of your AI product, with community and launch marketing to match.",
      tags: ["AI Tool Marketing", "Product Launch", "Brand Awareness", "AI Tokenization"],
      caption:
        "AI product marketing built for visibility, adoption and long-term brand awareness.",
      button: "Market your AI product",
      visual: { label: "AI go-to-market", from: "#2a2a30", to: "#0a0a0d" },
    },
    {
      slug: "nft-marketing",
      title: "NFT Marketing and Promotion",
      body: "We help NFT projects build hype, grow loyal communities and sell out their collections. From pre-mint buzz and whitelist campaigns to NFT promotion across X, Discord and Telegram, we handle the marketing that turns collectors into holders and holders into advocates. Whether you're preparing a new mint or reviving an existing collection, we support every stage, from launch to secondary market momentum.",
      tags: ["NFT Marketing", "NFT Promotion", "NFT Community", "Mint Strategy"],
      caption:
        "From pre-mint hype to sold-out collections, we build the community your NFT project needs.",
      button: "Promote your NFT project",
      visual: { label: "NFT collection", from: "#3b5bdb", to: "#141a4d" },
    },
    {
      slug: "community-growth",
      title: "Community Growth and Management",
      body: "We grow and manage the Telegram and Discord communities behind trading projects, utility tokens and memecoins. From launching your group and attracting real members to moderating daily chat, running AMAs and keeping holders engaged, we build communities that stay active long after launch day. Whether you need your first thousand members or a team to manage an existing community, we handle growth, moderation and retention in one plan.",
      tags: ["Telegram Growth", "Discord Growth", "Community Management", "Crypto Community"],
      caption:
        "Grow your Telegram and Discord with engaged members, active chats and strong moderation.",
      button: "Grow your community",
      visual: { label: "Community channels", from: "#0f2b4a", to: "#04101c" },
    },
    {
      slug: "x-marketing",
      title: "X Marketing (Twitter Manager)",
      body: "We grow crypto projects on X (formerly Twitter) with a strategy built for Crypto Twitter. From managing your handle and posting daily to growing real X followers, running giveaways and meme campaigns, and engaging the right communities, our X marketing builds visibility, trust and a following that actually reads, shares and buys in. Whether you're launching a memecoin, a token or an NFT collection, or growing an existing account, we handle the content, engagement and growth for you.",
      tags: ["X Marketing", "X Promotion", "Twitter Followers", "Crypto Twitter"],
      caption:
        "Grow your X followers with consistent content, smart engagement and campaigns that get your project noticed.",
      button: "Grow your X account",
      visual: { label: "X / Twitter", from: "#f4f4f5", to: "#b8babf" },
    },
    {
      slug: "reddit-marketing",
      title: "Reddit Marketing",
      body: "We grow your brand on Reddit the way Reddit actually rewards: with real participation, not spam. We find the right subreddits for your project, publish posts that earn upvotes, build karma and brand presence through genuine comments, and manage your account so your project shows up where your audience is already talking. Our Reddit marketing also supports GEO and AEO, helping your brand get cited and recommended by AI search tools like ChatGPT and Perplexity, since Reddit threads are a major source for their answers.",
      tags: ["Reddit Marketing", "Subreddit Targeting", "Reddit Karma Growth", "GEO and AEO"],
      caption:
        "Reddit marketing that builds brand awareness through the right subreddits, real comments and posts that earn trust.",
      button: "Grow on Reddit",
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
      title: "Discovery Call",
      body: "We start with a live call to understand your goals, target audience, and project scope. This is where we align on expectations, timelines, and what success looks like for your brand or project.",
      x: 0,
      y: 0,
    },
    {
      title: "Strategy & Planning",
      body: "Based on the discovery call, we develop a tailored execution plan — covering content direction, platform strategy, milestones, and deliverables. You review and approve the plan before we move forward, so there are no surprises later.",
      x: 54,
      y: 19,
    },
    {
      title: "Execution & Implementation",
      body: "Our team gets to work — content creation, campaign management, community engagement, or whatever the project calls for. We follow the approved plan closely while staying flexible to real-time market or platform shifts.",
      x: 4,
      y: 38,
    },
    {
      title: "Weekly Reporting & Optimization",
      body: "Every week, you get a clear report on progress, performance, and next steps. We use this checkpoint to fine-tune the strategy based on what’s working, keeping the project on track toward your goals.",
      x: 54,
      y: 57,
    },
    {
      title: "Ongoing Communication",
      body: "Beyond weekly reports, we stay reachable for quick calls or check-ins whenever needed — so you’re never left wondering where things stand.",
      x: 8,
      y: 76,
    },
  ],
} as const;

export const partners = {
  title: "Our partners",
  subtitle: "Trusted by teams at over 1,000 of the world's leading organizations",
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
    "Real stories from real clients. See why 250+ brands trust NinjaPromo to move their KPIs.",
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
        "We'd burned through two agencies before this. Bullshill shipped more in the first month than either managed in a quarter.",
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
      title: "Crypto / ICO / DEX",
      body: "From crafting a strategic marketing plan for a successful launch to assisting in community building, we specialize in full-scale marketing for any Web3 or crypto project.",
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
  eyebrow: "Blog section",
  title: "Check Our Company Inside Story",
  subtitle:
    "Exchange Your Products With Founders and In Return Use Their Products For FREE!",
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

export type BlogPost = {
  /** Unique — the design repeats titles, so keys and future routes use this. */
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  /** Which "More to read" filters this post answers to. */
  filters: readonly string[];
  /** Gradient stand-in until real art lands in `public/assets/images/`. */
  from: string;
  to: string;
};

/**
 * The /blog index. Separate from `blog` above, which is the teaser strip on the
 * home page.
 *
 * Copy and the repeated titles are lifted straight from the design — the client
 * supplied dummy articles, so expect these to be replaced wholesale once real
 * posts exist.
 */
export const blogPage = {
  eyebrow: "Latest news updates",
  title: "Check our company inside story",
  subtitle:
    "We deliver data-driven, end-to-end marketing strategies that build hype, drive community engagement, and secure lasting momentum",
  cta: { label: "Find out more", href: "#more-to-read" },

  featured: {
    slug: "sustain-hype-after-launch",
    title: "How Do I Sustain Hype After",
    excerpt:
      "Launching a meme coin is exciting and overwhelming, but keeping it alive and hype after the launch is a big",
    date: "August 15, 2025",
    category: "Community Building",
    filters: ["Featured", "Crypto"],
    from: "#0ea5e9",
    to: "#082f49",
  },

  /** The pair sitting directly under the featured post. */
  secondary: [
    {
      slug: "best-telegram-groups",
      title: "What Are The Best Telegram",
      excerpt:
        "If you want your meme coin to grow, Telegram and Discord are not optional, in fact they are the heart",
      date: "August 10, 2025",
      category: "Community Building",
      filters: ["Crypto"],
      from: "#16a34a",
      to: "#052e16",
    },
    {
      slug: "landing-page-mobile-friendly",
      title: "Is Your Landing Page Mobile-Friendly?",
      excerpt:
        "Find out why a great mobile experience is super important and how to make your page look awesome",
      date: "August 5, 2025",
      category: "Content creation",
      filters: ["Content creation"],
      from: "#f59e0b",
      to: "#44270b",
    },
  ] satisfies BlogPost[],

  more: {
    title: "More to read",
    /** First entry is the default and shows everything. */
    filters: ["All articles", "Featured", "Content creation", "Crypto"],
    cta: { label: "Find out more", href: "/#contact" },
    posts: [
      {
        slug: "best-telegram-groups-growth",
        title: "What Are The Best Telegram",
        excerpt:
          "If you want your meme coin to grow, Telegram and Discord are not optional, in fact they are the heart",
        date: "August 10, 2025",
        category: "Community Building",
        filters: ["Featured", "Crypto"],
        from: "#d9820a",
        to: "#3a1d02",
      },
      {
        slug: "landing-page-mobile-experience",
        title: "Is Your Landing Page Mobile-Friendly?",
        excerpt:
          "Find out why a great mobile experience is super important and how to make your page look awesome",
        date: "August 5, 2025",
        category: "Content creation",
        filters: ["Content creation"],
        from: "#16a34a",
        to: "#05291a",
      },
      {
        slug: "best-telegram-groups-moderation",
        title: "What Are The Best Telegram",
        excerpt:
          "If you want your meme coin to grow, Telegram and Discord are not optional, in fact they are the heart",
        date: "August 10, 2025",
        category: "Crypto",
        filters: ["Crypto"],
        from: "#6b7280",
        to: "#1f2937",
      },
      {
        slug: "landing-page-conversion",
        title: "Is Your Landing Page Mobile-Friendly?",
        excerpt:
          "Find out why a great mobile experience is super important and how to make your page look awesome",
        date: "August 5, 2025",
        category: "Content creation",
        filters: ["Content creation", "Featured"],
        from: "#eab308",
        to: "#0b3a22",
      },
    ] satisfies BlogPost[],
  },
} as const;

/** Every slug the /blog index links to — drives the static detail routes. */
export const blogSlugs: readonly string[] = [
  blogPage.featured,
  ...blogPage.secondary,
  ...blogPage.more.posts,
].map((post) => post.slug);

/**
 * The /blog/[slug] detail page.
 *
 * The design ships one dummy article, so every slug renders this same copy
 * until real posts exist. Only the opening section has body copy in the
 * mockup; later sections appear once they are given `paragraphs`.
 */
export const blogArticle = {
  title:
    "Mastering ChatGPT Blog Creation: Dos and Don'ts for SaaS Marketing Managers",
  date: "Oct 19",
  readTime: "10 min read",
  /** Gradient stand-in until real art lands in `public/assets/images/`. */
  visual: { from: "#0ea5e9", to: "#082f49" },
  author: {
    name: "Jawad",
    role: "Founder/CEO",
    bio: "With 11 years in SaaS, I've built MillionVerifier and SAAS First. Passionate about SaaS, data, and AI. Let's connect if you share the same drive for success!",
    linkedin: "#",
  },
  share: {
    title: "Share with your community!",
    networks: ["Facebook", "X", "LinkedIn"],
  },
  tocTitle: "In this article",
  sections: [
    {
      id: "exploring-generative-ai",
      title: "Exploring Generative AI in Content Creation",
      paragraphs: [
        "Hello there! As a marketing manager in the SaaS industry, you might be looking for innovative ways to engage your audience. I bet generative AI has crossed your mind as an option for creating content. Well, let me share from my firsthand experience.",
        "Google encourages high-quality blogs regardless of whether they're written by humans or created using artificial intelligence like ChatGPT. Here's what matters: producing original material with expertise and trustworthiness based on Google E-E-A-T principles.",
        "This means focusing more on people-first writing rather than primarily employing AI tools to manipulate search rankings. There comes a time when many experienced professionals want to communicate their insights but get stuck due to limited writing skills – that's where Generative AI can step in.",
        "So, together, we're going explore how this technology could help us deliver valuable content without sounding robotic or defaulting into mere regurgitations of existing materials (spoiler alert – common pitfalls!). Hang tight – it'll be a fun learning journey!",
      ],
    },
    {
      id: "common-ai-writing-pitfalls",
      title: "Steering Clear of Common AI Writing Pitfalls",
      paragraphs: [],
    },
    {
      id: "chatgpt-capabilities",
      title: "Understanding ChatGPT Capabilities – Define Your Style",
      paragraphs: [],
    },
    {
      id: "understand-your-readers",
      title: "Understand Your Readers",
      paragraphs: [],
    },
    {
      id: "quality-ai-powered-blogs",
      title: "Creating Quality AI-powered Blogs that Stand Out",
      paragraphs: [],
    },
    {
      id: "conclusion",
      title: "Conclusion: Embracing AI in Blog Creation",
      paragraphs: [],
    },
    {
      id: "afterword",
      title: "Afterword: The AI Behind This Article",
      paragraphs: [],
    },
  ] as { id: string; title: string; paragraphs: string[] }[],
} as const;

export type CaseStudy = {
  slug: string;
  client: string;
  /** Opening clause — rendered brighter than the rest of the summary. */
  summaryLead: string;
  summaryRest: string;
  /** The three headline wins, shown as bordered chips. */
  achievements: readonly string[];
};

/**
 * The /case-studies index.
 */
export const caseStudiesPage = {
  eyebrow: "Client Results & Case Studies",
  title: "Crypto Marketing Case Studies",
  subtitle:
    "Bullshill is a crypto marketing agency based in Dubai, founded in 2020. Trusted by Binance, Bybit, Algorand, Canton, OKX, and Polymarket.",
  cta: { label: "View case studies", href: "#case-studies" },
  /** Per-row link label — each row points at `/case-studies/${slug}`. */
  readCta: { label: "Read full case study" },
  moreCta: { label: "Find out more", href: "/#contact" },
  items: [
    {
      slug: "xera",
      client: "$XERA Community Growth Success",
      summaryLead:
        "We executed a comprehensive Web3 marketing strategy for XERA,",
      summaryRest:
        " driving organic community expansion, strengthening investor engagement, and increasing market visibility through targeted campaigns and consistent outreach.",
      achievements: [
        "Executed Complete Community Growth & Marketing Management",
        "Helped Grow XERA's Community to 13.98K+ Token Holders",
        "Strengthened Market Visibility as Market Cap Reached $665.31M",
      ],
    },
    {
      slug: "amalas",
      client: "$Amalas Successful Launch",
      summaryLead:
        "We executed a complete pre-launch and post-launch marketing strategy for Amalas,",
      summaryRest:
        " helping drive $1.7M in trading volume within 24 hours, attract 1,100 holders in the first week, and establish a strong market presence.",
      achievements: [
        "Executed Complete Pre-Launch & Post-Launch Marketing",
        "Helped Drive $1.7M Trading Volume Within 24 Hours",
        "Reached 1,100 Holders in Week One & Achieved Bitget Listing",
      ],
    },
    {
      slug: "avx",
      client: "$AVX Successful Fundraising Campaign",
      summaryLead:
        "We supported Avirvox's token fundraising campaign through strategic marketing and project positioning,",
      summaryRest:
        " contributing to a successful $500K raise to support product development and ecosystem expansion.",
      achievements: [
        "Executed Strategic Token Fundraising & Marketing Campaign",
        "Helped Raise $500K for Product Development",
        "Strengthened Investor Awareness & Ecosystem Visibility",
      ],
    },
    {
      slug: "pcp",
      client: "$PCP Memecoin Successful Launch",
      summaryLead:
        "We executed a targeted launch marketing strategy for $PCP memecoin,",
      summaryRest:
        " helping establish strong initial market visibility and supporting a successful debut that recorded $1.6M in trading volume on launch day.",
      achievements: [
        "Executed Strategic Memecoin Launch Marketing Campaign",
        "Helped Achieve $1.6M Trading Volume on Launch Day",
        "Drove Initial Market Visibility & Community Engagement",
      ],
    },
  ] satisfies CaseStudy[],
} as const;

/**
 * The /case-studies/[slug] detail page.
 *
 * Title, summary and artwork come from the matching `caseStudiesPage` item;
 * everything below is the one dummy story the design ships, shared by every
 * slug until real write-ups exist. A `\n` inside a paragraph is a deliberate
 * line break from the design.
 */
export const caseStudyDetail = {
  metrics: ["25M+ Impressions", "10K+ New users", "$250K+ Affiliate Revenue"],
  blocks: [
    {
      eyebrow: "The Challenge",
      title: "Turning a Regulatory Milestone Into Real European Growth",
      paragraphs: [
        "Algorand Foundation had just secured its MiCA license.\nThe EU market brought a distinct set of obstacles: trust-sensitive consumers, heavy regulatory scrutiny, and a competitive field running near-identical messaging.",
      ],
    },
    {
      eyebrow: "Why Bullshill",
      title: "The Right Partner for a Compliance-First, Creator-Led Launch",
      paragraphs: [
        "Bybit needed a partner with deep roots in the European crypto creator ecosystem and the strategic capability to balance compliance-first messaging with authentic, high-converting content.",
        "Bullshill's KOL network, narrative expertise, and EU market experience made it the right fit.",
      ],
    },
    {
      eyebrow: "The Solution",
      title: "A Three-Track Campaign Built for Trust and Conversion",
      paragraphs: [
        "Bullshill acted as Bybit's strategic marketing and communications partner for the full EU rollout, executing across three integrated workstreams that reinforced each other at every touchpoint.",
      ],
    },
  ],
  tracks: [
    {
      title: "KOL Marketing & Creator Activation",
      body: "We activated a targeted selection of crypto-native creators across X, YouTube and Telegram, chosen for audience quality over follower count. Each creator received a tailored brief and tracked links, so every post could be tied back to sign-ups and funded accounts.",
    },
    {
      title: "Narrative & Campaign Structuring",
      body: "Before any content went live, we developed the overarching campaign narrative and sequenced it into phases: announce, educate and convert. That gave creators, media and the client's own channels one consistent story to tell.",
    },
    {
      title: "PR & Communications Support",
      body: "We coordinated media coverage and PR alignment to ensure consistent messaging across press and owned channels, reinforcing the campaign narrative with third-party credibility.",
    },
  ],
  results: {
    eyebrow: "Campaign Results",
    title: "Numbers That Speak for Themselves",
    subtitle: "Numbers That Speak for Themselves",
    stats: [
      { value: "2.5M+", label: "Total Impressions" },
      { value: "10K+", label: "New EU Users" },
      { value: "8.25%", label: "Click-Through Rate" },
      { value: "$9.8", label: "CPM" },
      { value: "$250K+", label: "Affiliate Revenue" },
    ],
  },
} as const;

export const awards = {
  eyebrow: "Our team",
  title: "Award Winning",
  subtitle:
    "Led by Web3 founders and backed by a 40-person team that runs your marketing from first post to post-launch growth.",
  people: [
    {
      name: "Jawad Ahmad",
      role: "CEO / Founder",
      from: "#1e3a5f",
      to: "#0a1727",
    },
    {
      name: "Zeeshan",
      role: "Team Lead | Business Manager",
      from: "#1e3a5f",
      to: "#0a1727",
    },
    {
      name: "Bilal",
      role: "Organic Growth Expert",
      from: "#1e3a5f",
      to: "#0a1727",
    },
    { name: "Adnan Hussain", role: "", from: "#1e3a5f", to: "#0a1727" },
    { name: "Faisal Noor", role: "", from: "#1e3a5f", to: "#0a1727" },
    { name: "Junaid Muneer", role: "", from: "#1e3a5f", to: "#0a1727" },
    { name: "M. Saad Akhtar", role: "", from: "#1e3a5f", to: "#0a1727" },
    { name: "Muhammad Faisal", role: "", from: "#1e3a5f", to: "#0a1727" },
    { name: "Muhammad Rehan", role: "", from: "#1e3a5f", to: "#0a1727" },
    { name: "Muhammad Rizwan", role: "", from: "#1e3a5f", to: "#0a1727" },
    { name: "Sadaqat", role: "", from: "#1e3a5f", to: "#0a1727" },
    { name: "Saqib Ijaz", role: "", from: "#1e3a5f", to: "#0a1727" },
    { name: "Usama Abid", role: "", from: "#1e3a5f", to: "#0a1727" },
    { name: "Zaigham", role: "", from: "#1e3a5f", to: "#0a1727" },
  ],
} as const;

export const faqs = {
  title: "Digital Marketing FAQs",
  body: "As a leading digital marketing agency, we are dedicated to providing comprehensive educational resources and answering frequently asked questions to help our clients.",
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
    "Bullshill is a Web3 marketing agency that helps token, memecoin, AI and NFT projects grow. We build communities on X, Telegram, Discord and Reddit, and run the content and launch campaigns behind them.",
  newsletter: {
    name: { label: "Your name", placeholder: "Your name" },
    email: { label: "Email address", placeholder: "Enter your email" },
    button: "Get Your Free Strategy",
  },
  socials: [
    { label: "X", href: "https://x.com/bullshillweb3" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/bullshill" },
    { label: "Instagram", href: "https://www.instagram.com/bullshillweb3/" },
    { label: "Discord", href: "https://discord.gg/EvMRyCRF" },
  ],
  legal: "© 2026 Bullshill. All Rights Reserved",
  legalLinks: [
    { label: "Contact us", href: "/#contact" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
} as const;

export const services = {
  eyebrow: "Our services",
  title: "What We Do",
  caption:
    "End-to-end launch strategies designed to build massive hype, drive presales, and secure token momentum",
  cta: { label: "View all services", href: "/services" },
  items: [
    {
      title: "Complete Token Marketing",
      body: "From crafting a strategy marketing plan for a successful token launch, through to exchange listings and sustained community growth — we run the whole campaign.",
      tags: ["Token Launch", "NFT Promotion", "Memecoin Hype", "ICO Strategy"],
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
