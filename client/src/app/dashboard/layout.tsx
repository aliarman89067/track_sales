import { Navbar } from "@/components/Navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { NAVBAR_HEIGHT } from "@/constant/values";
import React, { PropsWithChildren } from "react";

const DashboardLayout = ({ children }: PropsWithChildren) => {
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
