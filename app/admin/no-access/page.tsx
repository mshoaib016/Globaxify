import Link from "next/link";
import { signOut } from "../actions";

export default function NoAccessPage() {
  return (
    <main className="min-h-screen grid place-items-center px-5">
      <div className="max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
        <h1 className="text-2xl font-bold text-white">Admin access required</h1>
        <p className="mt-3 text-sm text-white/60">
          This account does not have administrator permission. Ask the site owner to grant access.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <form action={signOut}>
            <button className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-semibold text-white">Sign out</button>
          </form>
          <Link href="/" className="text-sm text-white/60 hover:text-white">Back to website</Link>
        </div>
      </div>
    </main>
  );
}
