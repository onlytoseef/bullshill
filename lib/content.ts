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
    { label: "Testimonials", href: "/testimonials" },
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
  { text: "TOP RATED", label: "Upwork and Fiverr" },
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
      x: 9,
      y: 0,
    },
    {
      title: "Strategy & Planning",
      body: "Based on the discovery call, we develop a tailored execution plan — covering content direction, platform strategy, milestones, and deliverables. You review and approve the plan before we move forward, so there are no surprises later.",
      x: 63,
      y: 19,
    },
    {
      title: "Execution & Implementation",
      body: "Our team gets to work — content creation, campaign management, community engagement, or whatever the project calls for. We follow the approved plan closely while staying flexible to real-time market or platform shifts.",
      x: 13,
      y: 38,
    },
    {
      title: "Weekly Reporting & Optimization",
      body: "Every week, you get a clear report on progress, performance, and next steps. We use this checkpoint to fine-tune the strategy based on what’s working, keeping the project on track toward your goals.",
      x: 63,
      y: 57,
    },
    {
      title: "Ongoing Communication",
      body: "Beyond weekly reports, we stay reachable for quick calls or check-ins whenever needed — so you’re never left wondering where things stand.",
      x: 17,
      y: 76,
    },
  ],
} as const;

export const partners = {
  title: "Our partners",
  subtitle:
    "Trusted by 3000+ satisfied customers of the world's leading organizations",
} as const;

export const testimonials = {
  eyebrow: "Testimonials",
  title: "What Our Clients Say About Us",
  subtitle:
    "Real feedback from our clients on Fiverr and Upwork, in their own words.",
  items: [
    {
      quote:
        "Jawad and his team have been very professional and are talented at what they do. Communication has been great and I will be using again in the future.",
      name: "jmundloch",
      role: "United States",
      initials: "J",
      from: "#ef7914",
      to: "#7a3c08",
    },
    {
      quote: "Wonderful working with Jawad. Highly recommended !!!!",
      name: "anthony_1303",
      role: "United Arab Emirates",
      initials: "A",
      from: "#2563eb",
      to: "#132a5e",
    },
    {
      quote: "Great everything! would highly recommend.",
      name: "albeearound",
      role: "United States",
      initials: "A",
      from: "#7c3aed",
      to: "#2a1358",
    },
  ],
} as const;

