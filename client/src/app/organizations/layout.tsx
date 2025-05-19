"use client";
import React, { PropsWithChildren, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { NAVBAR_HEIGHT } from "@/constant/values";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

const OrganizationsLayout = ({ children }: PropsWithChildren) => {
  const {
    data: authData,
    isLoading: isAuthLoading,
    isError,
  } = useGetAuthUserQuery();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const organizationId = searchParams.get("organizationId");

    if (pathname === "/organizations") {
      if (authData?.cognitoId && authData?.role === "admin") {
        if (organizationId) {
          router.push(`/organizations/admin?organizationId=${organizationId}`);
        } else {
          router.push("/organizations/admin");
        }
      } else if (authData?.role === "agent") {
        router.push("/organizations/agent");
      }
    }
  }, [authData, isAuthLoading, isError, pathname]);
  if (isAuthLoading) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <div className="flex justify-center items-center gap-2">
          <Loader2 className="size-5 text-primaryGray animate-spin" />
          <span className="text-base text-primaryGray">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <main className="flex flex-col">
      <Navbar />
      <div
        style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
        className="w-full h-full"
      >
        {children}
      </div>
    </main>
  );
};

export default OrganizationsLayout;
