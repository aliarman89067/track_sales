"use client";
import Link from "next/link";
import { CTASecondaryButton } from "./CTASecondaryButton";
import { NAVBAR_HEIGHT } from "@/constant/values";
import { useRouter } from "next/navigation";
import { useGetAuthUserQuery } from "@/state/api";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { NAVBAR_LINKS } from "@/constant/data";

export const Navbar = () => {
  const router = useRouter();
  const { data, isLoading } = useGetAuthUserQuery();

  return (
    <nav className="fixed top-0 left-0 w-full h-fit bg-white z-50">
      <div
        style={{ height: `${NAVBAR_HEIGHT}px` }}
        className="flex items-center justify-between mx-auto w-full px-5 xl:px-10"
      >
        <div className="flex items-center justify-start gap-20">
          {/* Left Part */}
          <Link href="/" className="text-left">
            <span className="font-jacquesFrancois font-semibold text-primaryGray text-2xl">
              Logo
            </span>
          </Link>
          {/* Center Part */}
          {data && data.cognitoId && (
            <div className="flex items-center gap-4">
              {NAVBAR_LINKS.map((item) => (
                <Link
                  key={item.id}
                  href={
                    item.href === "/organizations" && data?.cognitoId
                      ? data?.role === "admin"
                        ? "/organizations/admin"
                        : "/organizations/agent"
                      : item.href
                  }
                >
                  <span className="text-primaryGray text-base">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
        {/* Right Part */}
        {isLoading ? (
          <div>
            <Loader2 className="size-5 animate-spin text-secondaryGray" />
          </div>
        ) : (
          <>
            {data && data.cognitoId ? (
              <div className="flex items-center gap-5">
                <CTASecondaryButton
                  title="Add Agent"
                  onClick={() => router.push("/agent")}
                />
                <div className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center cursor-pointer bg-gray-200 shrink-0">
                  <Image
                    src={data.imageUrl}
                    alt="user profile picture"
                    width={40}
                    height={40}
                    className="w-6 h-6 object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <CTASecondaryButton
                  title="Login"
                  onClick={() => router.push("/signin")}
                />
                <CTASecondaryButton
                  title="Signup"
                  onClick={() => router.push("/signup")}
                />
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};
