import React from "react";
import AddAgentDataContainer from "./AddAgentDataContainer";

interface Props {
  params: Promise<{
    slug: string[];
  }>;
}

const AddAgentDataPage = async ({ params }: Props) => {
  const { slug } = await params;

  return <AddAgentDataContainer memberId={slug[0]} organizationId={slug[1]} />;
};

export default AddAgentDataPage;