export const reviewsPage = {
  eyebrow: "Client reviews",
  title: "What Our Clients Say About Bullshill",
  subtitle:
    "Every review below was left by a real client — token launches, community growth and full Web3 marketing campaigns, in their own words. Trusted by 3000+ satisfied customers.",
  meta: "Verified client reviews of Bullshill, the crypto and Web3 marketing agency: token launches, community growth, paid campaigns and affiliate programmes, in our clients' own words.",
  cta: { label: "Book free consultation", href: "/contact" },
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

/** The /blog index's posts, in the order the page shows them. */
export const blogPosts: readonly BlogPost[] = [
  blogPage.featured,
  ...blogPage.secondary,
  ...blogPage.more.posts,
];

/** Every slug the /blog index links to — drives the static detail routes. */
export const blogSlugs: readonly string[] = blogPosts.map((post) => post.slug);

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
  detailTitle?: string;
  seoTitle?: string;
  seoDescription?: string;
  /** Headline figures used in the case study hero. */
  metrics?: readonly string[];
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
      slug: "xera-token-launch-marketing",
      client: "$XERA Token Launch",
      detailTitle: "$XERA Case Study: From Token Launch to a $665M Market Cap",
      seoTitle: "How We Helped XERA Reach a $665M Market Cap and 13.98K Holders",
      seoDescription:
        "See how our web3 marketing agency launched the $XERA token, built a global community on X and Telegram, and grew it to a $665M market cap with 13.98K holders.",
      summaryLead:
        "XERA wanted to build a long-term token ecosystem grounded in trust, education, and steady community momentum.",
      summaryRest:
        " We shaped a coordinated launch and community strategy for local and international audiences, growing the project to a $665M market cap and more than 13.98K holders.",
      metrics: ["$665M Market Cap", "13.98K+ Unique Holders", "X and Telegram Communities"],
      achievements: [
        "$665M market cap",
        "13.98K+ unique holders",
        "Active X and Telegram communities",
      ],
    },
    {
      slug: "amalas-token-launch-marketing",
      client: "$AMALAS Token Launch",
      detailTitle: "Amalas Case Study: $1.7M Trading Volume in 24 Hours and a Bitget Listing",
      seoTitle: "How We Launched $AMALAS: $1.7M Trading Volume in 24 Hours and 1,100 Holders in Week One",
      seoDescription:
        "See how our web3 marketing agency ran a full pre-launch and post-launch strategy for Amalas, driving $1.7M in 24-hour volume, 1,100 holders in week one, and a Bitget listing.",
      summaryLead:
        "We ran an end-to-end pre-launch and post-launch campaign to turn early attention into trading volume, holders, and a lasting market presence for Amalas.",
      summaryRest:
        " The launch generated $1.7M in trading volume in 24 hours, reached 1,100 holders in the first week, and achieved a Bitget listing.",
      metrics: ["$1.7M 24-Hour Volume", "1,100 Week-One Holders", "Bitget Listing"],
      achievements: [
        "$1.7M trading volume in 24 hours",
        "1,100 holders in week one",
        "Bitget listing achieved",
      ],
    },
    {
      slug: "avirvox-labs-ai-token-fundraising",
      client: "Avirvox Labs AI Token Fundraising",
      detailTitle: "Avirvox Labs Case Study: From Zero Audience to a $500K Token Raise",
      seoTitle: "How We Helped Avirvox Labs Raise $500K for Its AI Token in 3 Months",
      seoDescription:
        "See how our web3 marketing agency took Avirvox Labs from zero audience to a successful $500K token raise through education, community growth, and influencer marketing.",
      summaryLead:
        "Avirvox Labs started without an audience and needed to build investor understanding and confidence around its AI product and token.",
      summaryRest:
        " We built awareness through education, grew an engaged community, and scaled reach with influencer marketing, supporting a $500K raise in three months.",
      metrics: ["$500K Raised", "3-Month Campaign", "Zero-to-Audience Growth"],
      achievements: [
        "$500K raised for product development and ecosystem expansion",
        "Grew investor attention from zero audience in 3 months",
        "Built community and ecosystem visibility",
      ],
    },
    {
      slug: "pcp-memecoin-launch-marketing",
      client: "$PCP Memecoin Launch",
      detailTitle: "$PCP Memecoin Case Study: $1.6M in Trading Volume on Launch Day",
      seoTitle: "$PCP Memecoin Case Study: $1.6M in Trading Volume on Launch Day",
      seoDescription:
        "See how our Web3 marketing agency launched $PCP with a shareable story and coordinated community campaign, reaching $1.6M in launch-day volume.",
      summaryLead:
        "We built a targeted launch campaign to put $PCP in front of the right audience, activate its community, and turn launch-day attention into trading activity.",
      summaryRest:
        " The memecoin recorded $1.6M in trading volume on launch day and made a strong debut in a crowded market.",
      metrics: ["$1.6M Launch-Day Volume", "Strong Market Visibility", "Engaged Community"],
      achievements: [
        "$1.6M trading volume on launch day",
        "Strong initial market visibility",
        "Engaged community from day one",
      ],
    },
    {
      slug: "dmt-tikabit-noderocks-bitcoin-ordinals",
      client: "DMT Tikabit & Noderocks",
      detailTitle:
        "DMT Tikabit & Noderocks Case Study: Selling Out Bitcoin Ordinals in 48 Hours",
      seoTitle:
        "How We Sold Out a 1,600-Piece Bitcoin Ordinals Collection in 48 Hours",
      seoDescription:
        "See how we co-founded DMT Tikabit and Noderocks, sold out 1,600 ordinals in 48 hours, grew Noderocks from a $16 floor to $400+, and built a loyal Bitcoin ordinals community.",
      summaryLead:
        "We co-founded DMT Tikabit and Noderocks and built both Bitcoin Ordinals projects around community, utility, and long-term participation.",
      summaryRest:
        " DMT Tikabit sold out its 1,600-piece collection in 48 hours, while Noderocks grew from a $16 floor to more than $400 per ordinal.",
      metrics: ["1,600 Ordinals", "48-Hour Sellout", "$400+ Floor"],
      achievements: [
        "Sold out 1,600 DMT Tikabit ordinals in 48 hours",
        "Noderocks grew from a $16 floor to $400+ per ordinal",
        "Built a loyal Bitcoin Ordinals community",
      ],
    },
    {
      slug: "reddit-marketing-aeo-geo-web3-ai",
      client: "Reddit Marketing for Web3 & AI",
      detailTitle:
        "Reddit Marketing Case Study: Growing 200+ Web3 and AI Brands Through Reddit",
      seoTitle:
        "Reddit Marketing Case Study: 200+ Web3 and AI Clients Grown Through Reddit",
      seoDescription:
        "See how our Reddit marketing services helped 200+ crypto wallet, memecoin launchpad, and AI projects grow Reddit accounts, build karma, and boost AEO and GEO visibility.",
      summaryLead:
        "We ran Reddit marketing campaigns for more than 200 crypto wallet, memecoin launchpad, and AI projects.",
      summaryRest:
        " By contributing to relevant communities, managing profiles, and answering real questions, we helped clients build Reddit presence and improve AEO and GEO visibility.",
      metrics: ["200+ Clients", "Web3 and AI", "AEO + GEO Visibility"],
      achievements: [
        "Reddit campaigns for 200+ Web3 and AI clients",
        "Account and karma growth for managed profiles",
        "Stronger presence in Reddit and AI search discussions",
      ],
    },
    {
      slug: "crypto-x-marketing-grow-x-followers",
      client: "Crypto X Marketing for 300+ Web3 Projects",
      detailTitle:
        "Crypto X Marketing Case Study: How We Helped 300+ Web3 Projects Grow on X",
      seoTitle:
        "Crypto X Marketing Case Study: Growing 300+ Web3 Accounts on X",
      seoDescription:
        "See how our X manager services helped 300+ token projects, memecoins, NFT projects, launchpads, exchanges, and prediction sites grow X followers organically with niche-targeted reach.",
      summaryLead:
        "We helped more than 300 token projects, memecoins, NFT projects, launchpads, exchanges, and prediction websites grow their presence on X.",
      summaryRest:
        " Through organic, niche-targeted growth and consistent account management, clients built relevant audiences and a reliable presence without buying followers.",
      metrics: ["300+ Clients", "Organic Follower Growth", "Niche-Targeted Reach"],
      achievements: [
        "Supported 300+ Web3 accounts across multiple categories",
        "Grew relevant X audiences organically",
        "Managed handles with consistent posting and engagement",
      ],
    },
  ] satisfies CaseStudy[],
} as const;

