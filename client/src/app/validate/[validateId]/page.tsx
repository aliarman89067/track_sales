import { BackButton } from "@/components/BackButton";
import { ValidateModel } from "./ValidateModel";

interface Props {
  params: Promise<{
    validateId: string;
  }>;
}

const ValidatePage = async ({ params }: Props) => {
  const { validateId } = await params;
  return (
    <section className="flex w-full h-screen items-center justify-center">
      <div className="absolute top-3 left-3 w-52">
        <BackButton href="/" title="Home" />
      </div>
      <ValidateModel validateId={validateId} />
    </section>
  );
};
export default ValidatePage;
