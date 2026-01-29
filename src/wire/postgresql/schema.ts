import { pgTable, text, integer, primaryKey, serial } from "drizzle-orm/pg-core";

// Tabela de sons
export const soundsTable = pgTable("sounds", {
  id: text().primaryKey(), // UUID
  name: text().notNull(),
  url: text().notNull(),
  playCount: integer().notNull().default(0),
  createdAt: integer().notNull(), // timestamp Unix
});

// Tabela de categorias
export const categoriesTable = pgTable("categories", {
  id: text().primaryKey(), // UUID
  label: text().notNull().unique(),
});

// Tabela intermediária para relacionamento N:N entre sons e categorias
export const soundsToCategoriesTable = pgTable(
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

// Tabela de salas
export const roomsTable = pgTable("rooms", {
  id: text().primaryKey(), // UUID
  name: text().notNull(),
  createdAt: integer().notNull(), // timestamp Unix
});