/**
 * The /case-studies/[slug] detail page.
 *
 * Metrics are a fallback for older case studies that do not yet have
 * project-specific figures. XERA supplies its own figures above.
 */
export const caseStudyDetail = {
  metrics: ["25M+ Impressions", "10K+ New users", "$250K+ Affiliate Revenue"],
} as const;

export const xeraCaseStudy = {
  challenge: [
    "Most token launches follow the same pattern: a loud spike, a few weeks of hype, then silence. The XERA team wanted to avoid that. They were building a long-term ecosystem and needed a community based on trust, education, and steady momentum rather than short-term price action.",
    "They came to us with a clear vision and a tough brief. They needed to launch the $XERA token successfully, bring in both local and international communities, and build a brand people would still care about after launch day.",
  ],
  approachIntro:
    "We built a plan around real community-building, with no paid pumps and no empty hype. Every campaign had one job: turn attention into lasting participation.",
  approach: [
    {
      title: "A Launch Strategy for Local and International Communities",
      body: "We ran separate campaigns for local and global audiences, so each group got messaging that fit its culture, language, and interests. The result was a launch with momentum in several regions at once rather than in a single market.",
    },
    {
      title: "Meme Contest Funnels from X to Telegram",
      body: "To move XERA’s audience from X into Telegram, we ran an exclusive meme contest where joining the Telegram group was the entry requirement. The contest was fun and shareable, and it produced a strong, organic surge in Telegram traffic without any paid shortcuts.",
    },
    {
      title: "Educational Video Content Before Launch",
      body: "We didn’t wait for launch day to start the conversation. Our team produced professionally edited videos explaining XERA’s upcoming ecosystem features well in advance. By the time the token went live, the community already understood what it was backing.",
    },
    {
      title: "Daily Posting and Community Engagement",
      body: "We kept a strict daily posting schedule on X and Telegram, so the community always knew what was happening. Alongside that, we ran daily outreach across relevant crypto communities, which kept XERA visible and brought in fresh traffic day after day.",
    },
    {
      title: "Trend-Driven Campaigns",
      body: "When the FIFA World Cup created a wave of attention, we ran a prediction-based giveaway around it. The winners were onboarded directly into the XERA ecosystem, so a trending moment turned into real holders.",
    },
    {
      title: "Live Founder Sessions",
      body: "We organized live Zoom sessions with XERA’s founder, where the community could hear about the roadmap and operations directly. In a market where trust is the scarcest resource, this kind of transparency set XERA apart.",
    },
    {
      title: "Content Aligned with the Project’s Vision",
      body: "All of this ran on a content strategy built around XERA’s long-term vision. Every post, video, and campaign reinforced the same message, so the brand felt consistent and credible everywhere it appeared.",
    },
  ],
  resultCards: [
    { value: "$665M", label: "Market cap" },
    { value: "13.98K+", label: "Unique holders" },
    { value: "Ecosystem", label: "Built for holders, not just a token" },
    { value: "Communities", label: "Active on X and Telegram" },
  ],
  takeaways: [
    {
      title: "Educate before you sell.",
      body: "Pre-launch content builds understanding, and understanding builds conviction.",
    },
    {
      title: "Funnel your audience.",
      body: "Moving followers from X into Telegram creates a community you can engage directly.",
    },
    {
      title: "Show up daily.",
      body: "Consistency keeps a project visible and builds trust.",
    },
    {
      title: "Use trends strategically.",
      body: "Timely campaigns like the World Cup giveaway turn attention into onboarding.",
    },
    {
      title: "Let the founder be visible.",
      body: "Direct transparency builds the trust that lasting communities depend on.",
    },
  ],
  ctaTitle: "Planning a Token Launch?",
  ctaBody:
    "We help crypto projects with token launches, X and Telegram growth, community building, and end-to-end marketing. If you want a launch built for lasting growth, get in touch with our team to discuss your project.",
} as const;

