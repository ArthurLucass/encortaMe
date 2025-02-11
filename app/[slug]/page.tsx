"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function AdRedirectPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [originalUrl, setOriginalUrl] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (!slug) {
      setError("Slug não fornecido");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/redirect?slug=${slug}`);
        const data = await response.json();

        if (data?.originalUrl) {
          setOriginalUrl(data.originalUrl);
          setCategory(data.category || "general");
        } else {
          setError("Link não encontrado.");
        }
      } catch (error) {
        setError("Erro ao redirecionar.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  useEffect(() => {
    if (originalUrl) {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [originalUrl]);

  // 🔥 Escolher anúncio baseado na categoria, com fallback para AdSense
  const renderAd = () => {
    switch (category) {
      case "video":
        return (
          <a
            href="SEU_LINK_AFILIADO_YOUTUBE"
            target="_blank"
            rel="noopener noreferrer"
          >
            🎬 Assine o YouTube Premium e veja vídeos sem anúncios!
          </a>
        );
      case "ecommerce":
        return (
          <a
            href="SEU_LINK_AFILIADO_SHOPEE"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="https://cf.shopee.com.br/file/abfa3c3a9c323f7c1f6a7c25ed4732dd"
              alt="Promoção Shopee"
              className="w-full rounded-lg"
            />
          </a>
        );
      case "news":
        return (
          <a
            href="SEU_LINK_AFILIADO_NOTICIAS"
            target="_blank"
            rel="noopener noreferrer"
          >
            📰 Leia as últimas notícias com desconto especial!
          </a>
        );
      case "gaming":
        return (
          <a
            href="SEU_LINK_AFILIADO_GAMES"
            target="_blank"
            rel="noopener noreferrer"
          >
            🎮 Oferta especial para gamers! Jogos em promoção.
          </a>
        );
      default:
        return (
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="SEU_ADSENSE_CLIENTE_ID"
            data-ad-slot="SEU_SLOT_ADSENSE"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      {loading ? (
        <p className="text-lg text-gray-700">🔄 Carregando...</p>
      ) : error ? (
        <p className="text-lg text-red-500">{error}</p>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-blue-600 mb-4">
            🔗 Aguarde {countdown}s
          </h1>
          <p className="text-gray-700 mb-6">
            Você será redirecionado para o link em alguns segundos.
          </p>
          <div className="bg-white p-4 shadow-md rounded-lg w-full max-w-md text-center mb-6">
            {renderAd()}
          </div>
          {countdown === 0 && (
            <button
              onClick={() => router.replace(originalUrl)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition"
            >
              Ir para o Site
            </button>
          )}
        </>
      )}
    </div>
  );
}
