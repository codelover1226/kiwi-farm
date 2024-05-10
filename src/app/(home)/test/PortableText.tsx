import React from "react";
import BlockContent, { BlockContentProps } from "@sanity/block-content-to-react";

interface PortableTextProps {
  blocks: any[]; // Adjust the type of blocks according to your data structure
}

const serializers = {
  types: {
    block: (props: any) => {
      const { node, children } = props;
      const customBlocks: Record<string, JSX.Element> = {
        blockquote: <blockquote>— {children}</blockquote>
      };

      return (
        customBlocks[node.style] ||
        BlockContent.defaultSerializers.types.block(props)
      );
    }
  },
  marks: {
    em: ({ children }: { children: React.ReactNode }) => (
      <em style={{ color: "blue" }}>{children}</em>
    ),
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong style={{ fontSize: "1.2em" }}>{children}</strong>
    ),
    code: ({ children }: { children: React.ReactNode }) => (
      <code style={{ fontFamily: "SF Mono, monospace" }}>{children}</code>
    )
  }
};

const PortableText: React.FC<PortableTextProps> = (props) => {
  return (
    <>
      <h2>PortableText to React</h2>
      <BlockContent serializers={serializers} {...props} />
      <details>
        <summary>PortableText Doc</summary>
        <pre>{JSON.stringify(props.blocks, null, 2)}</pre>
      </details>
    </>
  );
};

export default PortableText;