export const amalasCaseStudy = {
  challenge: [
    "A token launch is decided in its first 24 hours. If the right audience isn’t already waiting, volume stays thin, holders drift away, and the project loses momentum before it starts.",
    "Amalas came to us with that pressure. They needed more than launch-day visibility. They needed a marketing plan covering the weeks before the token went live and the critical period after, so early attention would turn into real holders and a lasting market presence.",
  ],
  approachIntro:
    "We treated the launch as one continuous campaign in three phases, each setting up the next.",
  approach: [
    {
      title: "Phase 1: Pre-Launch, Building Anticipation",
      body: "Before the token went live, our focus was making sure people already knew and cared about Amalas.",
      bullets: [
        "Narrative and positioning: We defined what Amalas stands for and how to explain it simply, so people could understand it quickly and share it.",
        "Community foundations: We built the social channels and early audience that would be ready to participate on day one.",
        "Content that educates: We created posts and creative designed to explain the project and build curiosity ahead of the launch.",
      ],
    },
    {
      title: "Phase 2: Launch Day, Converting Attention into Volume",
      body: "With the audience primed, launch day was about coordination. Messaging, community activity, and content were timed together so interest turned into trading activity at the same moment. The result was $1.7M in trading volume within the first 24 hours, a strong sign that the pre-launch groundwork had created real demand.",
    },
    {
      title: "Phase 3: Post-Launch, Keeping the Momentum",
      body: "Many projects lose momentum right after launch. We kept the campaign running with consistent content and updates so holders knew what was happening, active community management to keep new holders engaged and informed, and market-facing storytelling to keep Amalas visible beyond the launch window.",
    },
  ],
  resultCards: [
    { value: "$1.7M", label: "Trading volume within 24 hours" },
    { value: "1,100", label: "Holders in the first week" },
    { value: "Bitget", label: "Exchange listing achieved" },
    { value: "Day one", label: "Strong, established market presence" },
  ],
  takeaways: [
    {
      title: "Launch marketing starts before launch.",
      body: "Pre-launch work decides how strong day one will be.",
    },
    {
      title: "Plan for after the launch.",
      body: "Post-launch support turns early buyers into long-term holders.",
    },
    {
      title: "Coordinate everything.",
      body: "Timing content, community, and messaging together creates momentum that scattered efforts can’t.",
    },
    {
      title: "Build for credibility.",
      body: "Strong early numbers help a project earn exchange listings like Bitget.",
    },
  ],
  ctaTitle: "Planning a Token Launch?",
  ctaBody:
    "We handle token launches end to end, from pre-launch strategy to post-launch growth on X, Telegram, and Discord. Contact our team to talk about your launch.",
} as const;

