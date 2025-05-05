"use client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const BackButton = ({ title, href }: BackButtonProps) => {
  return (
    <Link
      href={href}
      scroll={false}
      className="group max-w-[80px] w-full border border-primaryGray rounded-lg flex items-center justify-center py-2 cursor-pointer hover:bg-primaryGray transition-all duration-200"
    >
      <span className="text-primaryGray text-sm flex items-center justify-center group-hover:text-white transition-all duration-200">
        <ChevronLeft className="size-4 text-primaryGray group-hover:text-white transition-all duration-200" />
        {title}
      </span>
    </Link>
  );
};
