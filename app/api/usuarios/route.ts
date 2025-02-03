import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { Usuarios } from "@/utils/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { nome, idcracha, cpf, setor, gestor, turno } = await req.json();

    // Validação básica
    if (!nome || !idcracha || !cpf || !setor || !gestor || !turno) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    await db.insert(Usuarios).values({
      nome,
      idcracha,
      cpf,
      setor,
      gestor,
      turno,
    });

    return NextResponse.json(
      { message: "Usuário cadastrado com sucesso!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao registrar o usuário:", error);
    return NextResponse.json(
      { error: "Falha ao registrar usuário." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await db
      .select({
        id: Usuarios.id,
        nome: Usuarios.nome,
        cpf: Usuarios.cpf,
        setor: Usuarios.setor,
        gestor: Usuarios.gestor,
      })
      .from(Usuarios)
      .execute();

    const data = result.map((item) => ({
      id: item.id,
      name: item.nome,
      cpf: item.cpf,
      sector: item.setor,
      gestor: item.gestor,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
