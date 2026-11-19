import Link from "next/link";
import { ArrowUpRight, Linkedin, Instagram, Facebook, Mail } from "lucide-react";
import Image from "next/image";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#070910]">
      <div className="container-shell py-10">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" aria-label="Globaxify home"><Image src="/footer-logo-3d.png" alt="Globaxify - Global eCommerce Experts" width={1983} height={793} className="h-auto w-[280px] max-w-full" /></Link>
            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">
              Digital experiences, thoughtful design and technology that move businesses forward.
            </p>
            <a href={`mailto:${siteConfig.email}`} className="mt-5 inline-flex items-center gap-2 text-sm text-violet-200 hover:text-white">
              <Mail size={15} /> {siteConfig.email}
            </a>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Explore</h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-slate-400">
              <Link href="/about" className="hover:text-white">About us</Link>
              <Link href="/services" className="hover:text-white">Services</Link>
              <span role="link" aria-disabled="true" title="New portfolio link coming soon" className="hover:text-white">Our work</span>
              <Link href="/blog" className="hover:text-white">Insights</Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Get in touch</h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-slate-400">
              <Link href="/contact" className="hover:text-white">Contact</Link>
              <Link href="/get-a-quote" className="hover:text-white">Request a quote</Link>
              <Link href="/faqs" className="hover:text-white">FAQs</Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Follow along</h3>
            <div className="mt-5 flex gap-3">
              {[Instagram, Facebook, Linkedin].map((Icon, index) => (
                <span key={index} className="grid size-10 place-items-center rounded-xl border border-white/10 text-slate-300">
                  <Icon size={17} />
                </span>
              ))}
            </div>
            <Link href="/get-a-quote" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-violet-200 hover:text-white">
              Start a project <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.08] pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Globaxify. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="hover:text-white">Privacy</Link>
            <Link href="/terms-and-conditions" className="hover:text-white">Terms</Link>
            <Link href="/cookies-policy" className="hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
