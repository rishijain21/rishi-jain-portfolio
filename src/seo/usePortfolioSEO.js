import { useEffect } from "react";
import { FAQ_ITEMS } from "../data/faqItems";

export const usePortfolioSEO = () => {
    useEffect(() => {
        // CSS handles scroll-behavior: smooth and correctly respects prefers-reduced-motion.
        // No JS override applied here.
        document.title = "Rishi Jain — Technology Partner for Founders & Growing Businesses";
        const setMeta = (name, content, prop = false) => {
            const sel = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`;
            let el = document.querySelector(sel);
            if (!el) { el = document.createElement("meta"); prop ? el.setAttribute("property", name) : el.setAttribute("name", name); document.head.appendChild(el); }
            el.setAttribute("content", content);
        };
        setMeta("description", "Rishi Jain is a Technology Partner for founders and small businesses — building the systems your business actually runs on, backed by production fintech experience and his own SaaS company, Sovva.");
        setMeta("author", "Rishi Jain");
        setMeta("robots", "index, follow");
        setMeta("og:title", "Rishi Jain — Technology Partner for Founders & Growing Businesses", true);
        setMeta("og:description", "I build the systems your business actually runs on — backed by production fintech work and my own SaaS company.", true);
        setMeta("og:type", "website", true);
        setMeta("og:url", "https://rishi-jain.vercel.app", true);
        setMeta("og:image", "https://rishi-jain.vercel.app/og-preview.png", true);
        setMeta("twitter:image", "https://rishi-jain.vercel.app/og-preview.png");
        setMeta("twitter:card", "summary_large_image");
        setMeta("twitter:title", "Rishi Jain — Technology Partner for Founders & Growing Businesses");
        setMeta("twitter:description", "I build the systems your business actually runs on — backed by production fintech work and my own SaaS company.");

        let canon = document.querySelector('link[rel="canonical"]');
        if (!canon) { canon = document.createElement("link"); canon.setAttribute("rel", "canonical"); document.head.appendChild(canon); }
        canon.setAttribute("href", "https://rishi-jain.vercel.app");

        let schemaTag = document.querySelector('script[data-schema="rj-person"]');
        if (!schemaTag) {
            schemaTag = document.createElement("script");
            schemaTag.type = "application/ld+json";
            schemaTag.setAttribute("data-schema", "rj-person");
            document.head.appendChild(schemaTag);
        }
        
        const schemaData = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Person",
                    "@id": "https://rishi-jain.vercel.app/#person",
                    "name": "Rishi Jain",
                    "jobTitle": "Technology Partner & Software Engineer",
                    "description": "Rishi Jain is a Technology Partner for founders and small businesses, specializing in building production-grade internal systems, automated workflows, and high-conversion web applications.",
                    "url": "https://rishi-jain.vercel.app",
                    "email": "mailto:jainnrishii21@gmail.com",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Sholapur",
                        "addressRegion": "Maharashtra",
                        "addressCountry": "IN"
                    },
                    "knowsLanguage": ["English", "Hindi"],
                    "sameAs": [
                        "https://www.linkedin.com/in/rishi-jainn/",
                        "https://github.com/rishijain21"
                    ],
                    "alumniOf": {
                        "@type": "Organization",
                        "name": "Infosys"
                    },
                    "worksFor": {
                        "@type": "Organization",
                        "@id": "https://sovva.io/#organization",
                        "name": "Sovva"
                    },
                    "knowsAbout": [
                        "Software Engineering", "System Architecture", "React", "Angular", ".NET", "PostgreSQL", "B2B SaaS", "Business Automation"
                    ]
                },
                {
                    "@type": "Organization",
                    "@id": "https://sovva.io/#organization",
                    "name": "Sovva",
                    "url": "https://sovva.io",
                    "founder": {
                        "@id": "https://rishi-jain.vercel.app/#person"
                    }
                },
                {
                    "@type": "WebSite",
                    "@id": "https://rishi-jain.vercel.app/#website",
                    "url": "https://rishi-jain.vercel.app",
                    "name": "Rishi Jain — Technology Partner",
                    "publisher": {
                        "@id": "https://rishi-jain.vercel.app/#person"
                    }
                },
                {
                    "@type": "FAQPage",
                    "@id": "https://rishi-jain.vercel.app/#faq",
                    "mainEntity": FAQ_ITEMS.map(item => ({
                        "@type": "Question",
                        "name": item.q,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": item.a
                        }
                    }))
                },
                {
                    "@type": "CreativeWork",
                    "name": "Sovva Subscription Platform",
                    "url": "https://sovva.io",
                    "creator": { "@id": "https://rishi-jain.vercel.app/#person" }
                },
                {
                    "@type": "CreativeWork",
                    "name": "Mechanical Bazaar B2B Portal",
                    "url": "https://mechanicalbazaar.in",
                    "creator": { "@id": "https://rishi-jain.vercel.app/#person" }
                },
                {
                    "@type": "CreativeWork",
                    "name": "Parsec Power Engineers Website",
                    "url": "https://parsecpower.in",
                    "creator": { "@id": "https://rishi-jain.vercel.app/#person" }
                },
                {
                    "@type": "CreativeWork",
                    "name": "Smile Your Confidence Dental Platform",
                    "url": "https://smileyourconfidence.in",
                    "creator": { "@id": "https://rishi-jain.vercel.app/#person" }
                }
            ]
        };
        
        schemaTag.textContent = JSON.stringify(schemaData);

        if (!document.querySelector('link[data-fonts="rj"]')) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.setAttribute("data-fonts", "rj");
            link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300..700&family=JetBrains+Mono:wght@400;500&display=swap";
            document.head.appendChild(link);
        }
    }, []);
};
