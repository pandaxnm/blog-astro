/** 从 Live Photo 资源目录解析封面图与视频路径，如 /assets/IMG_5052 → IMG_5052.jpeg / IMG_5052.MOV */
export function resolveLivePhotoPaths(folder: string) {
  const base = folder.replace(/\/+$/, "");
  const name = base.split("/").pop() ?? "";

  if (!name) {
    throw new Error(`Invalid Live Photo folder: "${folder}"`);
  }

  return {
    photoSrc: `${base}/${name}.jpeg`,
    videoSrc: `${base}/${name}.MOV`,
  };
}
