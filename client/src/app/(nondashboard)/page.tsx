import React from "react";
import { Header } from "./Header";
import { DetailsSection } from "./DetailsSection";
import AgentHistoryPanel from "./AgentHistoryPanel";

const LandingPage = () => {
  return (
    <section className="flex flex-col w-full gap-2">
      <Header />
      <DetailsSection />
      <AgentHistoryPanel />
    </section>
  );
};

export default LandingPage;
