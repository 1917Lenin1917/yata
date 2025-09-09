import { Button } from "@/components/ui/button";
import { type ComponentProps, useState } from "react";
import EmojiPicker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";

interface Props extends ComponentProps<"div"> {
  currentEmoji: string;
  handleUpdateEmoji(newEmoji: string): void;
}
export default function DisplaySelectEmoji({
  currentEmoji,
  handleUpdateEmoji,
  ...rest
}: Props) {
  // const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();
  const { theme } = useTheme();

  return (
    <div {...rest}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={"aspect-square p-0 text-4xl"}
        variant={"ghost"}
      >
        {currentEmoji}
      </Button>
      {isOpen && (
        <div className={"absolute"}>
          <EmojiPicker
            theme={theme}
            locale={i18n.language}
            data={data}
            onClickOutside={() => setIsOpen(false)}
            onEmojiSelect={({ native }: { native: string }) =>
              handleUpdateEmoji(native)
            }
          />
        </div>
      )}
    </div>
  );
}
