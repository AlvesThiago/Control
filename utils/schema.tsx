
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const Usuarios=pgTable('usuarios',{
    id: serial('id').primaryKey(),
    nome: varchar('nome', { length: 255 }).notNull(),   
    cpf: varchar('cpf', { length: 14 }).notNull().unique(),  
    setor: varchar('setor', { length: 100 }).notNull(),    
    gestor: varchar('gestor', { length: 255 }),
})

export const Notebooks=pgTable('notebooks',{
    id: serial('id').primaryKey(),
    serialNumber: varchar('serialNumber', { length: 255 }).notNull().unique(),
    modelo: varchar('modelo')  
})

export const Historico=pgTable('historico',{
    id: serial('id').primaryKey(),
    usuarios: varchar('usuarios', { length: 255 }),
    notebook: varchar('notebook', { length: 255 }),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
})