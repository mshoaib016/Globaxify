import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function NotFound(){return <main className="container-shell flex min-h-[65vh] flex-col items-start justify-center"><p className="eyebrow">404 / Page not found</p><h1 className="mt-5 text-5xl font-semibold text-white">This page isn't here.</h1><p className="mt-4 max-w-lg text-sm leading-7 text-slate-400">The link may be outdated or the page may have moved.</p><Link href="/" className="button-primary mt-8 inline-flex"><ArrowLeft size={16}/> Back to homepage</Link></main>}
