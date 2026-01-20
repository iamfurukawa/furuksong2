import { drizzle } from 'drizzle-orm/libsql';
import { soundsTable, soundsToCategoriesTable, categoriesTable, versionTable, roomsTable } from "../wire/sqlite3/schema.js";
import { eq, inArray } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import type {
  SoundInsert,
  CategoryInsert,
} from '../models/db/sound.interface.js';
import type { Version } from '../models/db/version.interface.js';
import type { RoomInsert } from '../models/db/room.interface.js';
import type { VersionModel } from '../models/version.js';
import type { CategoryModel } from '../models/category.js';
import type { RoomModel } from '../models/room.js';
import type { SoundModel } from '../models/sound.js';
import VersionAdapter from '../adapters/version.adapter.js';
import CategoryAdapter from '../adapters/category.adapter.js';
import RoomAdapter from '../adapters/room.adapter.js';

const db = drizzle({ connection: { url: process.env.DB_FILE_NAME! } });

// ==================== SOUND + CATEGORIES ====================

/**
 * Escreve um novo som com suas categorias
 */
export async function writeSound(sound: SoundInsert): Promise<SoundModel> {
  const newSound = {
    id: sound.id,
    name: sound.name,
    url: sound.url,
    playCount: 0,
    createdAt: Date.now(),
  };

  // Inserir o som
  await db.insert(soundsTable).values(newSound);

  // Inserir relacionamentos com categorias
  let categories: { id: string; label: string }[] = [];
  if (sound.categories.length > 0) {
    const relations = sound.categories.map((categoryId) => ({
      soundId: newSound.id,
      categoryId,
    }));

    await db.insert(soundsToCategoriesTable).values(relations);

    // Buscar categorias associadas
    categories = await db
      .select({
        id: categoriesTable.id,
        label: categoriesTable.label,
      })
      .from(categoriesTable)
      .where(inArray(categoriesTable.id, sound.categories));
  }

  return {
    id: newSound.id,
    name: newSound.name,
    url: newSound.url,
    playCount: newSound.playCount,
    createdAt: newSound.createdAt,
    categories: categories.map((category) => CategoryAdapter.toModel(category)),
  };
}

/**
 * Lê todos os sons com suas categorias
 */
export async function readAllSounds(): Promise<SoundModel[]> {
  const sounds = await db.select().from(soundsTable);

  const soundsWithCategories: SoundModel[] = [];

  for (const sound of sounds) {
    const categories = await db
      .select({
        id: categoriesTable.id,
        label: categoriesTable.label,
      })
      .from(soundsToCategoriesTable)
      .innerJoin(categoriesTable, eq(soundsToCategoriesTable.categoryId, categoriesTable.id))
      .where(eq(soundsToCategoriesTable.soundId, sound.id));

    soundsWithCategories.push({
      id: sound.id,
      name: sound.name,
      url: sound.url,
      playCount: sound.playCount,
      createdAt: sound.createdAt,
      categories: categories.map((category) => CategoryAdapter.toModel(category)),
    });
  }

  return soundsWithCategories;
}

// ==================== CATEGORIES ====================

/**
 * Cria uma nova categoria
 */
export async function createCategory(category: CategoryInsert): Promise<CategoryModel> {
  const newCategory = {
    id: uuid(),
    label: category.label,
  };

  await db.insert(categoriesTable).values(newCategory);
  return CategoryAdapter.toModel(newCategory);
}

/**
 * Lê todas as categorias
 */
export async function getCategories(): Promise<CategoryModel[]> {
  const categories = await db.select().from(categoriesTable);
  return categories.map((category) => CategoryAdapter.toModel(category));
}

/**
 * Deleta uma categoria pelo ID
 */
export async function deleteCategory(id: string): Promise<boolean> {
  const categories = await db.select().from(categoriesTable).where(eq(categoriesTable.id, id));
  
  if (categories.length === 0) {
    return false;
  }

  await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
  return true;
}

// ==================== VERSION ====================

/**
 * Escreve uma nova versão
 */
async function createVersion(version: VersionModel): Promise<Version> {
  await db.insert(versionTable).values(VersionAdapter.toModel(version));
  return VersionAdapter.toModel(version);
}

/**
 * Lê a versão atual (retorna o ID mais recente)
 * Se não existir, cria uma versão com valor 0
 */
export async function getVersion(): Promise<VersionModel> {
  const versions = await db
    .select()
    .from(versionTable)
    .limit(1);

  if (versions.length > 0) {
    return VersionAdapter.toModel(versions[0]!);
  }

  // Se não existir, cria uma versão com valor 0
  const newVersion = await createVersion({ id: 0 });
  return VersionAdapter.toModel(newVersion);
}

/**
 * Incrementa a versão existente
 */
export async function incrementVersion(): Promise<Version> {
  const version = await getVersion();
  await db.delete(versionTable);

  return await createVersion({ id: version.id + 1 });
}

// ==================== ROOM ====================

/**
 * Cria uma nova sala
 */
export async function createRoom(room: RoomInsert): Promise<RoomModel> {
  const newRoom = {
    id: uuid(),
    name: room.name,
    createdAt: Date.now(),
  }

  await db.insert(roomsTable).values(newRoom);
  return RoomAdapter.toModel(newRoom);
}

/**
 * Recupera todas as salas
 */
export async function getRooms(): Promise<RoomModel[]> {
  const rooms = await db.select().from(roomsTable);
  return rooms.map((room) => RoomAdapter.toModel(room));
}

/**
 * Deleta uma sala pelo ID
 */
export async function deleteRoom(id: string): Promise<boolean> {
  const rooms = await db.select().from(roomsTable).where(eq(roomsTable.id, id));
  
  if (rooms.length === 0) {
    return false;
  }

  await db.delete(roomsTable).where(eq(roomsTable.id, id));
  return true;
}

export default db;
