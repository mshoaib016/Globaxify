import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export function ContentCard({ eyebrow, title, description, href, tags = [] }: { eyebrow:string; title:string; description:string; href:string; tags?:string[] }) {
 return <Link href={href} className="group rounded-2xl border border-white/10 bg-white/[.025] p-6 transition hover:-translate-y-1 hover:border-violet-400/40 hover:bg-white/[.045]"><div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-[.18em] text-violet-300">{eyebrow}</span><ArrowUpRight size={18} className="text-slate-500 group-hover:text-violet-200"/></div><h3 className="mt-7 text-xl font-semibold text-white">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>{tags.length>0 && <div className="mt-5 flex flex-wrap gap-2">{tags.map(t=><span key={t} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">{t}</span>)}</div>}</Link>;
}
