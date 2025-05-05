import { LeaveContainer } from "./LeaveContainer";

interface Props {
  params: Promise<{
    memberId: string;
  }>;
}

const LeavePage = async ({ params }: Props) => {
  const { memberId } = await params;
  return <LeaveContainer memberId={memberId} />;
};
export default LeavePage;
