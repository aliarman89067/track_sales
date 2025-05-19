import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export const AuthToggler = ({ role, setRole }: AuthTogglerProps) => {
  const handleToggle = (roleStr: "admin" | "agent") => {
    setRole(roleStr);
    // window.location.reload();
  };

  return (
    <div className="bg-brand-200 w-full rounded-lg flex items-center justify-center space-x-2 mt-4 p-1.5">
      <Button
        onClick={() => handleToggle("admin")}
        className={cn(
          "group flex-1 py-6",
          role === "admin"
            ? "bg-primaryGray hover:bg-primaryGray"
            : "bg-white hover:bg-white text-primaryGray"
        )}
      >
        Continue as Admin
        <ArrowRight
          className={cn(
            "size-5 transform group-hover:translate-x-1 transition-all duration-200",
            role === "admin" ? "text-white" : "text-primaryGray"
          )}
        />
      </Button>
      <Button
        onClick={() => handleToggle("agent")}
        className={cn(
          "group flex-1 py-6",
          role === "admin"
            ? "bg-white hover:bg-white text-primaryGray"
            : "bg-primaryGray hover:bg-primaryGray"
        )}
      >
        Continue as Agent
        <ArrowRight
          className={cn(
            "size-5 transform group-hover:translate-x-1 transition-all duration-200",
            role === "admin" ? "text-primaryGray" : "text-white"
          )}
        />
      </Button>
    </div>
  );
};
