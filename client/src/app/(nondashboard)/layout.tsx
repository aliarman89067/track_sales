import { Navbar } from "@/components/Navbar";
import { NAVBAR_HEIGHT } from "@/constant/values";
import React from "react";

const NonDashboardLayout = ({ children }: { children: React.ReactNode }) => {
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

export default NonDashboardLayout;
