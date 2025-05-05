import React from "react";
import AddMemberPage from "./AddMemberPage";

const AddMember = async ({ params }: AddMemberProps) => {
  const { organizationId } = await params;
  //   Because its a server component because of params I have to make main component in separate client file
  return <AddMemberPage organizationId={organizationId} />;
};

export default AddMember;
