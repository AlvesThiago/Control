import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { AtribuirNote, Notebooks, Usuarios } from "@/utils/schema";
import { eq } from "drizzle-orm";

// Buscar atribuições
export async function GET() {
  try {
    const result = await db.select().from(AtribuirNote).execute();

    const fetchedAssignments = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result.map(async (assignment: any) => {
        const notebookSetorResult = await db
          .select()
          .from(Notebooks)
          .where(eq(Notebooks.serialNumber, assignment.notebook))
          .execute();
        
        const notebookSetor = notebookSetorResult[0]?.setorNote || "Desconhecido";

        return {
          id: assignment.id,
          notebook: assignment.notebook,
          users: [
            assignment.nomet1,
            assignment.nomet2,
            assignment.nomet3,
            assignment.nomet4,
            assignment.nomet5,
            assignment.nomet6,
          ].filter(Boolean),
          setor: notebookSetor,
        };
      })
    );

    return NextResponse.json(fetchedAssignments, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Erro ao carregar atribuições" }, { status: 500 });
  }
}

// Criar atribuição
export async function POST(req: Request) {
  try {
    const { notebook, users } = await req.json();

    // Validação
    const notebookExistente = await db.select().from(Notebooks).where(eq(Notebooks.serialNumber, notebook)).execute();
    if (notebookExistente.length === 0) {
      return NextResponse.json({ error: "Notebook não encontrado!" }, { status: 400 });
    }

    const notebookSetor = notebookExistente[0].setorNote?.trim().toLowerCase();
    if (!notebookSetor) {
      return NextResponse.json({ error: "O notebook não tem setor definido!" }, { status: 400 });
    }

    for (const nome of users) {
      const usuarioExistente = await db.select().from(Usuarios).where(eq(Usuarios.nome, nome)).execute();
      if (usuarioExistente.length === 0) {
        return NextResponse.json({ error: `Usuário ${nome} não encontrado!` }, { status: 400 });
      }

      const usuarioSetor = usuarioExistente[0].setor?.trim().toLowerCase();
      if (!usuarioSetor || usuarioSetor !== notebookSetor) {
        return NextResponse.json({ error: `Usuário ${nome} não pertence ao setor do notebook!` }, { status: 400 });
      }
    }

    const [nomet1, nomet2, nomet3, nomet4, nomet5, nomet6] = users;

    const atribuirResult = await db.insert(AtribuirNote)
      .values({
        notebook,
        nomet1: nomet1 || null,
        nomet2: nomet2 || null,
        nomet3: nomet3 || null,
        nomet4: nomet4 || null,
        nomet5: nomet5 || null,
        nomet6: nomet6 || null,
      })
      .returning({ id: AtribuirNote.id })
      .execute();

    return NextResponse.json({ message: "Atribuição realizada com sucesso!", id: atribuirResult[0].id }, { status: 201 });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar atribuição" }, { status: 500 });
  }
}

// Atualizar atribuição
export async function PUT(req: Request) {
  try {
    const { id, users } = await req.json();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedAssignment = await db.update(AtribuirNote)
      .set({
        nomet1: users[0] || null,
        nomet2: users[1] || null,
        nomet3: users[2] || null,
        nomet4: users[3] || null,
        nomet5: users[4] || null,
        nomet6: users[5] || null,
      })
      .where(eq(AtribuirNote.id, id))
      .execute();

    return NextResponse.json({ message: "Atribuição atualizada com sucesso!" }, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar atribuição" }, { status: 500 });
  }
}

// Excluir atribuição
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await db.delete(AtribuirNote).where(eq(AtribuirNote.id, id)).execute();

    return NextResponse.json({ message: "Atribuição excluída com sucesso!" }, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir atribuição" }, { status: 500 });
  }
}
