import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/utils/db"
import { Usuarios } from "@/utils/schema"
import { eq } from "drizzle-orm"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)  // A tipagem de params já está correta aqui
  const body = await request.json()

  try {
    await db.update(Usuarios).set(body).where(eq(Usuarios.id, id)).execute()

    return NextResponse.json({ message: "User updated successfully" })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  try {
    await db.delete(Usuarios).where(eq(Usuarios.id, id)).execute()

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}