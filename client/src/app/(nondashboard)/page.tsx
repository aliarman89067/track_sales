import React from "react";
import { Header } from "./Header";
import { DetailsSection } from "./DetailsSection";
import AgentHistoryPanel from "./AgentHistoryPanel";
import Footer from "./Footer";

const LandingPage = () => {
  return (
    <section className="flex flex-col w-full gap-2">
      <Header />
      <DetailsSection />
      <AgentHistoryPanel />
      <Footer />
    </section>
  );
};

export default LandingPage;
