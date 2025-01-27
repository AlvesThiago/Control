import { db } from "@/utils/db"
import { Usuarios, Notebooks, AtribuirNote, NotebookStatus, Historico, Gestores } from "@/utils/schema"
import { eq } from "drizzle-orm"

async function isManager(idcracha: string): Promise<boolean> {
  const gestor = await db.select().from(Gestores).where(eq(Gestores.cracha, idcracha)).limit(1)
  return gestor.length > 0
}

async function getManagerSector(idcracha: string): Promise<string | null> {
  const gestor = await db.select().from(Gestores).where(eq(Gestores.cracha, idcracha)).limit(1)
  return gestor.length > 0 ? gestor[0].setorGestor : null
}

export async function checkNotebookStatus(idcracha: string, serialNumber: string) {
  // 1. Verifique se o usuário é um gestor
  const isUserManager = await isManager(idcracha)
  const managerSector = isUserManager ? await getManagerSector(idcracha) : null

  // 2. Verifique se o notebook existe
  const notebook = await db.select().from(Notebooks).where(eq(Notebooks.serialNumber, serialNumber)).limit(1)
  if (notebook.length === 0) {
    throw new Error("Notebook não encontrado!")
  }

  let usuario

  if (isUserManager) {
    // Se for um gestor, verifique se o setor do gestor corresponde ao setor do notebook
    if (notebook[0].setorNote !== managerSector) {
      throw new Error("Este notebook não pertence ao seu setor!")
    }
    // Busque as informações do gestor
    const gestor = await db.select().from(Gestores).where(eq(Gestores.cracha, idcracha)).limit(1)
    if (gestor.length === 0) {
      throw new Error("Gestor não encontrado!")
    }
    usuario = { nome: gestor[0].gestor, idcracha: gestor[0].cracha }
  } else {
    // Se não for um gestor, verifique se o usuário existe
    const usuarioResult = await db.select().from(Usuarios).where(eq(Usuarios.idcracha, idcracha)).limit(1)
    if (usuarioResult.length === 0) {
      throw new Error("Usuário não encontrado!")
    }
    usuario = usuarioResult[0]

    // Verifique se o notebook está atribuído ao usuário correto
    const atribuicao = await db.select().from(AtribuirNote).where(eq(AtribuirNote.notebook, serialNumber)).limit(1)

    if (atribuicao.length === 0) {
      throw new Error("Este notebook não está atribuído a nenhum usuário!")
    }

    const usuarioAtribuido =
      atribuicao[0].nomet1 === usuario.nome ||
      atribuicao[0].nomet2 === usuario.nome ||
      atribuicao[0].nomet3 === usuario.nome ||
      atribuicao[0].nomet4 === usuario.nome ||
      atribuicao[0].nomet5 === usuario.nome ||
      atribuicao[0].nomet6 === usuario.nome

    if (!usuarioAtribuido) {
      throw new Error("Este notebook não está atribuído a este usuário!")
    }
  }

  // 4. Verifique o status atual do notebook
  let status = await db
    .select()
    .from(NotebookStatus)
    .where(eq(NotebookStatus.notebookId, notebook[0].serialNumber))
    .limit(1)

  if (status.length === 0) {
    // Se não existir um status, crie um
    await db.insert(NotebookStatus).values({
      notebookId: notebook[0].serialNumber,
      isCheckedOut: false,
      userId: null,
      lastUpdated: new Date(),
    })
    status = [
      {
        isCheckedOut: false,
        notebookId: notebook[0].serialNumber,
        userId: null,
        lastUpdated: new Date(),
        id: 0,
      },
    ]
  }

  return {
    usuario,
    notebook: notebook[0],
    isCheckedOut: status[0].isCheckedOut,
    isManager: isUserManager,
  }
}

export async function updateNotebookStatus(usuario: string, notebook: string, isCheckedOut: boolean) {
  // Atualiza o status do notebook
  await db
    .update(NotebookStatus)
    .set({
      isCheckedOut: isCheckedOut,
      userId: isCheckedOut ? usuario : null,
      lastUpdated: new Date(),
    })
    .where(eq(NotebookStatus.notebookId, notebook))

  // Registra a ação no histórico
  await db.insert(Historico).values({
    usuarios: usuario,
    notebook: notebook,
    tipo: isCheckedOut ? "Retirada" : "Devolução",
    createdAt: new Date(),
  })
}

