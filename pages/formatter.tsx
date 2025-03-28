import { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useForm } from "@mantine/form";

const MarkdownTextarea = dynamic(
  () => import("../components/MarkdownTextarea"),
  {
    ssr: false,
  },
);

interface MessageItem {
  id: number;
  content: string;
  [key: string]: any;
}

interface HtmlEditorCardProps {
  message: MessageItem;
  index: number;
  onChange: (index: number, content: string) => void;
}

const HtmlEditorCard = ({ message, index, onChange }: HtmlEditorCardProps) => {
  const form = useForm({ initialValues: { content: message.content } });

  return (
    <div className="mb-4">
      <MarkdownTextarea
        value={form.values.content}
        onChange={(val) => {
          form.setFieldValue("content", val);
          onChange(index, val);
        }}
      />
    </div>
  );
};

export default function JsonFormatterPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);

  const handleFormatJson = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);

      if (Array.isArray(parsedJson.messages)) {
        setMessages(parsedJson.messages);
      } else {
        setMessages([]);
      }
      setError(null);
    } catch (err) {
      setMessages([]);
      setError("Neplatný JSON");
    }
  };

  const handleCopy = () => {
    const json = JSON.stringify({ messages }, null, 2);

    navigator.clipboard.writeText(json);
  };

  const handleContentChange = (index: number, newContent: string) => {
    const updated = [...messages];

    updated[index] = { ...updated[index], content: newContent };
    setMessages(updated);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <Head>
        <title>JSON Formatter</title>
        <meta
          content="Jednoduchý nástroj na formátování JSON."
          name="description"
        />
      </Head>
      <h1 className="text-2xl font-bold mb-4">JSON Formatter</h1>
      <textarea
        className="w-full max-w-2xl h-40 p-2 border rounded"
        placeholder="Vlož JSON zde"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      />
      <div className="flex gap-4 mt-2">
        <button
          className="p-2 bg-blue-500 text-white rounded"
          onClick={handleFormatJson}
        >
          Načíst zprávy
        </button>
        {messages.length > 0 && (
          <button
            className="p-2 bg-green-500 text-white rounded"
            onClick={handleCopy}
          >
            Zkopírovat JSON do schránky
          </button>
        )}
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="mt-4 grid gap-4 w-full max-w-2xl">
        {messages.map((msg, index) => (
          <HtmlEditorCard
            key={msg.id || index}
            index={index}
            message={msg}
            onChange={handleContentChange}
          />
        ))}
      </div>
    </div>
  );
}
