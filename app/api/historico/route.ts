import { db } from "@/utils/db"
import { Historico } from "@/utils/schema"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await db
      .select({
        id: Historico.id,
        usuarios: Historico.usuarios,
        notebook: Historico.notebook,
        tipo: Historico.tipo,
        createAt: Historico.createdAt,
      })
      .from(Historico)
      .execute()

    const data = result.map((item) => ({
      nome: item.usuarios || null,
      setor: item.notebook || null,
      acao: item.tipo || null,
      data: item.createAt || null,
    }))

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao buscar dados do histórico:", error)
    return NextResponse.json({ error: "Erro ao buscar dados do histórico" }, { status: 500 })
  }
}