export const pcpCaseStudy = {
  challenge: [
    "Memecoins live and die on attention. With thousands of new tokens launching every week, a coin that doesn’t make noise in its first hours is usually forgotten by the end of the day.",
    "The $PCP team came to us with a clear need: a debut that would get noticed. They needed strong market visibility, an engaged community ready to participate, and a marketing plan that would turn curiosity into trading activity at launch.",
  ],
  approachIntro:
    "We built a targeted launch campaign around one goal: make sure the right people knew about $PCP, understood the idea, and were ready to act when trading opened.",
  approach: [
    {
      title: "A Clear, Shareable Narrative",
      body: "Memecoins spread when people can explain them in a sentence and want to share them. We shaped $PCP’s story and tone into something simple, memorable, and easy to pass along.",
    },
    {
      title: "Strategic Launch Marketing",
      body: "Instead of scattered posting, we planned the campaign around the launch window. Content, messaging, and community activity were timed together so attention peaked when trading went live.",
    },
    {
      title: "Building Market Visibility",
      body: "We pushed $PCP in front of the audiences most likely to care about it, creating the initial visibility a new memecoin needs to get discovered.",
    },
    {
      title: "Community Engagement",
      body: "A memecoin is only as strong as its community. We focused on activating early supporters and keeping conversations active, so launch day had real participants rather than silence.",
    },
  ],
  resultCards: [
    { value: "$1.6M", label: "Trading volume on launch day" },
    { value: "Visibility", label: "Strong initial market visibility for $PCP" },
    { value: "Community", label: "Engaged from the first day of trading" },
    { value: "Debut", label: "Successful launch in a crowded memecoin market" },
  ],
  takeaways: [
    {
      title: "Visibility comes before volume.",
      body: "Launch-day trading follows launch-week awareness.",
    },
    {
      title: "Keep the story simple.",
      body: "The easiest memecoin narratives to share are the ones that spread fastest.",
    },
    {
      title: "Time everything together.",
      body: "Coordinated content and community activity beat scattered effort.",
    },
    {
      title: "Community is the engine.",
      body: "Engaged early supporters keep momentum going after the first hours.",
    },
  ],
  ctaTitle: "Launching a Memecoin?",
  ctaBody:
    "We help create and launch memecoins, build hype, and grow communities fast. Get in touch with our team to plan your launch.",
} as const;

export const avirvoxCaseStudy = {
  challenge: [
    "AI is one of the most crowded narratives in crypto. Every week brings new AI tokens, and investors have learned to be skeptical of projects that can’t explain what their product does.",
    "Avirvox Labs was building an AI product with a token behind it, and they faced two problems. They had no audience, no followers, and no existing presence. They also needed to raise funds to support product development and ecosystem expansion. Investors fund projects they understand and trust, so the project first had to be understood.",
  ],
  approachIntro:
    "We built the campaign in stages: clarity first, then growth, then scale, then depth. Each stage prepared the ground for the next.",
  approach: [
    {
      title: "Awareness Through Education",
      body: "We started by making sure people understood the product before asking anyone to invest. We created educational and shareable content that made the AI product easier to understand.",
      bullets: [
        "Static educational posts that explained the project’s purpose.",
        "Meme content that simplified complex ideas into something shareable.",
        "Animated content that showed what Avirvox Labs actually does.",
      ],
    },
    {
      title: "Direct Community Engagement",
      body: "While the content went out, we engaged with relevant crypto and AI communities. This was consistent interaction and positioning rather than shortcuts, and it put Avirvox in front of people who cared about the space.",
    },
    {
      title: "Accelerating Growth with Giveaways and Engagement Loops",
      body: "As the audience began to grow, we added giveaway campaigns, structured follower-growth tactics, and community-driven engagement loops. These built early traction and visibility and gave the project a base of active supporters.",
    },
    {
      title: "Scaling with Influencer Marketing",
      body: "With a foundation in place, we moved into influencer marketing. It brought stronger reach, new audience segments, and early investors into the ecosystem, which is what a fundraising campaign needs.",
    },
    {
      title: "Building Investor Confidence Through Depth",
      body: "Once awareness was established, we changed the message from “what is this?” to “why does this matter?” We published detailed breakdowns of the project and explained the value of the ecosystem clearly. This positioned Avirvox Labs as a serious build and strengthened investor awareness at the moment it counted.",
    },
  ],
  resultCards: [
    { value: "$500K", label: "Raised for product development and ecosystem expansion" },
    { value: "3 months", label: "From zero audience to investor attention" },
    { value: "Investor awareness", label: "Stronger understanding of the project" },
    { value: "Community", label: "Engaged audience built from scratch" },
  ],
  takeaways: [
    {
      title: "Explain the product first.",
      body: "In AI projects, clarity builds more trust than hype.",
    },
    {
      title: "Build the audience before the raise.",
      body: "Fundraising works best when people already know and follow the project.",
    },
    {
      title: "Layer your tactics.",
      body: "Education, community, giveaways, and influencers work best in sequence.",
    },
    {
      title: "Show depth at the end.",
      body: "Detailed breakdowns turn interest into investor confidence.",
    },
  ],
  ctaTitle: "Raising Funds for an AI or Web3 Project?",
  ctaBody:
    "We help AI projects and token teams grow their presence, build communities, and reach investors. Contact our team to discuss your fundraising and marketing plan.",
} as const;

