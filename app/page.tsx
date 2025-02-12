"use client";

import React, { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleShorten = async () => {
    if (!url) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, customSlug: customSlug || null }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setShortUrl(data.shortUrl);
      }
    } catch (err) {
      setError("Erro ao encurtar URL");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          🔗 Encurtador de Links
        </h1>

        <input
          type="text"
          className="w-full p-3 border rounded-lg mb-4 shadow-sm focus:ring-2 focus:ring-blue-500"
          placeholder="Digite sua URL aqui..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <input
          type="text"
          className="w-full p-3 border rounded-lg mb-4 shadow-sm focus:ring-2 focus:ring-blue-500"
          placeholder="Slug personalizado (opcional)"
          value={customSlug}
          onChange={(e) => setCustomSlug(e.target.value)}
        />

        <button
          onClick={handleShorten}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          disabled={loading || !url}
        >
          {loading ? "Encurtando..." : "Encurtar URL"}
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {shortUrl && (
          <div className="mt-6 p-4 bg-gray-200 rounded-lg text-center shadow-md">
            <span className="text-gray-700 font-medium">URL Curta:</span>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 ml-2 font-bold break-words"
            >
              {shortUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
