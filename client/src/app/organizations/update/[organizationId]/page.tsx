import { UpdateContainer } from "./UpdateContainer";

interface Props {
  params: Promise<{
    organizationId: string;
  }>;
}

const OrganizationUpdatePage = async ({ params }: Props) => {
  const { organizationId } = await params;
  return <UpdateContainer organizationId={organizationId} />;
};

export default OrganizationUpdatePage;
