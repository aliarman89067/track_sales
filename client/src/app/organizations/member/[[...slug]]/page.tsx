import React from "react";
import MemberDetailsContainer from "./MemberDetailsContainer";

const MemberDetails = async ({ params }: MemberDetails) => {
  const { slug } = await params;
  return (
    <>
      <MemberDetailsContainer memberId={slug[0]} organizationId={slug[1]} />
    </>
  );
};

export default MemberDetails;
