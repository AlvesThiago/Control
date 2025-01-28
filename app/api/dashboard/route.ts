import { NextResponse } from "next/server";
import { db } from '@/utils/db'
import { Notebooks } from "@/utils/schema"; // Importa a tabela do Drizzle
import { eq, ne } from "drizzle-orm";

export async function GET() {
  try {
    // Total de equipamentos
    const totalEquipamentos = await db.select().from(Notebooks);
    
    // Equipamentos em uso (setor diferente de "Estoque")
    const equipamentosEmUso = await db
      .select()
      .from(Notebooks)
      .where(ne(Notebooks.setorNote, "Estoque"));

    // Equipamentos em estoque (setor igual a "Estoque")
    const equipamentosEmEstoque = await db
      .select()
      .from(Notebooks)
      .where(eq(Notebooks.setorNote, "Estoque"));

    return NextResponse.json({
      totalEquipamentos: totalEquipamentos.length,
      equipamentosEmUso: equipamentosEmUso.length,
      equipamentosEmEstoque: equipamentosEmEstoque.length,
    });
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return NextResponse.json({ error: "Erro ao buscar os dados" }, { status: 500 });
  }
}
