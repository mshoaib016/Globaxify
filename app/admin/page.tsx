import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

const modules = [
  { title: "Projects", description: "Manage portfolio projects", href: "/admin/projects" },
  { title: "Services", description: "Manage your service offerings", href: "/admin/services" },
  { title: "Blog posts", description: "Create and publish articles", href: "/admin/blog" },
  { title: "Inquiries", description: "Review contact and quote requests", href: "/admin/inquiries" },
  { title: "Testimonials", description: "Manage client feedback", href: "/admin/testimonials" },
  { title: "FAQs", description: "Edit common questions", href: "/admin/faqs" },
  { title: "SEO settings", description: "Manage site metadata", href: "/admin/seo" },
  { title: "Media library", description: "Manage uploaded assets", href: "/admin/media" },
];

async function countRows(supabase: Awaited<ReturnType<typeof createClient>>, table: string) {
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
  return error ? "—" : (count ?? 0).toString();
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [projects, services, posts, inquiries, testimonials, faqs] = await Promise.all([
    countRows(supabase, "projects"),
    countRows(supabase, "services"),
    countRows(supabase, "blog_posts"),
    countRows(supabase, "inquiries"),
    countRows(supabase, "testimonials"),
    countRows(supabase, "faqs"),
  ]);

  const stats = [
    ["Projects", projects], ["Services", services], ["Blog posts", posts],
    ["Inquiries", inquiries], ["Testimonials", testimonials], ["FAQs", faqs],
  ];

  return (
    <main className="min-h-screen px-5 py-8 md:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.25em] text-violet-300">Globaxify Control</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-white/50">Signed in as {user.email}</p>
          </div>
          <form action={signOut}>
            <button className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/75 hover:bg-white/10">Sign out</button>
          </form>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm text-white/55">{label}</p>
              <p className="mt-3 text-3xl font-bold text-white">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-white">Website management</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((module) => (
              <Link key={module.title} href={module.href}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-violet-400/50 hover:bg-violet-400/[0.07]">
                <h3 className="font-semibold text-white">{module.title}</h3>
                <p className="mt-2 text-sm text-white/50">{module.description}</p>
                <span className="mt-5 inline-block text-sm text-violet-300">Open module →</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
