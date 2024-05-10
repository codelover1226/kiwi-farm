// import React, { useCallback, useMemo, useState } from "react";
// import isUrl from "is-url";

// import isHotkey from "is-hotkey";
// import { Editable, withReact, useSlate, Slate } from "slate-react";
// import { Editor, Transforms, createEditor, Range } from "slate";
// import { withHistory } from "slate-history";
// import { Button, Icon, Toolbar } from "./components";
// import { toPortableText } from "./utils";
// import PortableText from "./PortableText";

// const HOTKEYS: Record<string, string> = {
//   "mod+b": "bold",
//   "mod+i": "italic",
//   "mod+u": "underline",
//   "mod+`": "code"
// };

// const LIST_TYPES = ["numbered-list", "bulleted-list"];

// export const PTEditor: React.FC = () => {
//   const [value, setValue] = useState<any>(initialValue);
//   const renderElement = useCallback(props => <Element {...props} />, []);
//   const renderLeaf = useCallback(props => <Leaf {...props} />, []);
//   const editor = useMemo(
//     () => withLinks(withHistory(withReact(createEditor()))),
//     []
//   );

//   return (
//     <>
//       <Slate editor={editor} value={value} onChange={value => setValue(value)}>
//         <Toolbar>
//           <LinkButton />
//           <MarkButton format="bold" icon="format_bold" />
//           <MarkButton format="italic" icon="format_italic" />
//           <MarkButton format="underline" icon="format_underlined" />
//           <MarkButton format="code" icon="code" />
//           {/* <BlockButton format="heading-one" icon="looks_one" />
//           <BlockButton format="heading-two" icon="looks_two" /> */}
//           <BlockButton format="block-quote" icon="format_quote" />
//           <BlockButton format="numbered-list" icon="format_list_numbered" />
//           <BlockButton format="bulleted-list" icon="format_list_bulleted" />
//         </Toolbar>
//         <Editable
//           renderElement={renderElement}
//           renderLeaf={renderLeaf}
//           placeholder="Enter some rich text…"
//           autoFocus
//           onKeyDown={event => {
//             for (const hotkey in HOTKEYS) {
//               if (isHotkey(hotkey, event)) {
//                 event.preventDefault();
//                 const mark = HOTKEYS[hotkey];
//                 toggleMark(editor, mark);
//               }
//             }
//           }}
//         />
//       </Slate>
//       <PortableText blocks={toPortableText(value)} />
//       <details>
//         <summary>Slate Doc</summary>
//         <pre>{JSON.stringify(value, null, 2)}</pre>
//       </details>
//     </>
//   );
// };

// const withLinks = (editor: any) => {
//   const { insertData, insertText, isInline } = editor;

//   editor.isInline = (element: any) => {
//     return element.type === "link" ? true : isInline(element);
//   };

//   editor.insertText = (text: string) => {
//     if (text && isUrl(text)) {
//       wrapLink(editor, text);
//     } else {
//       insertText(text);
//     }
//   };

//   editor.insertData = (data: any) => {
//     const text = data.getData("text/plain");

//     if (text && isUrl(text)) {
//       wrapLink(editor, text);
//     } else {
//       insertData(data);
//     }
//   };

//   return editor;
// };

// const insertLink = (editor: any, url: string) => {
//   if (editor.selection) {
//     wrapLink(editor, url);
//   }
// };

// const LinkButton: React.FC = () => {
//   const editor = useSlate();
//   return (
//     <Button
//       active={isLinkActive(editor)}
//       onMouseDown={event => {
//         event.preventDefault();
//         const url = window.prompt("Enter the URL of the link:");
//         if (!url) return;
//         insertLink(editor, url);
//       }}
//     >
//       <Icon>link</Icon>
//     </Button>
//   );
// };

// const isLinkActive = (editor: any) => {
//   const [link] = Editor.nodes(editor, { match: n => n.type === "link" });
//   return !!link;
// };

// const unwrapLink = (editor: any) => {
//   Transforms.unwrapNodes(editor, { match: n => n.type === "link" });
// };

// const wrapLink = (editor: any, url: string) => {
//   if (isLinkActive(editor)) {
//     unwrapLink(editor);
//   }

//   const { selection } = editor;
//   const isCollapsed = selection && Range.isCollapsed(selection);
//   const link = {
//     type: "link",
//     url,
//     children: isCollapsed ? [{ text: url }] : []
//   };

