import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NAVBAR_HEIGHT } from "@/constant/values";
import { ChevronLeft, X } from "lucide-react";

export function AppSidebar() {
  const { open, setOpenMobile, setOpen } = useSidebar();
  return (
    <Sidebar className="w-[200px]">
      <SidebarContent
        style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
        className="bg-white"
      >
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-center gap-3 w-full">
            <span className="font-medium text-lg text-secondaryGray">
              Organizations
            </span>
            <div
              onClick={() => setOpen(false)}
              className="group w-6 h-6 rounded-full bg-primaryGray text-white border hover:bg-white hover:border-primaryGray hover:text-primaryGray flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft className="size-4 transition-all duration-200" />
            </div>
          </SidebarGroupLabel>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
