 "use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Brand } from "@/components/brand";
import { navigation } from "@/lib/site";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#090b14]/85 backdrop-blur-xl">
      <div className="container-shell app-navbar-row grid h-[76px] grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="app-navbar-brand col-start-2 row-start-1 w-[clamp(116px,34vw,190px)] justify-self-center min-[1101px]:col-start-1 min-[1101px]:w-[190px] min-[1101px]:justify-self-start"><Brand /></div>
        <nav aria-label="Main navigation" className="col-start-2 row-start-1 hidden items-center gap-8 min-[1101px]:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link text-[13px] font-medium">
              {item.label}
            </Link>
          ))}
        </nav>
        <span role="link" aria-disabled="true" title="New portfolio link coming soon" className="app-navbar-portfolio col-start-1 row-start-1 inline-flex min-h-[38px] items-center gap-2 justify-self-start rounded-full border border-white/15 bg-white/10 px-3 text-[11px] text-white min-[1101px]:col-start-3 min-[1101px]:justify-self-end">
          Portfolio <ArrowUpRight size={14} className="hidden min-[380px]:block" />
        </span>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="col-start-3 row-start-1 grid size-10 place-items-center justify-self-end rounded-xl border border-white/10 text-white min-[1101px]:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <nav aria-label="Mobile navigation" className="border-t border-white/[0.07] bg-[#0c1020] px-[18px] py-4 min-[1101px]:hidden">
          <div className="container-shell flex flex-col gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-slate-200 hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/get-a-quote" onClick={() => setOpen(false)} className="button-primary mt-2">
              Let&apos;s Talk <ArrowUpRight size={16} />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