export const dmtNoderocksCaseStudy = {
  challenge: [
    "Bitcoin Ordinals are a newer, more technical corner of the NFT market than Ethereum or Solana. The audience is smaller, buyers are more selective, and most collections launch with no community and fade within weeks.",
    "When we co-founded DMT Tikabit and Noderocks, we set out to do things differently. We wanted collections with real utility and a community that would still be here long after mint day.",
  ],
  approachIntro:
    "Because we were building these projects ourselves, we could apply our own marketing playbook from day one: community first, product second, hype last.",
  approach: [
    {
      title: "Building the Ordinals Community Before Launch",
      body: "We focused on finding and earning the attention of Bitcoin Ordinals collectors before minting began. By launch day, buyers already knew the projects and had a reason to show up.",
    },
    {
      title: "DMT Tikabit: A Collection with Real Utility",
      body: "DMT Tikabit was a collection of 1,600 ordinals. We paired it with something collectors could use: watch face apps for Android smartwatches and iPhone users. Giving the collection a working product beyond the artwork gave holders a clear reason to care.",
      bullets: [
        "1,600 Bitcoin Ordinals in the collection.",
        "Watch face apps for Android smartwatches and iPhones.",
      ],
    },
    {
      title: "Noderocks: Launching Low and Building Value",
      body: "We launched Noderocks at a floor price of $16. Starting accessible let a broad base of collectors join early, and community-led momentum drove the value from there to more than $400 per ordinal.",
    },
    {
      title: "Community That Lasts",
      body: "We kept both communities active after launch with consistent updates and engagement, so holders stayed involved rather than leaving after minting.",
    },
  ],
  resultCards: [
    { value: "1,600", label: "DMT Tikabit Ordinals" },
    { value: "48 hours", label: "Collection sold out" },
    { value: "$16", label: "Noderocks launch floor" },
    { value: "$400+", label: "Noderocks price per ordinal" },
    { value: "Watch apps", label: "Released for Android and iPhone" },
    { value: "Active", label: "Loyal Bitcoin Ordinals community" },
  ],
  takeaways: [
    {
      title: "Build the audience before the mint.",
      body: "Sellouts are decided before launch day.",
    },
    {
      title: "Give the collection a job.",
      body: "Utility, like the watch face apps, gives holders a reason to stay.",
    },
    {
      title: "Start accessible.",
      body: "A low entry price brings in more early collectors.",
    },
    {
      title: "Keep showing up.",
      body: "A loyal community comes from steady engagement after the mint.",
    },
  ],
  ctaTitle: "Launching an NFT or Ordinals Collection?",
  ctaBody:
    "We help NFT and Bitcoin Ordinals projects grow communities, run promotions, and sell out collections. Get in touch with our team to plan your launch.",
} as const;

export const redditCaseStudy = {
  challenge: [
    "Reddit has become one of the most influential places on the internet for product research. People go there to ask what’s actually worth using, and Reddit threads regularly appear in Google results and in the sources AI search tools draw from.",
    "For crypto wallets, memecoin launchpads, and AI products, that creates both an opportunity and a problem. Communities on Reddit are skeptical of promotion. New accounts with no history get ignored or removed, and a brand that posts like an advertiser gets pushed out quickly.",
    "Our clients needed visibility on Reddit and in AI-generated answers, but didn’t have the account history, subreddit knowledge, or time to earn it.",
  ],
  approachIntro:
    "We ran exclusive Reddit campaigns for more than 200 clients across three verticals: crypto wallets, memecoin launchpads, and AI products. Each campaign followed the same principle: contribute first, promote second.",
  approach: [
    {
      title: "Subreddit Research and Targeting",
      body: "Every campaign began by finding the communities where each client’s audience was already talking. We identified relevant subreddits, studied their rules and culture, and mapped the topics and questions that came up most. This kept posts relevant and helped them avoid removal.",
    },
    {
      title: "Reddit Posting Services Built for Each Community",
      body: "Our Reddit posting services focused on content that fit each subreddit. Posts were written to start discussions, answer real questions, and offer value, so they read like community contributions rather than ads.",
    },
    {
      title: "Strategic Commenting to Build Brand Presence",
      body: "Comments are where much of Reddit’s trust is built. We joined relevant threads with useful, on-topic replies, which put our clients’ brands in front of people already looking for answers. Over time, this built a consistent presence in the conversations that mattered.",
    },
    {
      title: "Profile Management and Reddit Karma Growth",
      body: "For multiple clients, we managed their Reddit profiles directly. Our approach to growing a Reddit account and its karma score centered on regular, genuine participation, which builds the credibility a Reddit account needs to be taken seriously and to post in more communities.",
    },
    {
      title: "AEO and GEO Through Reddit",
      body: "Because AI answer engines and search platforms often pull from Reddit discussions, we structured our posts and comments so they clearly addressed the questions people ask about each category. This supported both Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO), helping clients appear where users increasingly look for recommendations.",
    },
  ],
  resultCards: [
    { value: "200+", label: "Clients across crypto, memecoin, and AI verticals" },
    { value: "Presence", label: "Stronger brands in relevant subreddits" },
    { value: "Karma", label: "Grown for managed client profiles" },
    { value: "AEO + GEO", label: "Improved visibility through Reddit discussions" },
  ],
  takeaways: [
    {
      title: "Reddit rewards value, not promotion.",
      body: "Brands that contribute to a community earn its attention.",
    },
    {
      title: "Account credibility matters.",
      body: "A healthy karma score and posting history open doors that new accounts can’t.",
    },
    {
      title: "Subreddit fit decides results.",
      body: "The right post in the wrong community still fails.",
    },
    {
      title: "Reddit now feeds AI search.",
      body: "Being present in useful discussions supports visibility in both search and AI-generated answers.",
    },
  ],
  ctaTitle: "Want to Grow Your Brand on Reddit?",
  ctaBody:
    "We offer Reddit marketing services including subreddit research, Reddit posting, comment strategy, and Reddit account and karma growth. Contact our team to build your Reddit presence.",
} as const;

