import React from "react";
import { Header } from "./Header";
import { DetailsSection } from "./DetailsSection";

const LandingPage = () => {
  return (
    <section className="flex flex-col w-full gap-2">
      <Header />
      <DetailsSection />
    </section>
  );
};

export default LandingPage;
