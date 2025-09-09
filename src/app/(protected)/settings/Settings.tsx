"use client";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";
import { useRef, useState } from "react";
import { getInitials } from "@/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Cropper, type ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { updateUserAvatar, updateUserName } from "@/services/user";
import { useRouter } from "next/navigation";
import { IMAGES_URL } from "@/constants/images";
import { useTranslation } from "react-i18next";

interface Props {
  user: User;
}

export default function Settings({ user }: Props) {
  const router = useRouter();
  const { t } = useTranslation();

  const cropperRef = useRef<ReactCropperElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(
    `${user.firstName} ${user.lastName}`,
  );
  const [isCropperOpen, setIsCropperOpen] = useState<boolean>(false);
  const [image, setImage] = useState<string>("");

  const canSave =
    !!fullName && fullName !== `${user.firstName} ${user.lastName}`;

  const handleSelectImage = async () => {
    // tODO: add loading animation

    const fr = new FileReader();
    fr.onload = () => {
      setImage(fr.result as string);
      setIsCropperOpen(true);
    };

    const file = fileInputRef?.current?.files?.[0];
    if (file) {
      fr.readAsDataURL(file);
    }
  };

  const handleUploadImage = async () => {
    cropperRef?.current?.cropper.getCroppedCanvas().toBlob(async (blob) => {
      const file = fileInputRef?.current?.files?.[0];
      // TODO: add toast
      if (!blob || !file) return;

      await updateUserAvatar(user.id, file?.name ?? "", blob);
      setIsCropperOpen(false);
      router.refresh();
    });
  };

  const handleUpdateSettings = async () => {
    const [firstName, lastName] = fullName.split(" ");

    await updateUserName(user.id, firstName ?? "", lastName ?? "");
    router.refresh();
  };

  return (
    <div className={"max-w-[800px] w-full pt-20"}>
      <div className={"text-4xl font-semibold"}>{t("settings.title")}</div>

      <div className={"flex flex-col pt-20 gap-8"}>
        <div className={"py-4 border-b flex"}>
          <div className={"text-xl min-w-[60%]"}>
            <div className={"font-medium"}>{t("settings.photo.title")}</div>
            <div className={"text-muted-foreground"}>
              {t("settings.photo.subtitle")}
            </div>
          </div>
          <div className={"relative"}>
            <Avatar className={"w-[80px] h-[80px]"}>
              <AvatarImage src={`${IMAGES_URL}/${user.avatar}`} />
              <AvatarFallback>{getInitials(user)}</AvatarFallback>
            </Avatar>
            <label
              htmlFor={"avatarInput"}
              className={
                "opacity-0 hover:opacity-100 w-full h-full top-0 left-0 rounded-full absolute bg-primary/60 text-primary-foreground content-center text-center cursor-pointer select-none"
              }
            >
              {t("settings.photo.upload")}
            </label>
            <input
              onChange={handleSelectImage}
              ref={fileInputRef}
              id={"avatarInput"}
              type={"file"}
              className={"hidden"}
              accept={"image/png, image/jpeg"}
            />
          </div>
        </div>

        <div className={"py-4 border-b flex"}>
          <div className={"text-xl min-w-[60%]"}>
            <div className={"font-medium"}>{t("settings.fullname.title")}</div>
            <div className={"text-muted-foreground"}>
              {t("settings.fullname.subtitle")}
            </div>
          </div>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <Button disabled={!canSave} onClick={handleUpdateSettings}>
          {t("settings.save")}
        </Button>
      </div>

      <Dialog open={isCropperOpen} onOpenChange={setIsCropperOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>

          <Cropper
            src={image}
            style={{ height: 400, width: "100%" }}
            // Cropper.js options
            dragMode={"move"}
            aspectRatio={1 / 1}
            viewMode={1}
            autoCropArea={1}
            guides={false}
            crop={() => {}}
            ref={cropperRef}
          />
          <Button onClick={handleUploadImage}>{t("settings.save")}</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
