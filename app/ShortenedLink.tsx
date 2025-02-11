'use client'
import React, { useEffect, useState } from "react";

function ShortenedLink({ shortUrl }: { shortUrl: string }) {
  const [clicks, setClicks] = useState<number | null>(null);

  useEffect(() => {
    if (!shortUrl) return;

    const slug = shortUrl.split("/").pop(); // 🔥 Extrai apenas o slug
    fetch(`/api/stats?slug=${slug}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => setClicks(data.clicks || 0))
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
        setClicks(0);
      });
  }, [shortUrl]);

  return (
    shortUrl && (
      <div className="mt-6 p-4 bg-gray-200 rounded-lg text-center shadow-md w-full text-lg">
        <span className="text-gray-700 font-medium">URL Curta:</span>
        <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold break-words block mt-2">
          {shortUrl}
        </a>
        {clicks !== null && (
          <p className="text-gray-600 text-sm mt-2">👀 {clicks} cliques</p>
        )}
      </div>
    )
  );
}

export default ShortenedLink;
