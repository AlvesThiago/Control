import { NextResponse } from "next/server";
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

export async function PUT(req: Request) {
  const body = await req.json();

  const { id, nome, idcracha, cpf, setor, gestor, turno } = body;

  // Validação básica
  if (!id || !nome || !idcracha || !cpf || !setor || !gestor || !turno) {
    return NextResponse.json(
      { error: "Todos os campos são obrigatórios." },
      { status: 400 }
    );
  }

  try {
    await db.update(Usuarios).set(body).where(eq(Usuarios.id, id)).execute();

    return NextResponse.json({ message: "Usuário atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar o usuário:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "O campo 'id' é obrigatório." },
      { status: 400 }
    );
  }

  try {
    await db.delete(Usuarios).where(eq(Usuarios.id, id)).execute();

    return NextResponse.json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar o usuário:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
