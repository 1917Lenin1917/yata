import ProjectComponent from "./Project";
import { getProjectWithPages, getProjectWithTickets } from "@/services/project";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectPage(props: Props) {
  const params = await props.params;
  const project = await getProjectWithPages(Number(params.projectId));

  if (!project) notFound();

  return (
    <div className={"w-full max-w-[1400px] mt-16"}>
      <ProjectComponent project={project}></ProjectComponent>
    </div>
  );
}

type MetaProps = {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
}: MetaProps): Promise<Metadata> {
  const projectId = (await params).projectId;

  const project = await getProjectWithTickets(Number(projectId));

  if (!project) return {};

  return {
    // icons: "/icons/ru.svg",
    title: `${project?.emoji} ${project?.name}`,
    description: project?.description,
  };
}
