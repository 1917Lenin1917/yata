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

  return <ProjectComponent project={project}></ProjectComponent>;
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
