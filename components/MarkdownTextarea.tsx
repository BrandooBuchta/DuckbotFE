import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { FC, useState } from "react";
import { Text } from "@mantine/core";
import HardBreak from "@tiptap/extension-hard-break";

interface MarkdownTextareaProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  label?: string;
  subLabel?: string;
}

const MarkdownTextarea: FC<MarkdownTextareaProps> = ({
  value,
  onChange,
  className,
  label,
  subLabel,
}) => {
  const [content, setContent] = useState<string>("")

  const editor = useEditor({
    extensions: [
      StarterKit,
      HardBreak,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      let htmlContent = editor.getHTML();

      htmlContent = htmlContent.replace(/<p>/g, "").replace(/<\/p>/g, "<br>");

      htmlContent = htmlContent.replace(/<br>$/g, "");

      onChange(htmlContent);
      setContent(htmlContent)
    },
  });

  return (
    <div className={`${className}`}>
      {label && <Text className="text-sm">{label}</Text>}
      {subLabel && (
        <Text className="text-xs text-pink-500 mb-1">{subLabel}</Text>
      )}
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.ClearFormatting />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Undo />
            <RichTextEditor.Redo />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>
      {/* <p>{JSON.stringify({ content })}</p> */}
    </div>
  );
};

export default MarkdownTextarea;
