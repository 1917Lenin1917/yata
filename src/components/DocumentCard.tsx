import { Card, CardContent } from "@/components/ui/card";
import type { Page } from "@/types/page";
import { useTranslation } from "react-i18next";
import { useUpdatedAgo } from "@/hooks/useUpdatedAgo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  page: Page;
}
export default function DocumentCard({ page }: Props) {
  const { t } = useTranslation();
  const timeAgo = useUpdatedAgo(page.updatedAt ?? "", {});
  return (
    <Link href={`/pages/${page.id}`}>
      <Card className={"py-4"}>
        <CardContent className={"flex flex-col gap-1"}>
          <div className={cn("text-xl", !page.name && "text-muted-foreground")}>
            {page.name || t("page.empty")}
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <time
                dateTime={page.updatedAt ?? undefined}
                className={"w-fit text-sm text-muted-foreground"}
              >
                {timeAgo}
              </time>
            </TooltipTrigger>
            <TooltipContent>{page.updatedAt}</TooltipContent>
          </Tooltip>
        </CardContent>
      </Card>
    </Link>
  );
}
