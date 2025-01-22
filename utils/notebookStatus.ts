import { db } from "@/utils/db"
import { Usuarios, Notebooks, AtribuirNote, NotebookStatus, Historico } from "@/utils/schema"
import { eq } from 'drizzle-orm';

export async function checkNotebookStatus(idcracha: string, serialNumber: string) {
  // 1. Verifique se o usuário existe
  const usuario = await db.select().from(Usuarios).where(eq(Usuarios.idcracha, idcracha)).limit(1)
  if (usuario.length === 0) {
    throw new Error('Usuário não encontrado!')
  }

  // 2. Verifique se o notebook existe
  const notebook = await db.select().from(Notebooks).where(eq(Notebooks.serialNumber, serialNumber)).limit(1)
  if (notebook.length === 0) {
    throw new Error('Notebook não encontrado!')
  }

  // 3. Verifique se o notebook está atribuído ao usuário correto
  const atribuicao = await db.select().from(AtribuirNote)
    .where(eq(AtribuirNote.notebook, serialNumber))
    .limit(1)

  if (atribuicao.length === 0) {
    throw new Error('Este notebook não está atribuído a nenhum usuário!')
  }

  const usuarioAtribuido = atribuicao[0].nomet1 === usuario[0].nome ||
                           atribuicao[0].nomet2 === usuario[0].nome ||
                           atribuicao[0].nomet3 === usuario[0].nome

  if (!usuarioAtribuido) {
    throw new Error('Este notebook não está atribuído a este usuário!')
  }

  // 4. Verifique o status atual do notebook
  let status = await db.select().from(NotebookStatus)
    .where(eq(NotebookStatus.notebookId, notebook[0].serialNumber))
    .limit(1)

  if (status.length === 0) {
    // Se não existir um status, crie um
    await db.insert(NotebookStatus).values({
      notebookId: notebook[0].serialNumber,  // notebookId é obrigatório
      isCheckedOut: false,  // isCheckedOut é passado corretamente
      userId: null,  // Como o notebook não está "checked out", o userId pode ser nulo
      lastUpdated: new Date()  // Defina o lastUpdated com a data atual
    })
    status = [{
      isCheckedOut: false, notebookId: notebook[0].serialNumber, userId: null, lastUpdated: new Date(),
      id: 0
    }]
  }

  return {
    usuario: usuario[0],
    notebook: notebook[0],
    isCheckedOut: status[0].isCheckedOut
  }
}

export async function updateNotebookStatus(usuario: string, notebook: string, isCheckedOut: boolean) {
  // Atualiza o status do notebook
  await db.update(NotebookStatus)
    .set({ 
      isCheckedOut: isCheckedOut, 
      userId: isCheckedOut ? usuario : null,  // Se estiver "checked out", atribua o usuario, senão null
      lastUpdated: new Date()  // Sempre atualize o campo lastUpdated
    })
    .where(eq(NotebookStatus.notebookId, notebook))

  // Registra a ação no histórico
  await db.insert(Historico).values({
    usuarios: usuario,
    notebook: notebook,
    tipo: isCheckedOut ? 'Retirada' : 'Devolução',
    createdAt: new Date(),
  })
}