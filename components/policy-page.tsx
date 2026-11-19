import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

type Policy = {
  key: string; title: string; subtitle: string; summary: string[];
  updated: string; updatedLabel: string;
  sections: { id: string; title: string; html: string }[];
};
const pages = [
  { key: "privacy", label: "Privacy", href: "/privacy-policy" },
  { key: "terms", label: "Terms", href: "/terms-and-conditions" },
  { key: "cookies", label: "Cookies", href: "/cookies-policy" }
];
function contentForApp(html: string) {
  return html.replaceAll('href="Privacy Policy.html"', 'href="/privacy-policy"')
    .replaceAll('href="Terms of Service.html"', 'href="/terms-and-conditions"')
    .replaceAll('href="Cookies Policy.html"', 'href="/cookies-policy"');
}
export function PolicyPage({ policy }: { policy: Policy }) {
  const words = policy.sections.map(section => section.title + " " + section.html.replace(/<[^>]*>/g, " ")).join(" ").split(/\s+/).length;
  return (
    <div className="policy-page policy-app">
      <Navbar />
      <main className="policy-main">
        <div className="policy-container">
          <div className="policy-topline">
            <Link href="/" className="policy-back-home"><span aria-hidden="true">←</span> Back to Home</Link>
            <nav className="policy-switcher" aria-label="Policy pages">{pages.map(page => <Link key={page.key} href={page.href} aria-current={page.key === policy.key ? "page" : undefined}>{page.label}</Link>)}</nav>
          </div>
          <header className="policy-hero">
            <span className="policy-eyebrow">THE ESSENTIALS, IN PLAIN LANGUAGE</span>
            <h1>{policy.title}</h1><p>{policy.subtitle}</p>
            <div className="policy-meta"><span>Updated <time dateTime={policy.updated}>{policy.updatedLabel}</time></span><span aria-hidden="true">•</span><span>{Math.max(1, Math.ceil(words / 200))} min read</span></div>
          </header>
          <div className="policy-summary" aria-label="At a glance">{policy.summary.map(item => <span key={item}><svg viewBox="0 0 20 20" width="15" height="15" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="8"/><path d="m6 10 3 3 5-6"/></svg>{item}</span>)}</div>
          <div className="policy-layout">
            <aside className="policy-toc"><h2>On this page</h2><nav aria-label="On this page">{policy.sections.map((section, index) => <a key={section.id} href={`#${policy.key}-${section.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</a>)}</nav></aside>
            <article className="policy-document" aria-label={`${policy.title} content`}>
              {policy.sections.map((section, index) => <section className="policy-section" key={section.id} id={`${policy.key}-${section.id}`} aria-labelledby={`${policy.key}-${section.id}-heading`}><h2 id={`${policy.key}-${section.id}-heading`}><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</h2><div dangerouslySetInnerHTML={{ __html: contentForApp(section.html) }} /></section>)}
              <div className="policy-contact"><div><span className="policy-eyebrow">NEED A LITTLE CLARITY?</span><h2>We’re a message away.</h2><p>Ask us about this policy or information you have shared.</p></div><div className="policy-contact-links"><a href="mailto:globaxify.official@gmail.com">globaxify.official@gmail.com <span aria-hidden="true">↗</span></a><a href="tel:+923294211306">03294211306</a></div></div>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
