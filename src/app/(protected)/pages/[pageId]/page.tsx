import { getPage } from "@/services/pages";
import { notFound } from "next/navigation";
import PageComponent from "./PageComponent";

interface Props {
  params: Promise<{ pageId: string }>;
}

export default async function Page(props: Props) {
  const params = await props.params;
  const page = await getPage(Number(params.pageId));

  if (!page) notFound();

  return <PageComponent page={page} />;
}
