export type LegalBlock =
  | { p: string }
  | { h: string }
  | { ul: string[] }
  | { dl: { term: string; text: string }[] };

export type LegalSection = {
  id: string;
  heading: string;
  blocks: LegalBlock[];
};

export type LegalDocument = {
  slug: string;
  title: string;
  date: string;
  author: string;
  intro: string;
  editorNote: string;
  sections: LegalSection[];
  contact: { business: string; email: string };
};

export const privacyPolicy: LegalDocument = {
  slug: "privacy-policy",
  title: "BullShill Privacy Policy",
  date: "Oct 12, 2026",
  author: "Jawad",
  intro:
    "This Privacy Policy explains what personal information BullShill (\"we\", \"us\", \"our\") collects through our website and services, how we use it, and the choices you have.",
  editorNote: "Fill in the [bracketed] details before publishing.",
  sections: [
    {
      id: "information-we-collect",
      heading: "Information we collect and how we use it",
      blocks: [
        {
          p: "We collect only what we need to respond to you, deliver our marketing services and run our website.",
        },
        { h: "Information you give us" },
        {
          ul: [
            "Contact details: name, email address, Telegram or Discord handle, company or project name and any message you send through our forms, email, Telegram, Discord or booking tools.",
            "Project information: token or product details, social account links, marketing goals and budget you share while discussing or ordering services.",
            "Billing information: invoice details and payment records, including crypto wallet addresses used to pay us. We do not store card numbers; card payments are handled by our payment providers.",
          ],
        },
        { h: "Information collected automatically" },
        {
          ul: [
            "Device and usage data: IP address, browser type, device type, pages viewed, referring site and time spent on the site.",
            "Cookies and similar technologies, described in Section 2.",
          ],
        },
        { h: "Information from third parties" },
        {
          ul: [
            "Messages and reviews sent through platforms such as Upwork and Fiverr, which are governed by those platforms' own policies.",
            "Publicly available information about your project, such as your public X, Telegram, Discord or Reddit pages, used to plan campaigns.",
          ],
        },
        { h: "How we use it" },
        {
          ul: [
            "To reply to enquiries and book consultations.",
            "To plan, deliver and report on the marketing services you hire us for.",
            "To send invoices, process payments and keep business records.",
            "To improve our website, content and services.",
            "To send updates or offers about our services, which you can opt out of at any time.",
            "To prevent fraud and abuse, and to meet legal obligations.",
          ],
        },
        {
          p: "Where data protection law requires a legal basis, we rely on performing our contract with you, our legitimate interests in running and improving our business, your consent (for example for marketing emails or non-essential cookies) and our legal obligations.",
        },
      ],
    },
    {
      id: "sharing-cookies-analytics",
      heading: "Sharing, cookies and analytics",
      blocks: [
        {
          p: "We do not sell your personal information. We share it only in these cases:",
        },
        {
          ul: [
            "Service providers that help us operate, such as website hosting, email, analytics, scheduling, project management, communication tools and payment processors. They may use your data only to provide their service to us.",
            "Freelance and agency collaborators working on your project under confidentiality terms, such as designers, video editors and community managers.",
            "Platforms you ask us to work on, such as X, Telegram, Discord and Reddit. Content we publish for you on these platforms is public and governed by their terms.",
            "Legal and safety reasons, where we must comply with law, respond to lawful requests or protect our rights, users or the public.",
            "Business transfers, if we merge with or are acquired by another company, in which case we will tell you if your data is affected.",
          ],
        },
        { h: "Cookies and analytics" },
        {
          p: "Our website uses cookies and similar tools to keep the site working, measure traffic and understand which pages help visitors. We use [analytics provider, e.g. Google Analytics] for traffic measurement. You can block or delete cookies in your browser settings, and where required by law we ask for your consent before setting non-essential cookies. Blocking cookies may affect how parts of the site work.",
        },
        { h: "Third-party links" },
        {
          p: "Our site and content may link to third-party websites, social platforms and tools. We are not responsible for their privacy practices, so please read their policies.",
        },
      ],
    },
    {
      id: "retention-security-rights",
      heading: "Retention, security and your rights",
      blocks: [
        {
          dl: [
            {
              term: "Retention",
              text: "We keep personal information only as long as needed for the purposes above. Enquiries that do not become projects are deleted after [12] months. Client and billing records are kept for [6] years or as long as tax and accounting law requires.",
            },
            {
              term: "Security",
              text: "We use reasonable technical and organizational measures, such as access controls and encrypted connections, to protect your data. No online system is completely secure, so we cannot guarantee absolute security. Never send us private keys, seed phrases or wallet passwords. We will never ask for them.",
            },
            {
              term: "Your rights",
              text: "Depending on where you live (for example the EEA, UK or California), you may have the right to:",
            },
          ],
        },
        {
          ul: [
            "Access the personal information we hold about you.",
            "Correct inaccurate information.",
            "Delete your information, subject to legal record-keeping duties.",
            "Object to or restrict certain processing, and withdraw consent at any time.",
            "Receive a copy of your data in a portable format.",
            "Opt out of marketing emails using the unsubscribe link or by contacting us.",
            "Not be discriminated against for exercising your privacy rights.",
          ],
        },
        {
          p: "To use any of these rights, email us at the address in Section 4. We may need to verify your identity first and will respond within the time required by applicable law, usually 30 days. You may also complain to your local data protection authority.",
        },
      ],
    },
    {
      id: "children-transfers-changes-contact",
      heading: "Children, international transfers, changes and contact",
      blocks: [
        {
          dl: [
            {
              term: "Children",
              text: "Our services are for businesses and adults aged 18 or over. We do not knowingly collect information from anyone under 18. If you believe a child has given us data, contact us and we will delete it.",
            },
            {
              term: "International transfers",
              text: "We work with clients and providers worldwide, so your information may be processed in countries other than your own. Where required, we use safeguards such as standard contractual clauses to protect it.",
            },
            {
              term: "Changes to this policy",
              text: "We may update this policy from time to time. The \"as of\" date at the top shows when it was last changed, and we will post material changes on this page. Continued use of our site or services after an update means you accept the revised policy.",
            },
            {
              term: "Contact us",
              text: "For privacy questions or requests, use the details below.",
            },
          ],
        },
      ],
    },
  ],
  contact: { business: "Bullshill", email: "Jawad@bullshill.com" },
};

