import { Navbar } from "@/components/Navbar";
import { NAVBAR_HEIGHT } from "@/constant/values";
import { PropsWithChildren } from "react";

const AgentLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div
        style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
        className="w-full h-full"
      >
        {children}
      </div>
    </div>
  );
};

export default AgentLayout;
