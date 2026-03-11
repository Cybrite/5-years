"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy } from "lucide-react";
import { motion } from "framer-motion";

type ExplainMode = "kid" | "normal" | "genz";

type ModeOption = {
  value: ExplainMode;
  label: string;
};

const MODE_OPTIONS: ModeOption[] = [
  { value: "kid", label: "👶 Kid Mode" },
  { value: "normal", label: "🧠 Normal" },
  { value: "genz", label: "💀 Gen Z Chaos" },
  { value: "bhojpuri", label: "🐃 Bhojpuri Mode" },
];

const EXAMPLES = [
  "Blockchain",
  "Black Holes",
  "Quantum Physics",
  "Artificial Intelligence",
];

export default function Home() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<ExplainMode>("kid");

  const explain = async () => {
    const trimmedTopic = topic.trim();

    if (!trimmedTopic) return;

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: trimmedTopic, mode }),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();

      if (data.explanation) {
        setResult(data.explanation);
      } else {
        setResult("Error: " + (data.error ?? "Unknown error"));
      }
    } catch {
      setResult("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyText = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 py-16 flex flex-col items-center">
      <h1 className="text-4xl font-semibold tracking-tight mb-2">
        Explain it to me
      </h1>

      <p className="text-gray-500 mb-6">Complex topics explained simply.</p>

      <div className="flex gap-2 mb-8">
        {MODE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setMode(option.value)}
            className={`px-3 py-1 rounded-full border ${
              mode === option.value ? "bg-black text-white" : "border-gray-300"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="w-full max-w-2xl flex gap-3">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
        />

        <button
          onClick={explain}
          disabled={loading}
          className="bg-black text-white px-6 rounded-lg hover:opacity-90 disabled:opacity-40"
        >
          {loading ? "Thinking..." : "Explain"}
        </button>
      </div>

      <div className="flex gap-3 mt-6 flex-wrap justify-center">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => setTopic(ex)}
            className="text-sm border border-gray-300 px-3 py-1 rounded-full hover:bg-gray-100"
          >
            {ex}
          </button>
        ))}
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl mt-12 border border-gray-200 rounded-xl p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium">Explanation</h2>

            <button
              onClick={copyText}
              className="text-gray-500 hover:text-black flex items-center gap-1 text-sm"
            >
              <Copy size={16} />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="prose max-w-none">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </motion.div>
      )}
    </main>
  );
}
