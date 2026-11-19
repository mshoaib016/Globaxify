import Link from "next/link";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Code2, Layers3, Palette,
  Search, Megaphone, ShoppingBag, Sparkles, Check, MoveUpRight,
  MousePointer2, Globe2, Zap, ShieldCheck
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { services } from "@/lib/site";

const iconMap = {
  code: Code2,
  layers: Layers3,
  palette: Palette,
  chart: Search,
  megaphone: Megaphone,
  store: ShoppingBag
};

const benefits = [
  { icon: Sparkles, title: "Thoughtful by design", text: "Every detail has a purpose, from the first impression to the final interaction." },
  { icon: Zap, title: "Built for performance", text: "Fast, responsive digital experiences that respect your customers’ time." },
  { icon: ShieldCheck, title: "A partner, not a vendor", text: "Clear communication, considered decisions and support beyond launch." }
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative isolate overflow-hidden border-b border-white/[0.06]">
          <div className="grid-glow absolute inset-0 -z-20" />
          <div className="glow-orb pulse-animation -right-32 top-10 -z-10 size-[520px] bg-violet-600/20 blur-[100px]" />
          <div className="glow-orb -left-40 top-64 -z-10 size-[360px] bg-blue-600/15 blur-[100px]" />
          <div className="container-shell grid min-h-0 items-center gap-8 py-8 lg:grid-cols-[1.12fr_.88fr] lg:py-10">
            <div className="relative z-10">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/[0.07] px-3.5 py-2 text-[11px] font-semibold tracking-[.12em] text-violet-200">
                <span className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#55d6e8]" />
                YOUR DIGITAL GROWTH PARTNER
              </div>
              <h1 className="heading-xl max-w-[780px]">
                Make your next move <span className="gradient-text">your best one.</span>
              </h1>
              <p className="muted mt-7 max-w-xl text-base leading-8 md:text-lg">
                We bring strategy, design and technology together to build digital experiences that help ambitious businesses move forward.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/get-a-quote" className="button-primary">
                  Start a project <ArrowUpRight size={17} />
                </Link>
                <span role="link" aria-disabled="true" title="New portfolio link coming soon" className="button-secondary">
                  Explore our work <ArrowRight size={16} />
                </span>
              </div>
              <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/[0.09] pt-6 text-xs text-slate-400">
                <span className="inline-flex items-center gap-2"><Check size={14} className="text-cyan-300" /> Strategy-led thinking</span>
                <span className="inline-flex items-center gap-2"><Check size={14} className="text-cyan-300" /> Built around your goals</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[510px]">
              <div className="absolute inset-8 rounded-full bg-violet-600/20 blur-[75px]" />
              <div className="panel float-animation relative overflow-hidden p-5 shadow-[0_30px_100px_rgba(0,0,0,.38)] sm:p-7">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-violet-400" />
                    <span className="text-xs font-semibold tracking-wide text-slate-200">DIGITAL ECOSYSTEM</span>
                  </div>
                  <span className="text-[10px] text-slate-500">GLOBAXIFY / 01</span>
                </div>
                <div className="relative mt-5 flex aspect-[1.08] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020]">
                  <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "radial-gradient(rgba(167,139,250,.35) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
                  <div className="absolute size-64 rounded-full border border-violet-300/20" />
                  <div className="absolute size-48 rounded-full border border-blue-300/20" />
                  <div className="absolute size-32 rounded-full border border-cyan-200/20" />
                  <div className="absolute size-64 rounded-full bg-violet-500/20 blur-[55px]" />
                  <div className="relative grid size-28 place-items-center rounded-[30px] border border-violet-200/30 bg-gradient-to-br from-violet-500/30 via-indigo-500/20 to-cyan-400/20 shadow-[0_0_65px_rgba(124,87,255,.28)]">
                    <Globe2 size={58} strokeWidth={1.15} className="text-violet-100" />
                  </div>
                  <div className="absolute left-5 top-8 rounded-xl border border-white/10 bg-[#151b30]/90 p-3 backdrop-blur">
                    <Code2 size={18} className="text-cyan-200" />
                    <span className="mt-2 block text-[9px] text-slate-300">DEVELOP</span>
                  </div>
                  <div className="absolute bottom-8 right-5 rounded-xl border border-white/10 bg-[#151b30]/90 p-3 backdrop-blur">
                    <Palette size={18} className="text-violet-200" />
                    <span className="mt-2 block text-[9px] text-slate-300">DESIGN</span>
                  </div>
                  <div className="absolute right-8 top-10 rounded-xl border border-white/10 bg-[#151b30]/90 p-3 backdrop-blur">
                    <Search size={18} className="text-blue-200" />
                    <span className="mt-2 block text-[9px] text-slate-300">GROW</span>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {["Strategy", "Creativity", "Technology"].map((label) => (
                    <div key={label} className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-2 py-3 text-center text-[10px] font-medium text-slate-300">{label}</div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-6 -left-5 hidden items-center gap-3 rounded-2xl border border-white/10 bg-[#151b2c]/95 p-4 shadow-xl backdrop-blur sm:flex">
                <span className="grid size-9 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200"><MousePointer2 size={17} /></span>
                <span><span className="block text-xs font-semibold text-white">Made with intention</span><span className="mt-1 block text-[10px] text-slate-400">Every pixel has a purpose</span></span>
              </div>
            </div>
          </div>
          <div className="container-shell pb-8">
            <a href="#services" className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[.16em] text-slate-500 hover:text-white">
              SCROLL TO EXPLORE <ArrowDown size={13} />
            </a>
          </div>
        </section>

        <section className="border-b border-white/[0.06] bg-white/[0.015] py-7">
          <div className="container-shell flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-xs font-medium text-slate-400">One connected partner for your digital journey.</p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[11px] font-semibold tracking-wide text-slate-500">
              <span>STRATEGY</span><span>DESIGN</span><span>DEVELOPMENT</span><span>GROWTH</span>
            </div>
          </div>
        </section>

        <section id="services" className="section-space">
          <div className="container-shell">
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
              <SectionHeading eyebrow="What we do" title="Everything your brand needs to move forward." description="A considered mix of creative thinking and technical expertise, brought together around your business goals." />
              <Link href="/services" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-violet-200 hover:text-white">Explore all services <ArrowUpRight size={16} /></Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const Icon = iconMap[service.icon as keyof typeof iconMap];
                return (
                  <Link href={`/services/${service.title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`} key={service.number} className="service-card group">
                    <div className="flex items-start justify-between">
                      <span className="grid size-12 place-items-center rounded-2xl border border-violet-300/15 bg-violet-400/[0.08] text-violet-200"><Icon size={21} strokeWidth={1.7} /></span>
                      <span className="text-xs text-slate-600">{service.number}</span>
                    </div>
                    <h3 className="mt-7 font-[family-name:var(--font-heading)] text-xl font-semibold tracking-tight text-white">{service.title}</h3>
                    <p className="mt-3 min-h-[72px] text-sm leading-7 text-slate-400">{service.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {service.tags.map((tag) => <span key={tag} className="rounded-full border border-white/[0.08] px-2.5 py-1 text-[10px] text-slate-400">{tag}</span>)}
                    </div>
                    <div className="mt-7 flex items-center justify-between border-t border-white/[0.08] pt-4 text-xs font-semibold text-violet-200">
                      Learn more <MoveUpRight size={15} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section-space border-y border-white/[0.06] bg-[#0c1020]">
          <div className="container-shell grid items-center gap-14 lg:grid-cols-2">
            <div>
              <span className="eyebrow">A better way to build</span>
              <h2 className="heading-lg mt-5">Good work starts with <span className="gradient-text">the right thinking.</span></h2>
              <p className="muted mt-6 max-w-lg text-base leading-8">We look beyond deliverables. We take time to understand your goals, your audience and the problem worth solving—then build with purpose.</p>
              <Link href="/about" className="button-secondary mt-8">Get to know us <ArrowUpRight size={16} /></Link>
            </div>
            <div className="grid gap-3">
              {benefits.map(({ icon: Icon, title, text }, index) => (
                <div key={title} className="panel flex gap-4 p-5 sm:p-6">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-400/15 to-blue-400/10 text-violet-200"><Icon size={20} /></span>
                  <div><h3 className="text-sm font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></div>
                  <span className="ml-auto hidden text-xs text-slate-600 sm:block">0{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-space">
          <div className="container-shell">
            <SectionHeading eyebrow="How we work" title="Clear thinking. Focused execution." description="A collaborative process that keeps the work aligned, the communication clear and the momentum moving." centered />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["01", "Discover", "We learn about your business, audience and what success should look like."],
                ["02", "Plan", "We define the right direction, priorities, scope and project roadmap."],
                ["03", "Create", "We design, develop and refine the solution with you at every key step."],
                ["04", "Launch & grow", "We launch with care and help you plan what comes next."]
              ].map(([number, title, text]) => (
                <div key={number} className="relative border-t border-violet-300/30 pt-6">
                  <span className="font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-[-.06em] text-violet-300/70">{number}</span>
                  <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-12">
          <div className="container-shell">
            <div className="relative isolate overflow-hidden rounded-[28px] border border-violet-300/20 bg-gradient-to-br from-[#201744] via-[#171a3a] to-[#0e2540] px-7 py-14 sm:px-12 sm:py-16">
              <div className="glow-orb -right-20 -top-32 -z-10 size-80 bg-violet-500/30 blur-[90px]" />
              <div className="glow-orb -bottom-40 left-1/3 -z-10 size-80 bg-blue-500/20 blur-[90px]" />
              <div className="max-w-2xl">
                <span className="eyebrow">Your next chapter starts here</span>
                <h2 className="heading-lg mt-5">Have a good idea? Let&apos;s make it happen.</h2>
                <p className="mt-5 max-w-xl text-sm leading-7 text-indigo-100/70">Tell us what you&apos;re working towards. We&apos;ll help you explore the right digital direction for your business.</p>
                <Link href="/get-a-quote" className="button-primary mt-8 bg-white !text-[#17152e] shadow-none hover:!bg-violet-100">
                  Tell us about your project <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
