import { auth } from "@/lib/auth";
import InterviewBriefingView from "@/modules/interview/ui/views/interview-briefing-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { id } = await params;

  return <InterviewBriefingView id={id} />;
};

export default Page;
