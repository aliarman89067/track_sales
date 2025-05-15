import { FOOTER_FEATURES, NAVBAR_LINKS } from "@/constant/data";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex flex-col gap-7 max-w-screen-xl w-full mx-auto max-md:gap-10 max-md:px-8 py-10">
      <div className="flex justify-between flex-col md:flex-row gap-3 max-md:gap-10">
        <div className="flex-1 flex md:justify-center">
          <Link href="/" className="text-left">
            <span className="font-jacquesFrancois font-semibold text-primaryGray text-4xl">
              Logo
            </span>
          </Link>
        </div>
        <div className="flex-1 flex flex-col gap-2 md:items-center">
          <h2 className="font-semibold text-primaryGray text-xl">
            Quick Links
          </h2>
          <div className="flex flex-col gap-1 md:items-center">
            {NAVBAR_LINKS.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-secondaryGray font-medium text-lg"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2 md:items-center">
          <h2 className="font-semibold text-primaryGray text-xl">Features</h2>
          <div className="flex flex-col gap-1 md:items-center">
            {FOOTER_FEATURES.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-secondaryGray font-medium text-lg"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <p className=" text-center text-secondaryGray font-medium text-base">
        © 2025 Ali Arman. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
