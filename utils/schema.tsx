
import { pgTable, serial, timestamp, varchar, boolean } from "drizzle-orm/pg-core";

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
    setorNote: varchar('setorNote').notNull(),
    statusNote: varchar('statusNote').notNull(),
})

export const Historico=pgTable('historico',{
    id: serial('id').primaryKey(),
    usuarios: varchar('usuarios', { length: 255 }),
    notebook: varchar('notebook', { length: 255 }),
    tipo: varchar('tipo'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const AtribuirNote = pgTable('atribuir', {
    id: serial('id').primaryKey(),
    nomet1: varchar('nomet1'),
    nomet2: varchar('nomet2'),
    nomet3: varchar('nomet3'),
    nomet4: varchar('nomet4'),
    nomet5: varchar('nomet5'),
    nomet6: varchar('nomet6'),
    notebook: varchar('notebook').notNull()
})

export const NotebookStatus = pgTable('notebook_status', {
    id: serial('id').primaryKey(),
    notebookId: varchar('notebook_id', { length: 255 }).notNull().unique(),
    userId: varchar('user_id', { length: 255 }),
    isCheckedOut: boolean('is_checked_out').notNull().default(false),
    lastUpdated: timestamp('last_updated').defaultNow().notNull(),
});

export const Gestores = pgTable('gestores',{
    id: serial('id').primaryKey(),
    gestor: varchar('gestor').notNull(),
    setorGestor: varchar('setor_gestor').notNull(),
    cracha: varchar('cracha').notNull()
})