import ProjectComponent from "./Project";
import { getProjectWithTickets } from "@/services/project";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectPage(props: Props) {
  const params = await props.params;
  const project = await getProjectWithTickets(Number(params.projectId));

  if (!project) notFound();

  return (
    <div className={"my-8"}>
      <div className={"px-8 text-4xl"}>
        {project.emoji} {project.name}
      </div>
      <div className={"px-8 py-2 text-xl"}>{project.description}</div>
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
    title: `${project?.emoji} ${project?.name}`,
    description: project?.description,
  };
}
