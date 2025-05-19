"use client";
import Link from "next/link";
import { CTASecondaryButton } from "./CTASecondaryButton";
import { NAVBAR_HEIGHT } from "@/constant/values";
import { usePathname, useRouter } from "next/navigation";
import {
  useDeleteMemberMutation,
  useDeleteOrganizationMutation,
  useGetAuthUserQuery,
} from "@/state/api";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { NAVBAR_LINKS } from "@/constant/data";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { openAlertDialog, openOrgDialog } from "@/state";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { signOut } from "@aws-amplify/auth";

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isLoading } = useGetAuthUserQuery();
  const [removeMember] = useDeleteMemberMutation();
  const [removeOrganization] = useDeleteOrganizationMutation();
  console.log(data);
  const { isAlertDialogOpen, memberId, isOrgDialogOpen, orgId } =
    useAppSelector((state) => state.global);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    if (isAlertDialogOpen) {
      dispatch(
        openAlertDialog({
          openValue: false,
          memberId: "",
          isRemoved: false,
        })
      );
    } else if (isOrgDialogOpen) {
      dispatch(
        openOrgDialog({
          openValue: false,
          orgId: "",
          isRemoved: false,
        })
      );
    }
  };

  const handleRemove = async () => {
    if (isAlertDialogOpen) {
      try {
        await removeMember({
          memberId,
        });
        dispatch(
          openAlertDialog({
            memberId,
            isRemoved: true,
            openValue: false,
          })
        );
      } catch (error) {
        console.log(error);
      }
    } else if (isOrgDialogOpen) {
      try {
        await removeOrganization({
          organizationId: orgId,
        });
        dispatch(
          openOrgDialog({
            orgId,
            isRemoved: true,
            openValue: false,
          })
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSignOut = async (role: string) => {
    if (role === "admin") {
      try {
        if (pathname !== "/") {
          router.replace("/");
        }
        await signOut();
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-fit bg-white z-50">
      {/* Remove Member Custom Dialog */}
      <div
        className={cn(
          "absolute top-0 left-0 w-screen h-screen bg-black/40 flex items-center justify-center z-[100] px-4 transition-all duration-150 ease-linear",
          isAlertDialogOpen || isOrgDialogOpen
            ? "opacity-100 pointer-events-auto select-auto"
            : "opacity-0 pointer-events-none select-none"
        )}
      >
        <div className="flex flex-col bg-white rounded-lg px-4 py-3">
          <h1 className="font-semibold text-primaryGray text-lg">
            Are you sure?
          </h1>
          <p className="font-medium text-secondaryGray text-base">
            {isAlertDialogOpen && (
              <>
                This action cannot be undone. Member will remove from database
                permenantly!
              </>
            )}
            {isOrgDialogOpen && (
              <>
                This action cannot be undone. Organization will remove from
                database permenantly!
              </>
            )}
          </p>
          <div className="mt-6 flex items-center gap-4">
            <Button variant="outline" size="lg" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleRemove} variant="destructive" size="lg">
              Remove
            </Button>
          </div>
        </div>
      </div>
      <div
        style={{ height: `${NAVBAR_HEIGHT}px` }}
        className="flex items-center justify-between mx-auto w-full px-5 xl:px-10"
      >
        <div className="flex items-center justify-start gap-20">
          {/* Left Part */}
          <Link href="/" className="text-left">
            <span className="font-jacquesFrancois font-semibold text-primaryGray text-2xl">
              Logo
            </span>
          </Link>
          {/* Center Part */}
          {data && data.cognitoId && (
            <div className="flex items-center gap-4">
              {NAVBAR_LINKS.map((item) => (
                <Link
                  key={item.id}
                  href={
                    item.href === "/organizations" && data?.cognitoId
                      ? data?.role === "admin"
                        ? "/organizations/admin"
                        : "/organizations/agent"
                      : item.href
                  }
                >
                  <span className="text-primaryGray text-base">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          )}
          {data && data.role === "agent" && (
            <Link href={"/organizations/agent"}>
              <span className="text-primaryGray text-base">Organizations</span>
            </Link>
          )}
        </div>
        {/* Right Part */}
        {isLoading ? (
          <div>
            <Loader2 className="size-5 animate-spin text-secondaryGray" />
          </div>
        ) : (
          <>
            {data && data.cognitoId ? (
              <div className="flex items-center gap-5">
                <CTASecondaryButton
                  title="Add Agent"
                  onClick={() => router.push("/agent")}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center cursor-pointer bg-gray-200 shrink-0">
                      <Image
                        src={data.imageUrl}
                        alt="user profile picture"
                        width={40}
                        height={40}
                        className="w-6 h-6 object-cover"
                      />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[170px] mr-5">
                    <DropdownMenuItem
                      onClick={() => handleSignOut("admin")}
                      className="font-medium text-base text-primaryGray"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : data && data.role === "agent" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center cursor-pointer bg-gray-200 shrink-0">
                    <Image
                      src={data.imageUrl}
                      alt="user profile picture"
                      width={40}
                      height={40}
                      className="w-6 h-6 object-cover"
                    />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[170px] mr-5">
                  <DropdownMenuItem
                    onClick={() => handleSignOut("agent")}
                    className="font-medium text-base text-primaryGray"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <CTASecondaryButton
                  title="Login"
                  onClick={() => router.push("/signin")}
                />
                <CTASecondaryButton
                  title="Signup"
                  onClick={() => router.push("/signup")}
                />
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};
