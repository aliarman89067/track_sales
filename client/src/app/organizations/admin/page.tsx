"use client";
import { EmptyPaperPlaneCTA } from "@/components/EmptyPaperPlaneCTA";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useGetAuthUserQuery,
  useGetMemberOrganizationQuery,
} from "@/state/api";
import { ArrowRight, Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const AdminOrganizations = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const organizationId = searchParams.get("organizationId");

  const [isHighLight, setIsHighLight] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const { data: authData, isLoading: isAuthLoading } = useGetAuthUserQuery();
  const {
    data: organizationsData,
    isLoading: isOrganizationsLoading,
    refetch,
  } = useGetMemberOrganizationQuery(
    {
      adminCognitoId: authData?.cognitoId,
    },
    {
      skip: !authData?.cognitoId,
    }
  );

  useEffect(() => {
    if (!isAuthLoading && authData?.cognitoId) {
      refetch();
    }
    if (!containerRef.current) return;
    const items = containerRef.current.children;
    let target: Element | null = null;
    for (const item of items) {
      if (item.id === organizationId) {
        target = item;
        setIsHighLight(true);
      }
    }
    if (!target) return;
    const { top } = target.getBoundingClientRect();
    window.scrollTo({ top, behavior: "smooth" });
    const timeoutId = setTimeout(() => {
      setIsHighLight(false);
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, [isAuthLoading, authData?.cognitoId, organizationsData]);

  if (isAuthLoading || isOrganizationsLoading) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <div className="flex justify-center items-center gap-2">
          <Loader2 className="size-5 text-primaryGray animate-spin" />
          <span className="text-base text-primaryGray">Loading...</span>
        </div>
      </div>
    );
  }

  const isOrganizationData = organizationsData && organizationsData.length > 0;

  const membersLength = (organization: OrganizationsProps) =>
    organization.members && organization.members.length
      ? organization.members.length
      : 0;

  return (
    <section className="max-w-screen-xl w-full mx-auto px-2 sm:px-4">
      {isOrganizationData ? (
        <div className="flex max-w-screen-sm lg:max-w-screen-lg xl:max-w-screen-xl w-full mx-auto justify-center mt-10">
          <div
            ref={containerRef}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 w-full h-fit gap-4"
          >
            <div
              id="1"
              onClick={() => router.push("/organizations/create")}
              className="py-4 px-5 border border-gray-300 hover:border-gray-400 transition-all duration-200 ease-linear shadow-sm hover:shadow-md rounded-xl cursor-pointer"
            >
              <div className="group flex flex-col items-center justify-center gap-1 w-full h-full">
                <div className="transform translate-x-0 translate-y-0 group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-500 ease-in-out">
                  <Image
                    src="/paperPlane.png"
                    alt="Create new organization box"
                    width={700}
                    height={700}
                    className="w-[200px] object-contain"
                  />
                </div>
                <span className="text-secondaryGray text-lg font-semibold">
                  Create new organization
                </span>
                <Plus className="size-6 text-secondaryGray" />
              </div>
            </div>
            {organizationsData.map((organization) => (
              <div
                id={organization.id}
                key={organization.id}
                className={cn(
                  "py-4 px-5 border border-gray-300 hover:border-gray-400 transition-all duration-200 ease-linear shadow-sm hover:shadow-md rounded-xl flex flex-col justify-between",
                  organization.id === organizationId &&
                    isHighLight &&
                    "border-2 border-gray-800 shadow-2xl bg-gray-200"
                )}
              >
                <div className="flex flex-col w-full">
                  <div className="flex justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        <Image
                          src={organization.imageUrl}
                          alt="Organization Image"
                          width={600}
                          height={600}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <span className="font-semibold text-lg text-primaryGray">
                        {organization.organizationKeyword} Sales Team
                      </span>
                      <span className="text-base font-semibold text-secondaryGray">
                        {membersLength(organization)} peoples added
                      </span>
                    </div>
                    <div
                      onClick={() =>
                        router.push(
                          `/organizations/member/add/${organization.id}`
                        )
                      }
                      className="group px-5 h-11 rounded-full border-2 border-brand-500 bg-white flex items-center justify-center cursor-pointer hover:bg-brand-500 transition-all duration-200 ease-in-out"
                    >
                      <span className="text-brand-500 text-sm flex items-center gap-1 group-hover:text-white transition-all duration-200 ease-in-out">
                        <Plus className="size-4" />
                        Add Member
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center flex-col gap-2 w-full mt-5">
                    <MemberRow organization={organization} />
                  </div>
                </div>
                <Button
                  onClick={() =>
                    router.push(`/organizations/members/${organization.id}`)
                  }
                  className="mt-3 flex items-center justify-center w-full bg-brand-500 hover:bg-brand-500/90 h-12 rounded-lg"
                >
                  See All
                  <span>({membersLength(organization)})</span>
                  <ArrowRight />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyPaperPlaneCTA
          onClick={() => router.push("/organizations/create")}
          title="Create Your First Organization"
        />
      )}
    </section>
  );
};

export default AdminOrganizations;

const MemberRow = ({ organization }: { organization: OrganizationsProps }) => {
  const router = useRouter();
  return (
    <>
      {organization.members &&
        organization.members.length > 0 &&
        organization.members.slice(0, 3).map((member) => (
          <div
            key={member.id}
            onClick={() =>
              router.push(
                `/organizations/member/${member.id}/${organization.id}`
              )
            }
            className="border border-gray-300 hover:border-gray-400 cursor-pointer px-3 py-2 rounded-lg w-full hover:w-[102%] transition-all duration-200 ease-in-out"
          >
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  <Image
                    src={member.imageUrl}
                    alt={`${member.name} profile image`}
                    width={600}
                    height={600}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <h2 className="font-semibold text-primaryGray text-base">
                    {member.name}
                  </h2>
                  <span className="font-medium text-secondaryGray text-sm">
                    {member.email.substring(0, 15)}...
                  </span>
                  <div className="bg-white border border-gray-300 px-3 py-1 rounded-full flex items-center justify-center mt-1">
                    <span className="text-secondaryGray text-sm font-light">
                      {organization.organizationKeyword} Sale Agent
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(
                    `/agent/add/data/${member.id}/${organization.id}`
                  );
                }}
                className="group bg-brand-500 px-5 h-fit rounded-full py-1 hover:bg-white cursor-pointer border hover:border-gray-200 transition-all duration-200 ease-in-out"
              >
                <span className="text-white group-hover:text-brand-500 text-sm">
                  Enter data
                </span>
              </button>
            </div>
          </div>
        ))}
    </>
  );
};
