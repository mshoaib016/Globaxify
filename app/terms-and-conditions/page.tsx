import { PolicyPage } from "@/components/policy-page";
import policies from "@/lib/policy-content.json";

export const metadata = { title: policies.terms.title, description: policies.terms.subtitle };
export default function TermsPage() { return <PolicyPage policy={policies.terms} />; }
