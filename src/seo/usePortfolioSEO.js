import { useEffect } from "react";

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
        // TODO (P0.2): Create og-preview.png (1200×630px) and deploy to https://rishi-jain.vercel.app/og-preview.png
        // before launch. The tag is intentionally omitted until the asset is confirmed live to avoid
        // broken social card previews. Uncomment both lines below once deployed:
        // setMeta("og:image", "https://rishi-jain.vercel.app/og-preview.png", true);
        // setMeta("twitter:image", "https://rishi-jain.vercel.app/og-preview.png");
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
        schemaTag.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Rishi Jain",
            jobTitle: "Technology Partner",
            email: "jainnrishii21@gmail.com",
            url: "https://rishi-jain.vercel.app",
            sameAs: ["https://www.linkedin.com/in/rishi-jainn/", "https://github.com/rishijain21"],
            knowsAbout: [".NET", "Angular", "PostgreSQL", "SaaS architecture", "business automation"],
        });

        if (!document.querySelector('link[data-fonts="rj"]')) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.setAttribute("data-fonts", "rj");
            link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300..700&family=JetBrains+Mono:wght@400;500&display=swap";
            document.head.appendChild(link);
        }
    }, []);
};
