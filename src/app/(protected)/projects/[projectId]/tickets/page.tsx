import { getProjectWithTickets } from "@/services/project";
import { notFound } from "next/navigation";
import TicketsPageComponent from "@/app/(protected)/projects/[projectId]/tickets/TicketsPageComponent";

interface Props {
  params: Promise<{ projectId: string }>;
}

export default async function TicketsPage(props: Props) {
  const params = await props.params;
  const project = await getProjectWithTickets(Number(params.projectId));

  if (!project) notFound();

  return (
    <div className={"w-full max-w-[1400px] mt-16"}>
      <TicketsPageComponent project={project}></TicketsPageComponent>
    </div>
  );
}
