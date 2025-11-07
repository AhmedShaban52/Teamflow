import Starterkit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { all, createLowlight } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Placeholder } from "@tiptap/extensions/placeholder";

// create a lowlight instance with all languages loaded
const lowlight = createLowlight(all);

export const baseExtensions = [
  Starterkit.configure({
    codeBlock: false,
    
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  CodeBlockLowlight.configure({
    lowlight,
  }),
];

export const editorExtensions = [
  ...baseExtensions,
  Placeholder.configure({
    placeholder: "Type your Message",
  }),
];
