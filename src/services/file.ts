"use server";

import fs from "node:fs";
import { NGINX_FILES_PATH } from "@/constants/images";

export async function uploadFile(filename: string, blob: Blob) {
  fs.writeFileSync(
    `${NGINX_FILES_PATH}/${filename}`,
    Buffer.from(await blob.arrayBuffer()),
  );
}
