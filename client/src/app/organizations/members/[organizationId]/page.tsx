import React from "react";
import MembersGrid from "./MembersGrid";

const Members = async ({ params }: MembersPageProps) => {
  const { organizationId } = await params;
  return (
    <>
      <MembersGrid organizationId={organizationId} />
    </>
  );
};

export default Members;
