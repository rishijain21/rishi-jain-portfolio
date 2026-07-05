export const PROJECTS = [
    {
        name: "Sovva", type: "Subscription & Operations Platform · Built and still run by Rishi", url: "sovva.io",
        category: "saas", flagship: true,
        stat: "His own company, his own risk", accent: "#1B4FD8", videoUrl: "/sovva-demo.webm", loomUrl: null, screenshots: [
            { src: "/sovva-mobile-ss.webp", caption: "Mobile-Responsive Operations & Customer Dashboard", type: "mobile" },
            { src: "/sovva-mobile-ss2.webp", caption: "Live Subscription Billing & Meal Customization Flow", type: "mobile" },
            { src: "/sovva-mobile-ss3.webp", caption: "Real-Time Order Schedule & Delivery Management", type: "mobile" }
        ],
        problem: "Every day the business grew, the manual coordination grew faster. A missed step in order generation meant a customer didn't get their meal. There was no version of \"scale this business\" that survived doing it by hand.",
        solution: "I chose to build one consolidated system rather than stitch together off-the-shelf tools, because subscription billing, daily order generation, and customer records all had to agree with each other — no combination of existing tools did that without constant manual reconciliation. Background job scheduling now handles order generation automatically every day.",
        outcomes: ["Daily order generation fully automated — zero manual scheduling", "Subscription billing and invoicing handled end-to-end", "Replaced multiple disconnected tools with one purpose-built system", "Real-time pipeline and delivery visibility for leadership"],
        lesson: "Building this for my own company changed how I build for clients. When the risk is yours, you stop cutting corners you might have justified on someone else's project.",
        stack: [".NET 8", "Angular", "PostgreSQL", "EF Core", "Hangfire", "Stripe", "Azure", "JWT Auth"],
        metrics: [{ label: "Manual Tasks", value: "Automated" }, { label: "Hours Saved/Wk", value: "10+" }, { label: "Modules", value: "5" }],
        bars: [.35, .5, .6, .72, .8, .88, .92, .95],
    },
    {
        name: "Mechanical Bazaar", type: "B2B Industrial · Procurement", url: "mechanicalbazaar.in",
        category: "web",
        stat: "Built for bulk buyers", accent: "#065F46", videoUrl: "/mechanical-bazaar-demo.mp4", loomUrl: null, embedUrl: null, screenshots: [
            { src: "/ss-mechanical-bazar.webp", caption: "Full Landing Page & Industrial Catalogue (Desktop)", type: "desktop" },
            { src: "/mechanical-bazaar-mobile-ss.jpg", caption: "Mobile-Responsive Marketplace Experience", type: "mobile" }
        ],
        problem: "A mechanical components business supplying bolts, nuts, and solar mounting hardware was losing potential bulk buyers — the business had no professional digital presence to support a B2B sales cycle.",
        solution: "Built a structured B2B site with product catalogue, category filtering, spec pages, and 'Request a Quote' flows via web form and WhatsApp.",
        outcomes: ["A digital storefront credible enough to anchor B2B procurement conversations", "Quote turnaround shortened by removing the phone-call step entirely", "A catalogue structure built to scale as the product range grows"],
        stack: ["HTML5", "CSS3", "Vanilla JavaScript"],
        metrics: [{ label: "Product Categories", value: "8+" }, { label: "Quote Channels", value: "2" }, { label: "Dependencies", value: "Zero" }],
        bars: [.28, .42, .55, .62, .7, .75, .8, .85],
    },
    {
        name: "Parsec Power Engineers", type: "Corporate · Energy · B2B", url: "parsecpower.in",
        category: "web",
        stat: "30-year company, digital presence built from zero", accent: "#92400E", videoUrl: "/parsec-power-demo.mp4", loomUrl: null, embedUrl: null, screenshots: [
            { src: "/parsec-power-ss-web-view.webp", caption: "Corporate Portal Architecture (Desktop)", type: "desktop" },
            { src: "/parsec-power-mobile-view.jpg", caption: "Mobile-Responsive Solar Savings Calculator & Portal", type: "mobile" }
        ],
        problem: "A 30-year-old power engineering company had no digital presence — creating a credibility gap in a high-value B2B sales cycle where prospects expect to verify a vendor online before a first call.",
        solution: "Built a full corporate website: services, leadership, client logos, project portfolio, and a custom Solar Savings Calculator that pre-qualifies inbound leads.",
        outcomes: ["A 30-year track record now has a digital anchor that matches the company's real credibility", "Inbound leads now arrive pre-qualified through the Solar Savings Calculator", "Technical SEO copy written for an industrial procurement audience, not a general one", "Design, development, content, and SEO delivered end-to-end by one person"],
        stack: ["WordPress", "Elementor", "Custom JS", "SEO", "Photoshop", "Technical Copywriting"],
        metrics: [{ label: "Years Established", value: "30+" }, { label: "Services Covered", value: "8" }, { label: "Content Written", value: "100%" }],
        bars: [.3, .45, .55, .65, .72, .8, .85, .9],
    },
    {
        name: "Smile Your Confidence", type: "Healthcare · Dental · Booking", url: "smileyourconfidence.in",
        category: "web",
        stat: "Phone-only booking → self-serve, online",
        accent: "#0E7490", videoUrl: "/smile-your-confidence-demo.mp4", loomUrl: null, embedUrl: null, screenshots: [
            { src: "/smileyourconfidence-web.webp", caption: "Healthcare Landing Page & Treatment Booking (Desktop)", type: "desktop" },
            { src: "/smile-your-confidence-mobile-ss.jpg", caption: "Mobile Appointment Booking Flow & Gallery", type: "mobile" }
        ],
        problem: "A specialist dental clinic in Jaipur had no structured online presence. Prospective patients couldn't find service details or book consultations, so the clinic was losing patients to competitors with a basic web presence.",
        solution: "Built a complete dental website: treatment pages with before/after gallery, doctor profile, clinic overview, and an online appointment booking system that replaced phone-only scheduling.",
        outcomes: ["Patients now discover, evaluate, and book a consultation without calling the clinic", "A before/after gallery does the trust-building work a sales call used to do", "On-page SEO built specifically for dental searches in Jaipur", "Requirement gathering through launch handled solo, start to finish"],
        stack: ["WordPress", "Elementor", "Booking Plugin", "SEO", "Medical Copywriting", "Photoshop"],
        metrics: [
            { label: "Treatments listed", value: "12+" },
            { label: "Online booking", value: "Live" },
            { label: "Solo delivery", value: "100%" },
        ],
        bars: [.28, .42, .55, .62, .7, .75, .8, .88],
    },
];
