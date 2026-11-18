import Link from "next/link";
import Image from "next/image";

export function Brand() {
  return (
    <Link href="/" aria-label="Globaxify home" className="block w-full">
      <Image src="/footer-logo-3d.png" alt="Globaxify - Global eCommerce Experts" width={1983} height={793} className="h-auto w-full object-contain" priority />
    </Link>
  );
}
