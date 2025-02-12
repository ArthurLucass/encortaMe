import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Slug não fornecido" },
        { status: 400 }
      );
    }

    const link = await prisma.link.findUnique({
      where: { shortUrl: slug },
    });

    if (!link) {
      return NextResponse.json(
        { error: "Link não encontrado" },
        { status: 404 }
      );
    }

    // 🔥 Incrementa o contador de cliques
    await prisma.link.update({
      where: { shortUrl: slug },
      data: { clicks: { increment: 1 } },
    });
    return NextResponse.json({ originalUrl: link.originalUrl });
  } catch (error) {
    console.error("Erro ao buscar o link:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
