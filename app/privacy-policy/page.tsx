import { PolicyPage } from "@/components/policy-page";
import policies from "@/lib/policy-content.json";

export const metadata = { title: policies.privacy.title, description: policies.privacy.subtitle };
export default function PrivacyPage() { return <PolicyPage policy={policies.privacy} />; }
