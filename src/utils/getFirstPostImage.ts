import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import type { CollectionEntry } from "astro:content";

function getPostBody(post: CollectionEntry<"blog">) {
  if (post.body) return post.body;

  const filePath = post.filePath;
  if (!filePath) return "";

  const content = readFileSync(join(process.cwd(), filePath), "utf-8");
  return content.replace(/^---[\s\S]*?---\r?\n/, "");
}

function resolveImagePath(src: string) {
  const normalized = src.trim().replace(/^['"]|['"]$/g, "");

  if (normalized.startsWith("@/")) {
    return join(process.cwd(), "src", normalized.slice(2));
  }

  if (normalized.startsWith("/")) {
    return join(process.cwd(), "public", normalized.slice(1));
  }

  return null;
}

export function extractFirstImageSrc(post: CollectionEntry<"blog">) {
  const body = getPostBody(post);
  const candidates: { index: number; src: string }[] = [];

  const imgTagRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match: RegExpExecArray | null;

  while ((match = imgTagRegex.exec(body)) !== null) {
    candidates.push({ index: match.index, src: match[1] });
  }

  const mdImgRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
  while ((match = mdImgRegex.exec(body)) !== null) {
    candidates.push({ index: match.index, src: match[1] });
  }

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => a.index - b.index);
  return candidates[0].src;
}

export async function getFirstPostImageDataUri(post: CollectionEntry<"blog">) {
  const src = extractFirstImageSrc(post);
  if (!src) return null;

  const absPath = resolveImagePath(src);
  if (!absPath || !existsSync(absPath)) return null;

  try {
    const buffer = await sharp(absPath)
      .rotate()
      .resize(1200, 630, { fit: "cover", position: "center" })
      .jpeg({ quality: 82 })
      .toBuffer();

    return `data:image/jpeg;base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}
