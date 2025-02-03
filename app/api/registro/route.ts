import { type NextRequest, NextResponse } from "next/server"
import { checkNotebookStatus, updateNotebookStatus } from "@/utils/notebookStatus"

export async function POST(request: NextRequest) {
  try {
    const { action, idcracha, serialNumber } = await request.json()

    if (action === "check") {
      const result = await checkNotebookStatus(idcracha, serialNumber)
      return NextResponse.json(result)
    } else if (action === "update") {
      const { usuario, notebook, isCheckedOut } = await checkNotebookStatus(idcracha, serialNumber)
      await updateNotebookStatus(usuario.nome, notebook.serialNumber, !isCheckedOut)
      return NextResponse.json({ success: true, message: "Status atualizado com sucesso" })
    } else {
      return NextResponse.json({ error: "Ação inválida" }, { status: 400 })
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Ocorreu um erro ao processar a ação." }, { status: 500 })
  }
}

