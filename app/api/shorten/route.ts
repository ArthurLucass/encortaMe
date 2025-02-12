import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🔥 Função para detectar a categoria do link com base no domínio
const detectCategory = (url: string): string => {
  if (url.includes("youtube.com") || url.includes("vimeo.com")) return "video";
  if (url.includes("shopee") || url.includes("mercadolivre"))
    return "ecommerce";
  if (url.includes("news") || url.includes("cnn") || url.includes("bbc"))
    return "news";
  if (url.includes("game") || url.includes("twitch")) return "gaming";
  return "general"; // Categoria padrão
};

export async function POST(req: NextRequest) {
  try {
    const { url, customSlug } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL não fornecida" }, { status: 400 });
    }

    const slug = customSlug
      ? customSlug.trim().toLowerCase().replace(/\s+/g, "-")
      : Math.random().toString(36).substring(2, 8);

    const existing = await prisma.link.findUnique({
      where: { shortUrl: slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Slug já está em uso" },
        { status: 400 }
      );
    }

    const category = detectCategory(url); // 🔥 Detecta a categoria do link automaticamente

    const newLink = await prisma.link.create({
      data: {
        originalUrl: url,
        shortUrl: slug,
        category, // 🔥 Salva a categoria detectada no banco de dados
      },
    });

    return NextResponse.json({
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${newLink.shortUrl}`,
    });
  } catch (error) {
    console.error("Erro ao encurtar link:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
