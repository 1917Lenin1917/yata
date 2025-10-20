import { getPage } from "@/services/pages";
import { notFound } from "next/navigation";
import PageComponent from "./PageComponent";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface Props {
  params: Promise<{ pageId: string }>;
}

export default async function Page(props: Props) {
  const params = await props.params;
  const page = await getPage(Number(params.pageId));

  if (!page) notFound();

  return (
    <>
      <header className={"h-[44px] w-full p-2 sticky top-0 bg-background z-50"}>
        <SidebarTrigger />
      </header>
      <PageComponent page={page} />
    </>
  );
}