//   if (isCollapsed) {
//     Transforms.insertNodes(editor, link);
//   } else {
//     Transforms.wrapNodes(editor, link, { split: true });
//     Transforms.collapse(editor, { edge: "end" });
//   }
// };

// const toggleBlock = (editor: any, format: string) => {
//   const isActive = isBlockActive(editor, format);
//   const isList = LIST_TYPES.includes(format);

//   Transforms.unwrapNodes(editor, {
//     match: n => LIST_TYPES.includes(n.type),
//     split: true
//   });

//   Transforms.setNodes(editor, {
//     type: isActive ? "paragraph" : isList ? "list-item" : format
//   });

//   if (!isActive && isList) {
//     const block = { type: format, children: [] };
//     Transforms.wrapNodes(editor, block);
//   }
// };

// const toggleMark = (editor: any, format: string) => {
//   const isActive = isMarkActive(editor, format);

//   if (isActive) {
//     Editor.removeMark(editor, format);
//   } else {
//     Editor.addMark(editor, format, true);
//   }
// };

// const isBlockActive = (editor: any, format: string) => {
//   const [match] = Editor.nodes(editor, {
//     match: n => n.type === format
//   });

//   return !!match;
// };

// const isMarkActive = (editor: any, format: string) => {
//   const marks = Editor.marks(editor);
//   return marks ? marks[format] === true : false;
// };

// const Element: React.FC<any> = ({ attributes, children, element }) => {
//   switch (element.type) {
//     case "block-quote":
//       return <blockquote {...attributes}>{children}</blockquote>;
//     case "bulleted-list":
//       return <ul {...attributes}>{children}</ul>;
//     case "heading-one":
//       return <h1 {...attributes}>{children}</h1>;
//     case "heading-two":
//       return <h2 {...attributes}>{children}</h2>;
//     case "list-item":
//       return <li {...attributes}>{children}</li>;
//     case "numbered-list":
//       return <ol {...attributes}>{children}</ol>;
//     case "link":
//       return (
//         <a {...attributes} href={element.url}>
//           {children}
//         </a>
//       );
//     default:
//       return <p {...attributes}>{children}</p>;
//   }
// };

// const Leaf: React.FC<any> = ({ attributes, children, leaf }) => {
//   if (leaf.bold) {
//     children = <strong>{children}</strong>;
//   }

//   if (leaf.code) {
//     children = <code>{children}</code>;
//   }

//   if (leaf.italic) {
//     children = <em>{children}</em>;
//   }

//   if (leaf.underline) {
//     children = <u>{children}</u>;
//   }

//   return <span {...attributes}>{children}</span>;
// };

// const BlockButton: React.FC<{ format: string; icon: string }> = ({
//   format,
//   icon
// }) => {
//   const editor = useSlate();
//   return (
//     <Button
//       active={isBlockActive(editor, format)}
//       onMouseDown={event => {
//         event.preventDefault();
//         toggleBlock(editor, format);
//       }}
//     >
//       <Icon>{icon}</Icon>
//     </Button>
//   );
// };

// const MarkButton: React.FC<{ format: string; icon: string }> = ({
//   format,
//   icon
// }) => {
//   const editor = useSlate();
//   return (
//     <Button
//       active={isMarkActive(editor, format)}
//       onMouseDown={event => {
//         event.preventDefault();
//         toggleMark(editor, format);
//       }}
//     >
//       <Icon>{icon}</Icon>
//     </Button>
//   );
// };

// const initialValue = [
//   {
//     type: "paragraph",
//     children: [
//       { text: "This is editable " },
//       { text: "rich", bold: true },
//       { text: " text, " },
//       { text: "much", italic: true },
//       { text: " better than a " },
//       { text: "<textarea>", code: true },
//       { text: "!" }
//     ]
//   },
//   {
//     type: "paragraph",
//     children: [
//       {
//         text:
//           "Since it's rich text, you can do things like turn a selection of text "
//       },
//       { text: "bold", bold: true },
//       {
//         text:
//           ", or add a semantically rendered block quote in the middle of the page, like this:"
//       }
//     ]
//   },
//   {
//     type: "block-quote",
//     children: [{ text: "A wise quote." }]
//   },
//   {
//     type: "paragraph",
//     children: [{ text: "Try it out for yourself!" }]
//   }
// ];
