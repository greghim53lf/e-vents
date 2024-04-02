import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="flex-between wrapper flex-col md:flex-row gap-5 p-5 text-center">
        <Link href="/">
          <Image
            src="/assets/images/logo.svg"
            alt="logo"
            width={128}
            height={38}
          />
        </Link>
        <p>&copy;{new Date().getFullYear()} e-vents. All Rights reserved</p>
      </div>
    </footer>
  );
}