export const cryptoXCaseStudy = {
  challenge: [
    "For crypto projects, X is where the market pays attention. Token launches, memecoin trends, NFT drops, and exchange announcements all break there first, and a project’s X account is often the first thing a potential investor checks.",
    "That makes it hard to stand out. Thousands of accounts compete for the same audience, and many projects fall into the same traps. They buy followers who never engage, post inconsistently, or reach a broad audience that has no interest in their category. Most teams are also too busy building the product to run X properly.",
    "The 300+ clients we worked with came to us with the same need: a real, relevant audience and a handle that was managed well.",
  ],
  approachIntro:
    "We worked with token projects, memecoins, NFT projects, launchpads, exchanges, and prediction websites. Across all of them, our goal was the same: grow X followers organically, with reach aimed at the people most likely to care.",
  approach: [
    {
      title: "Niche-Targeted Audience Building",
      body: "A large following only helps if it’s the right following. We focused on reaching users already interested in each project’s category, whether that’s memecoin traders, NFT collectors, DeFi users, or prediction market participants. This kept follower growth relevant and made the audience more likely to engage.",
    },
    {
      title: "Professional X Manager Services",
      body: "For many clients, we acted as their dedicated X manager. We handled day-to-day management of the account, including posting, engagement, and keeping the handle active and consistent. Projects got a reliable presence on X without pulling their team away from building.",
    },
    {
      title: "Organic Growth Over Shortcuts",
      body: "We grew accounts through content, engagement, and visibility rather than inflated numbers. Organic growth builds an audience that reads, replies, and shares, which matters far more for a crypto project than a high count with no activity behind it.",
    },
    {
      title: "Content and Reach Built for Crypto Audiences",
      body: "Our crypto X marketing was built around how Web3 audiences actually behave: fast-moving, trend-aware, and attentive to credibility. Content and engagement were shaped to fit each project’s category and tone, which helped clients build reach with the right communities.",
    },
  ],
  resultCards: [
    { value: "300+", label: "Clients across six Web3 categories" },
    { value: "Organic", label: "Follower growth with targeted audiences" },
    { value: "Relevant reach", label: "Wider presence in crypto communities" },
    { value: "Managed handles", label: "Consistent posting and engagement" },
  ],
  takeaways: [
    {
      title: "Relevance beats volume.",
      body: "A smaller, targeted following outperforms a large, disengaged one.",
    },
    {
      title: "Consistency builds trust.",
      body: "Active, regularly managed accounts look more credible to investors.",
    },
    {
      title: "Organic growth lasts.",
      body: "Followers earned through real engagement stay and participate.",
    },
    {
      title: "Every category needs its own approach.",
      body: "A memecoin, an exchange, and a prediction site speak to different audiences.",
    },
  ],
  ctaTitle: "Want to Grow Your X Following?",
  ctaBody:
    "We offer X manager services, organic follower growth, and crypto X marketing for token projects, memecoins, NFTs, launchpads, and exchanges. Contact our team to grow your X presence.",
} as const;

