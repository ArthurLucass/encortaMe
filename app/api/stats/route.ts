import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET(req: NextRequest) {
  const prisma = new PrismaClient();
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug não fornecido" }, { status: 400 });
    }

    const link = await prisma.link.findUnique({
      where: { shortUrl: slug },
      select: { clicks: true },
    });

    if (!link) {
      return NextResponse.json({ error: "Link não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ clicks: link.clicks });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
