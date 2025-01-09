
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const Usuarios=pgTable('usuarios',{
    id: serial('id').primaryKey(),
    nome: varchar('nome', { length: 255 }).notNull(),   
    cpf: varchar('cpf', { length: 14 }).notNull().unique(),  
    setor: varchar('setor', { length: 100 }).notNull(),    
    gestor: varchar('gestor', { length: 255 }),
})