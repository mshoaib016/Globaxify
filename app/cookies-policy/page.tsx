import { PolicyPage } from "@/components/policy-page";
import policies from "@/lib/policy-content.json";

export const metadata = { title: "Cookies Policy", description: policies.cookies.subtitle };
export default function CookiesPage() { return <PolicyPage policy={policies.cookies} />; }
