import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm"
import { Gestores } from "@/utils/schema";

export async function POST(req: Request) {
    try {
        const { gestor, setorGestor, cracha } = await req.json();

        if (!gestor || !setorGestor || !cracha) {
            return NextResponse.json({ message: "Todos os campos são obrigatórios" }, { status: 400 });
        }

        await db.insert(Gestores).values({
            gestor,
            setorGestor,
            cracha,
        });

        return NextResponse.json({ message: "Gestor cadastrado com sucesso!" }, { status: 201 });
    } catch (error) {
        console.error("Erro ao cadastrar gestor:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}


export async function GET() {
    try {
      const result = await db
        .select({
          id: Gestores.id,
          gestor: Gestores.gestor,
          setorGestor: Gestores.setorGestor,
        })
        .from(Gestores)
        .execute()
  
      return NextResponse.json(result)
    } catch (error) {
      console.error("Error fetching gestores:", error)
      return NextResponse.json({ error: "Failed to fetch gestores" }, { status: 500 })
    }
  }
  
  export async function PUT(request: Request) {
    try {
      const { id, setorGestor } = await request.json()
      await db.update(Gestores).set({ setorGestor }).where(eq(Gestores.id, id)).execute()
      return NextResponse.json({ message: "Gestor updated successfully" })
    } catch (error) {
      console.error("Error updating gestor:", error)
      return NextResponse.json({ error: "Failed to update gestor" }, { status: 500 })
    }
  }
  
  export async function DELETE(request: Request) {
    try {
      const { id } = await request.json()
      await db.delete(Gestores).where(eq(Gestores.id, id)).execute()
      return NextResponse.json({ message: "Gestor deleted successfully" })
    } catch (error) {
      console.error("Error deleting gestor:", error)
      return NextResponse.json({ error: "Failed to delete gestor" }, { status: 500 })
    }
  }