"use client";

import type { PageWithContent } from "@/types/page";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { updatePageContent, updatePageName } from "@/services/pages";
import { useRouter } from "next/navigation";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import type { EditorEvents } from "@tiptap/react";

interface Props {
  page: PageWithContent;
}
export default function PageComponent({ page }: Props) {
  const router = useRouter();
  const { t } = useTranslation();

  const [name, setName] = useState<string>(page.name);
  const [content, setContent] = useState<string>(page.content);
  const debouncedName = useDebounce(name, 500);
  const debouncedContent = useDebounce(content, 500);

  const onContentUpdate = ({ editor }: EditorEvents["update"]) => {
    const jsonContent = editor.getJSON();
    setContent(JSON.stringify(jsonContent));
  };

  useEffect(() => {
    updatePageName(page.id, debouncedName).then(() => router.refresh());
  }, [debouncedName]);

  useEffect(() => {
    console.log(debouncedContent);
    updatePageContent(page.id, debouncedContent);
  }, [debouncedContent]);

  return (
    <div className={"m-container mt-16"}>
      <Input
        autoFocus={name.length === 0}
        className="border-none bg-background! ring-0! text-5xl! h-[1.5lh]! p-0! px-3! shadow-none! w-full"
        placeholder={t("page.empty")}
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></Input>

      <div className={"mt-8"}>
        <SimpleEditor
          content={content ? JSON.parse(content) : undefined}
          onUpdate={onContentUpdate}
        />
      </div>
    </div>
  );
}
