"use client";
import { Navbar } from "@/components/Navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { NAVBAR_HEIGHT } from "@/constant/values";
import { useGetAuthUserQuery } from "@/state/api";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { PropsWithChildren, useEffect } from "react";

const DashboardLayout = ({ children }: PropsWithChildren) => {
  const {
    data: authData,
    isLoading: isAuthLoading,
    isError,
  } = useGetAuthUserQuery();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/dashboard") {
      if (authData?.cognitoId && authData?.role === "admin") {
        router.push("/dashboard/admin");
      } else if (authData?.cognitoId && authData?.role === "agent") {
        router.push("/");
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
    <SidebarProvider defaultOpen={false}>
      <main className="flex flex-col w-full">
        <Navbar />
        <div
          style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
          className="w-full h-full"
        >
          <div
            style={{ top: `calc(10px + ${NAVBAR_HEIGHT}px)` }}
            className="fixed left-5 xl:left-10 z-10"
          >
            <SidebarTrigger variant="custom" className="w-11 h-11" />
          </div>
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
