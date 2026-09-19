import type { PortableTextBlock } from "./types";

export const portableTextPlain = (block: PortableTextBlock): string =>
  block.children.map((child) => child.text).join("");
