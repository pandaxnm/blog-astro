import { readFileSync } from "node:fs";
import { join } from "node:path";

const fontsDir = join(process.cwd(), "public/fonts");

export default async function loadOgFonts(_text: string) {
  return [
    {
      name: "Noto Sans SC",
      data: readFileSync(join(fontsDir, "NotoSansSC-Regular.woff")),
      weight: 400,
      style: "normal",
    },
    {
      name: "Noto Sans SC",
      data: readFileSync(join(fontsDir, "NotoSansSC-Bold.woff")),
      weight: 700,
      style: "bold",
    },
  ];
}