export const termsOfService: LegalDocument = {
  slug: "terms",
  title: "BullShill Terms of Service",
  date: "Oct 12, 2026",
  author: "Jawad",
  intro:
    "These Terms of Service govern your use of the BullShill website and the marketing services we provide. By using our site or hiring us, you agree to them.",
  editorNote: "Fill in the [bracketed] details before publishing.",
  sections: [
    {
      id: "services-agreement-orders",
      heading: "Services, agreement and orders",
      blocks: [
        {
          dl: [
            {
              term: "Who we are",
              text: "BullShill is a Web3 marketing agency operated by [Legal business name] (\"we\", \"us\"). \"You\" means the person or business using our site or hiring us.",
            },
            {
              term: "Our services",
              text: "We provide marketing services for Web3, crypto and AI projects, which may include:",
            },
          ],
        },
        {
          ul: [
            "Token, memecoin, ICO and presale marketing and promotion.",
            "AI tool and product marketing.",
            "NFT marketing and promotion.",
            "Telegram and Discord community growth and management.",
            "X (Twitter) account management and growth.",
            "Reddit marketing, including subreddit targeting, posting, comments and GEO/AEO work.",
            "Content creation, such as memes, graphics, video and copywriting, and campaign strategy.",
          ],
        },
        {
          p: "We do not offer website development, token or smart contract development, legal advice, investment advice or trading services unless we agree otherwise in writing.",
        },
        {
          dl: [
            {
              term: "Eligibility",
              text: "You must be at least 18 and able to enter a binding contract. If you act for a company or project, you confirm you have authority to bind it.",
            },
            {
              term: "Orders and scope",
              text: "Services start when you accept our proposal, quote or invoice, or place an order through a platform such as Upwork or Fiverr. The agreed scope, deliverables, timeline and price form your order. Work outside that scope needs a written change agreement and may cost extra. If you order through a third-party platform, that platform's terms also apply, and these Terms apply to the extent they do not conflict.",
            },
            {
              term: "Changes to these Terms",
              text: "We may update these Terms. The updated version applies to new orders and to your use of the site after the \"as of\" date above. Orders already agreed keep the terms in force when they were accepted.",
            },
          ],
        },
      ],
    },
    {
      id: "fees-payments-refunds",
      heading: "Fees, payments and refunds",
      blocks: [
        {
          dl: [
            {
              term: "Fees",
              text: "Fees are set out in your proposal, quote or order. Unless stated otherwise, prices are in [USD] and exclude taxes, platform fees, currency conversion costs and blockchain network fees, which you are responsible for.",
            },
            {
              term: "Payment",
              text: "We accept [bank transfer, card, crypto such as USDT or USDC, and payment through Upwork or Fiverr]. Invoices are due within [7] days unless agreed otherwise. We may require an upfront deposit of [50%] before work begins, with the balance due at the milestones in your order.",
            },
            {
              term: "Third-party costs",
              text: "Costs paid to others on your behalf, such as influencer fees, paid placements, giveaway prizes, tools and ad spend, are not included in our fees unless stated. We will agree these with you in advance, and you must fund them before we commit to them.",
            },
            {
              term: "Late payment",
              text: "If an invoice is overdue, we may pause work until it is paid and charge interest at [1.5% per month] or the maximum allowed by law.",
            },
            {
              term: "Refunds",
              text: "Because our services involve time, expertise and work started immediately, fees are generally non-refundable once work has begun. If we fail to deliver an agreed deliverable and cannot fix it within a reasonable time after you tell us, we will refund the unearned part of the fee for that deliverable. Refunds are never available for results we do not control, such as price, market cap, follower counts, engagement or sales. Orders placed through Upwork or Fiverr follow the refund rules of that platform.",
            },
            {
              term: "Chargebacks",
              text: "Please contact us before disputing a payment. We will work with you in good faith to resolve any problem.",
            },
          ],
        },
      ],
    },
    {
      id: "client-responsibilities",
      heading: "Client responsibilities, compliance and acceptable use",
      blocks: [
        {
          dl: [
            {
              term: "What you must provide",
              text: "You agree to give us accurate information, timely feedback and the access we reasonably need, such as brand assets, project details and approvals. Delays on your side may delay delivery.",
            },
            {
              term: "Your project and its legality",
              text: "You are solely responsible for your project, token, NFT collection or product, including its design, smart contracts, tokenomics, disclosures and legal status. You confirm that you have the right to promote it, and that you comply with the laws that apply to you and your offering. This includes securities, commodities, consumer protection, advertising, anti-money-laundering and sanctions laws in the places where you operate or promote. We do not review your project for legal compliance and do not act as your legal, tax or compliance adviser. You should get your own professional advice.",
            },
          ],
        },
        { h: "What we will not do" },
        {
          p: "To protect you, us and the platforms we work on, we do not:",
        },
        {
          ul: [
            "Promote scams, rug pulls, fraudulent or deceptive projects, or anything we reasonably believe is intended to mislead investors.",
            "Make false claims about returns, guarantees, partnerships, audits or team members.",
            "Buy fake followers, bots, fake engagement, vote manipulation or fake reviews, or run spam campaigns that break platform rules.",
            "Work with sanctioned persons or in sanctioned jurisdictions, or on illegal products or content.",
          ],
        },
        {
          p: "We may refuse, pause or end any work that breaks these rules or the terms of X, Telegram, Discord, Reddit or other platforms, without liability to you.",
        },
        {
          dl: [
            {
              term: "Approvals and disclosures",
              text: "You approve the content we publish for you, or authorize us to publish it. You agree that promotional and paid content may need to be labelled as advertising under local law, and that we may add such labels.",
            },
            {
              term: "Accounts and access",
              text: "If we manage your social, community or Reddit accounts, you keep ownership of them. You must give us access securely, never by sharing private keys or seed phrases, and you are responsible for removing our access when the work ends.",
            },
          ],
        },
      ],
    },
    {
      id: "no-guarantees",
      heading: "No guarantees and no financial advice",
      blocks: [
        {
          dl: [
            {
              term: "No guaranteed results",
              text: "Marketing outcomes depend on many factors outside our control, including market conditions, platform algorithms, your product and team, and community behavior. We do not guarantee any particular result, such as token price, market capitalization, trading volume, holder numbers, follower or member counts, mint sell-outs, user growth, rankings or revenue. Case studies and past results on our website show what happened for specific clients and are not promises of what you will achieve.",
            },
            {
              term: "No financial, investment or legal advice",
              text: "Nothing on our website or in our work is financial, investment, tax or legal advice, or an offer or solicitation to buy or sell any token, NFT or security. Crypto assets are volatile and you can lose all of the money you put in. We do not hold, manage or trade client funds, and we do not guarantee any project's success or safety. Anyone who buys a project we promote does so at their own risk.",
            },
            {
              term: "Third-party platforms",
              text: "Our work depends on platforms such as X, Telegram, Discord, Reddit and search engines. They may change their rules, algorithms or features, or suspend accounts, at any time. We are not liable for those actions, but we will tell you promptly and suggest alternatives if one affects your campaign.",
            },
            {
              term: "Website content",
              text: "We provide the site and its content \"as is\" for general information. We try to keep it accurate but do not promise that it is complete, current or error-free.",
            },
          ],
        },
      ],
    },
    {
      id: "ip-confidentiality",
      heading: "Intellectual property and confidentiality",
      blocks: [
        {
          dl: [
            {
              term: "Your materials",
              text: "You keep ownership of your brand, logos, token and project materials, and give us a license to use them to deliver the services.",
            },
            {
              term: "Our deliverables",
              text: "Once you have paid in full, you own the custom content we create for you, such as memes, graphics, videos and copy, for use in your project. Until payment, we keep ownership and you may not use it. Our tools, templates, methods, strategies and pre-existing materials remain ours, and you receive a non-exclusive license to use them as part of the deliverables.",
            },
            {
              term: "Portfolio use",
              text: "Unless you ask us in writing not to, we may mention your project name and show non-confidential results and public work in our portfolio, case studies and marketing.",
            },
            {
              term: "Third-party content",
              text: "You confirm you have the rights to anything you give us, and that it does not infringe anyone else's rights. We will not knowingly use copyrighted material we are not licensed to use.",
            },
            {
              term: "Our website",
              text: "The BullShill name, logo, website design and content belong to us or our licensors. You may not copy, scrape or reuse them without our written permission.",
            },
            {
              term: "Confidentiality",
              text: "Each side agrees to keep the other's non-public business information confidential and use it only for the services. This does not cover information that is public, already known, independently developed or required by law to be disclosed. We may share it with collaborators who need it and are bound by similar duties. These duties continue for [2] years after the services end.",
            },
          ],
        },
      ],
    },
    {
      id: "liability-termination-law",
      heading: "Liability, indemnity, termination, governing law and contact",
      blocks: [
        {
          dl: [
            {
              term: "Limitation of liability",
              text: "To the fullest extent allowed by law, we are not liable for indirect, incidental, special or consequential damages, or for lost profits, lost investments, trading losses, loss of market value or loss of data, even if we were told they might happen. Our total liability for any claim connected to our services is limited to the fees you paid us for the order that gave rise to the claim in the [3] months before the claim. Nothing in these Terms limits liability that cannot be limited by law, such as for fraud or fraudulent misrepresentation.",
            },
            {
              term: "Indemnity",
              text: "You agree to defend and compensate us, our team and collaborators against claims, losses and costs (including reasonable legal fees) arising from your project, token, NFT or product, the materials you give us, your breach of these Terms or your breach of any law or third-party right.",
            },
            {
              term: "Termination",
              text: "Either side may end an order with [14] days' written notice. We may end it immediately if you breach these Terms, do not pay, or ask us to do something unlawful or against platform rules. On termination you must pay for work done and costs committed up to that date. Sections that by nature should survive, including payment, intellectual property, confidentiality, liability and indemnity, continue after termination.",
            },
            {
              term: "Independent contractor",
              text: "We are an independent contractor, not your employee, partner, agent or adviser. We may use collaborators to deliver the work, and remain responsible for it.",
            },
            {
              term: "Force majeure",
              text: "Neither side is liable for delay or failure caused by events beyond reasonable control, such as outages, platform bans, network failures, regulatory action, or natural events.",
            },
            {
              term: "Governing law and disputes",
              text: "These Terms are governed by the laws of [country/state], without regard to conflict-of-law rules. We will first try to resolve any dispute informally by contacting each other. If that fails, disputes will be resolved by [the courts of city/country, or arbitration in city under named rules].",
            },
            {
              term: "General",
              text: "These Terms and your order are the whole agreement between us. If a part is found unenforceable, the rest stays in force. Not enforcing a right is not a waiver of it. You may not transfer your rights without our written consent.",
            },
          ],
        },
      ],
    },
  ],
  contact: { business: "Bullshill", email: "Jawad@bullshill.com" },
};