export const awards = {
  eyebrow: "Our team",
  title: "Award Winning",
  subtitle:
    "Led by Web3 founders and backed by a 40-person team that runs your marketing from first post to post-launch growth.",
  /**
   * The directory order, and the designation each person carries. Names match
   * the artwork filenames in `app/assets/bullshill-team`.
   */
  people: [
    { name: "Muhammad Jawad Nawaz", role: "CEO / Founder" },
    { name: "Muhammad Rizwan", role: "Head of Content" },
    { name: "Junaid Muneer", role: "Senior Team Lead" },
    { name: "Saqib Ijaz", role: "Social Media Head" },
    { name: "Muhammad Rehan", role: "Senior AI Content Manager" },
    { name: "M Saad Akhtar", role: "AI Content Manager" },
    { name: "Zaigham", role: "Social Media Manager" },
    { name: "Muhammad Bilal", role: "Organic Growth Expert" },
    { name: "Muhammad Zeeshan", role: "Operations Manager" },
    { name: "Adnan Hussain", role: "Senior Video Editor" },
    { name: "Sadaqat", role: "2D & 3D Video Editor" },
    { name: "Faisal Noor", role: "Community Manager" },
    { name: "Muhammad Faisal Bashir", role: "Video Editor" },
    { name: "Usama Abid", role: "Video Editor" },
  ],
} as const;

/**
 * Optional social links shown under a team member's name in the carousel.
 * An empty `href` still renders the icon but as a non-link (pending the URL).
 */
export const teamSocials: Record<
  string,
  readonly { label: "X" | "LinkedIn" | "Instagram"; href: string }[]
> = {
  "Muhammad Jawad Nawaz": [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/muhammad-jawad-nawaz/",
    },
    { label: "X", href: "" },
  ],
};

export const faqs = {
  title: "Digital Marketing FAQs",
  body: "As a leading digital marketing agency, we are dedicated to providing comprehensive educational resources and answering frequently asked questions to help our clients.",
  ctas: [
    { label: "More questions", href: "#contact", variant: "secondary" },
    { label: "Contact us", href: "#contact", variant: "primary" },
  ],
  items: [
    {
      question: "What is Bullshill, and how can it help my project?",
      answer:
        "Bullshill is a Web3 marketing agency supporting token launches, memecoins, NFT collections, and AI products. We help projects plan campaigns, create content, reach relevant audiences, and build active communities.",
    },
    {
      question: "How can I launch my token project?",
      answer:
        "Start with a clear project purpose, prepared technical foundations, and a plan for reaching your audience. We can support the marketing journey through positioning, content, community building, and launch campaigns.",
    },
    {
      question: "Can you assist me in launching a memecoin?",
      answer:
        "Yes. We can help develop your meme narrative, plan promotional content, build your social presence, and coordinate marketing before and after launch. The campaign is tailored to your project's identity and audience.",
    },
    {
      question: "How can I promote my token presale or ICO?",
      answer:
        "A presale campaign needs clear messaging, accessible project information, and consistent audience engagement. We help plan targeted promotion and community activity so potential participants can discover and understand your project.",
    },
    {
      question: "How can I attract the right audience to my crypto project?",
      answer:
        "Begin by identifying who your project serves and where those people spend time. We develop content and platform campaigns around those audiences to build relevant visibility and encourage informed engagement.",
    },
    {
      question: "How can I build a community before my project launches?",
      answer:
        "Give people a reason to join early through useful updates, clear explanations, and opportunities to participate. We help establish community channels, plan conversations, and keep members informed as launch approaches.",
    },
    {
      question: "Can you manage my Telegram or Discord community?",
      answer:
        "Yes. Our community management services cover moderation, member engagement, project updates, and activities such as AMAs. The scope is agreed around your community's needs.",
    },
    {
      question: "How can I grow my crypto project on X?",
      answer:
        "Growth starts with a clear profile, consistent content, and participation in relevant conversations. We help manage posting, audience engagement, and campaigns that introduce your project to the right communities.",
    },
    {
      question: "How can Reddit help promote my project?",
      answer:
        "Reddit allows you to connect with communities discussing topics relevant to your project. We help identify suitable subreddits and develop useful posts and conversations that respect each community's rules.",
    },
    {
      question: "Can you help market my AI tool or product?",
      answer:
        "Yes. We help explain what your product does, who it serves, and why people should try it. Campaigns can include educational content, launch promotion, and audience engagement across relevant platforms.",
    },
    {
      question: "How long will it take to see marketing results?",
      answer:
        "Timing depends on your starting audience, project readiness, campaign scope, and goals. We agree on milestones at the start and use weekly reporting to review progress and adjust the campaign.",
    },
    {
      question: "How do I get started, and what will it cost?",
      answer:
        "Book a free strategy call through our website and share your project, launch stage, goals, and budget. We use that information to recommend a scope of work and provide pricing for the agreed services.",
    },
  ],
} as const;

export const finalCta = {
  title: "Ready to work with us ?",
  cta: { label: "Contact us", href: "/contact" },
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
      body: "From crafting a strategic marketing plan for a successful launch to assisting in community building, we specialize in full-scale marketing for any Web3 or crypto project. Whether you're launching an NFT, ICO, Memecoin, DEX, DAO, or Crypto Gaming platform, we're here to support every aspect of your marketing journey.",
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
