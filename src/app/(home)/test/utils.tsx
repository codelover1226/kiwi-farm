import { Node } from "slate";

interface Span {
  bold?: boolean;
  code?: boolean;
  italic?: boolean;
  text: string;
}
interface CustomNode {
    type: string;
    children: Span[];
    url?: string;
  }
interface NodeWithType extends CustomNode {
  type: string;
  children: Span[];
  url?: string;
}
interface PortableTextBlock {
  _type: string;
  markDefs: { _key: string; _type: string; href?: string }[];
  style?: string;
  listItem?: string;
  children: {
    _type: string;
    text: string;
    marks?: string[];
  }[];
}

export function toPortableText(nodes: Node[]): PortableTextBlock[] {
  function findMarkDefs(node: NodeWithType): { _key: string; _type: string; href?: string }[] {
    if (node.type === "link" && node.url) {
      return [
        {
          _key: "ddd",
          _type: "link",
          href: node.url
        }
      ];
    }
    return [];
  }

  function findMark(span: Span): string[] | undefined {
    const marks: string[] = [];
    if (span.bold) {
      marks.push("strong");
    }
    if (span.code) {
      marks.push("code");
    }
    if (span.italic) {
      marks.push("em");
    }
    return marks.length ? marks : undefined;
  }

  return nodes
    .map((node: NodeWithType) => ({
      _type: "block",
      markDefs: findMarkDefs(node),
      ...(node.type === "block-quote" && { style: "blockquote" }),
      ...(node.type === "numbered-list" && { listItem: "number" }),
      ...(node.type === "bulleted-list" && { listItem: "bullet" }),
      children: node.children.map((span: Span) => ({
        _type: "span",
        text: span.text,
        marks: findMark(span)
      }))
    }))
    .filter((block: PortableTextBlock | false): block is PortableTextBlock => !!block);
}
