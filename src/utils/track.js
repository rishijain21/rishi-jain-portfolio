export const track = (event, data = {}) => {
    if (typeof window !== "undefined" && window.gtag) window.gtag("event", event, data);
    if (typeof window !== "undefined" && window.plausible) window.plausible(event, { props: data });
};
