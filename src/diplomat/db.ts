import { drizzle } from 'drizzle-orm/libsql';
import { eq } from 'drizzle-orm';
import { uuid } from 'uuidv4';
import {
  soundsTable,
  categoriesTable,
  soundsToCategoriesTable,
  versionTable,
  roomsTable,
} from '../wire/sqlite3/schema.js';
import type {
  SoundWithCategories,
  SoundInsert,
  Category,
  CategoryInsert,
} from '../models/db/sound.interface.js';
import type { Version } from '../models/db/version.interface.js';
import type { Room, RoomInsert } from '../models/db/room.interface.js';

const db = drizzle({ connection: { url: process.env.DB_FILE_NAME! } });

// ==================== SOUND + CATEGORIES ====================

/**
 * Escreve um novo som com suas categorias
 */
export async function writeSound(sound: SoundInsert): Promise<void> {

  const newSound = {
    id: uuid(),
    name: sound.name,
    url: sound.url,
    playCount: 0,
    createdAt: Date.now(),
  };

  // Inserir o som
  await db.insert(soundsTable).values(newSound);

  // Inserir relacionamentos com categorias
  if (sound.categoryIds.length > 0) {
    const relations = sound.categoryIds.map((categoryId) => ({
      soundId: newSound.id,
      categoryId,
    }));

    await db.insert(soundsToCategoriesTable).values(relations);
  }
}

/**
 * Lê todos os sons com suas categorias
 */
export async function readAllSounds(): Promise<SoundWithCategories[]> {
  const sounds = await db.select().from(soundsTable);

  const soundsWithCategories: SoundWithCategories[] = [];

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
      ...sound,
      categories,
    });
  }

  return soundsWithCategories;
}

// ==================== CATEGORIES ====================

/**
 * Cria uma nova categoria
 */
export async function createCategory(category: CategoryInsert): Promise<Category> {
  const newCategory = {
    id: uuid(),
    label: category.label,
  };

  await db.insert(categoriesTable).values(newCategory);
  return newCategory;
}

/**
 * Lê todas as categorias
 */
export async function getCategories(): Promise<Category[]> {
  const categories = await db.select().from(categoriesTable);
  return categories.map((category) => ({
    id: category.id,
    label: category.label,
  }));
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
async function createVersion(version: Version): Promise<Version> {
  await db.insert(versionTable).values(version);
  return { id: version.id };
}

/**
 * Lê a versão atual (retorna o ID mais recente)
 * Se não existir, cria uma versão com valor 0
 */
export async function getVersion(): Promise<Version> {
  const versions = await db
    .select()
    .from(versionTable)
    .limit(1);

  if (versions.length > 0) {
    return { id: versions[0]!.id };
  }

  // Se não existir, cria uma versão com valor 0
  return await createVersion({ id: 0 });
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
export async function createRoom(room: RoomInsert): Promise<Room> {
  const newRoom = {
    id: uuid(),
    name: room.name,
    createdAt: Date.now(),
  }

  await db.insert(roomsTable).values(newRoom);
  return newRoom;
}

/**
 * Recupera todas as salas
 */
export async function getRooms(): Promise<Room[]> {
  const rooms = await db.select().from(roomsTable);
  return rooms.map((room) => ({
    id: room.id,
    name: room.name,
    createdAt: room.createdAt,
  }));
}

/**
 * Deleta uma sala pelo ID
 */
export async function deleteRoom(id: string): Promise<boolean> {
  // Verificar se a sala existe antes de deletar
  const rooms = await db.select().from(roomsTable).where(eq(roomsTable.id, id));
  
  if (rooms.length === 0) {
    return false;
  }

  await db.delete(roomsTable).where(eq(roomsTable.id, id));
  return true;
}

export default db;
