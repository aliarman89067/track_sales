import { UpdateMemberContainer } from "./updateMemberContainer";

interface Props {
  params: Promise<{
    memberId: string;
  }>;
}

const UpdateMemberPage = async ({ params }: Props) => {
  const { memberId } = await params;
  return <UpdateMemberContainer memberId={memberId} />;
};

export default UpdateMemberPage;
