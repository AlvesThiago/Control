import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { Notebooks } from "@/utils/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { serialNumber, modelo, setorNote, statusNote } = await req.json();

    if (!serialNumber || !modelo || !setorNote || !statusNote) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    await db.insert(Notebooks).values({
      serialNumber,
      modelo,
      setorNote,
      statusNote,
    });

    return NextResponse.json(
      { message: "Notebook cadastrado com sucesso!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao registrar o notebook:", error);
    return NextResponse.json(
      { error: "Erro ao cadastrar notebook." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const notebooks = await db
      .select({
        id: Notebooks.id,
        serialNumber: Notebooks.serialNumber,
        modelo: Notebooks.modelo,
        setorNote: Notebooks.setorNote,
        statusNote: Notebooks.statusNote,
      })
      .from(Notebooks)
      .execute()

    return NextResponse.json(notebooks)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao buscar notebooks" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updateData } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 })
    }

    await db.update(Notebooks).set(updateData).where(eq(Notebooks.id, id)).execute()

    return NextResponse.json({ message: "Notebook atualizado com sucesso" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao atualizar notebook" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 })
    }

    await db
      .delete(Notebooks)
      .where(eq(Notebooks.id, Number.parseInt(id)))
      .execute()

    return NextResponse.json({ message: "Notebook excluído com sucesso" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao excluir notebook" }, { status: 500 })
  }
}