"use client";
import { EmptyPaperPlaneCTA } from "@/components/EmptyPaperPlaneCTA";
import { NAVBAR_HEIGHT } from "@/constant/values";
import { Menu } from "lucide-react";
import React from "react";
import { AppSidebar } from "./appSidebar";

const Dashboard = () => {
  const isUser = false;
  return (
    <section className="relative max-w-screen-xl w-full mx-auto">
      <AppSidebar />
      {/* <div
        style={{ top: `calc(10px + ${NAVBAR_HEIGHT}px)` }}
        className="fixed left-5 xl:left-10"
      >
        <div className="w-11 h-11 rounded-full bg-primaryGray flex items-center justify-center cursor-pointer">
          <Menu className="size-5 text-white" />
        </div>
      </div> */}
      {isUser ? (
        <div></div>
      ) : (
        <div className="w-full">
          <EmptyPaperPlaneCTA
            title="Create Your First Organization"
            onClick={() => {}}
          />
        </div>
      )}
    </section>
  );
};

export default Dashboard;
