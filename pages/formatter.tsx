import { useState } from "react";
import Head from "next/head";
import parse from "html-react-parser";

export default function JsonFormatterPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [htmlMessages, setHtmlMessages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFormatJson = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);

      if (Array.isArray(parsedJson.messages)) {
        const extractedHtml = parsedJson.messages.map((msg: { content: string }) => msg.content || "");

        setHtmlMessages(extractedHtml);
      } else {
        setHtmlMessages([]);
      }
      setError(null);
    } catch (err) {
      setHtmlMessages([]);
      setError("Neplatný JSON");
    }
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
      <button
        className="mt-2 p-2 bg-blue-500 text-white rounded"
        onClick={handleFormatJson}
      >
        Zobrazit HTML zprávy
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="mt-4 grid gap-4 w-full max-w-2xl">
        {htmlMessages.map((html, index) => (
          <div key={index} className="p-4 bg-white border rounded shadow">
            {parse(html)}
          </div>
        ))}
      </div>
    </div>
  );
}
