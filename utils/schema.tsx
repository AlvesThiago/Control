
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const Usuarios = pgTable('usuarios', {
    id: serial('id').primaryKey(),
    nome: varchar('nome', { length: 255 }).notNull(),
    idcracha: varchar('idcracha', { length: 14 }).notNull().unique(),
    cpf: varchar('cpf', { length: 14 }).notNull().unique(),
    setor: varchar('setor', { length: 100 }).notNull(),
    gestor: varchar('gestor', { length: 255 }).notNull(),
    turno: varchar('turno', {length: 55}).notNull()
});

export const Notebooks=pgTable('notebooks',{
    id: serial('id').primaryKey(),
    serialNumber: varchar('serialNumber', { length: 255 }).notNull().unique(),
    modelo: varchar('modelo'),
    setorNote: varchar('setorNote').notNull()  
})

export const Historico=pgTable('historico',{
    id: serial('id').primaryKey(),
    usuarios: varchar('usuarios', { length: 255 }),
    notebook: varchar('notebook', { length: 255 }),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const AtribuirNote = pgTable('atribuir', {
    id: serial('id').primaryKey(),
    nomet1: varchar('nomet1'),
    nomet2: varchar('nomet2'),
    nomet3: varchar('nomet3'),
    notebook: varchar('notebook').notNull()
})