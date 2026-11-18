import { PageHero } from "@/components/page-hero";
import { ContentCard } from "@/components/content-card";
import { services } from "@/lib/site";
const slugs=["web-development","ui-ux-design","branding-graphic-design","seo","digital-marketing","ecommerce"];
export default function ServicesPage(){return <><PageHero eyebrow="What we do" title="Digital services, connected around your goals." description="Choose the support you need today, with a flexible foundation for what comes next."/><section className="container-shell grid gap-5 pb-24 md:grid-cols-2 lg:grid-cols-3">{services.map((s,i)=><ContentCard key={s.number} eyebrow={`SERVICE ${s.number}`} title={s.title} description={s.description} href={`/services/${slugs[i]}`} tags={s.tags}/>)}</section></>}
