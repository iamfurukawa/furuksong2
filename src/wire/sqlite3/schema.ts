import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";

// Tabela de sons
export const soundsTable = sqliteTable("sounds", {
  id: text().primaryKey(), // UUID
  name: text().notNull(),
  url: text().notNull(),
  playCount: integer().notNull().default(0),
  createdAt: integer().notNull(), // timestamp Unix
});

// Tabela de categorias
export const categoriesTable = sqliteTable("categories", {
  id: text().primaryKey(), // UUID
  label: text().notNull().unique(),
});

// Tabela intermediária para relacionamento N:N entre sons e categorias
export const soundsToCategoriesTable = sqliteTable(
  "sounds_to_categories",
  {
    soundId: text()
      .notNull()
      .references(() => soundsTable.id, { onDelete: "cascade" }),
    categoryId: text()
      .notNull()
      .references(() => categoriesTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.soundId, table.categoryId] }),
  ]
);

// Tabela de versão (controle de versão do schema)
export const versionTable = sqliteTable("version", {
  id: integer().primaryKey(), // ID numérico incrementável
});

// Tabela de salas
export const roomsTable = sqliteTable("rooms", {
  id: text().primaryKey(), // UUID
  name: text().notNull(),
  createdAt: integer().notNull(), // timestamp Unix
});