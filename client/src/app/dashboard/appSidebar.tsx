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
import { cn } from "@/lib/utils";
import { ChevronLeft, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface Props {
  organizations: OrganizationsWithMembersProps[] | undefined;
  setOrganization: Dispatch<
    SetStateAction<OrganizationsWithMembersProps | null>
  >;
  selectedOrganizationId: string;
}

export function AppSidebar({
  organizations,
  selectedOrganizationId,
  setOrganization,
}: Props) {
  const { open, setOpenMobile, setOpen } = useSidebar();
  return (
    <Sidebar className="w-[220px]">
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
          {organizations && organizations.length > 0 && (
            <div className="flex flex-col gap-3 w-full mt-4">
              {organizations.map((organization) => (
                <div
                  key={organization.id}
                  onClick={() => setOrganization(organization)}
                  className={cn(
                    "group w-full hover:bg-gray-200 flex items-center justify-center py-3 bg-white border text-primaryGray border-primaryGray rounded-lg cursor-pointer transition-all duration-150 ease-linear",
                    selectedOrganizationId === organization.id &&
                      "bg-primaryGray text-white hover:bg-primaryGray/90"
                  )}
                >
                  <span className="text-base">
                    {organization.organizationName}
                  </span>
                </div>
              ))}
            </div>
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
