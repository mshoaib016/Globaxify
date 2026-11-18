import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export function PageHero({ eyebrow, title, description, action = true }: { eyebrow: string; title: string; description: string; action?: boolean }) {
 return <section className="section-padding relative overflow-hidden"><div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,.19),transparent_55%)]"/><div className="container-shell"><p className="eyebrow">{eyebrow}</p><h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-[-.04em] text-white sm:text-5xl lg:text-7xl">{title}</h1><p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">{description}</p>{action && <Link href="/get-a-quote" className="button-primary mt-8 inline-flex">Discuss your project <ArrowUpRight size={17}/></Link>}</div></section>;
}
