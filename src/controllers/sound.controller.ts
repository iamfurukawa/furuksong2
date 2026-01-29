import type { SoundRequest } from "../wire/in/sound.js";
import type { SoundModel } from "../models/sound.js";
import { writeSound, readAllSounds, deleteSound, updateSound } from "../diplomat/db-postgres.js";
import SoundLogic from "../logic/sound.js";
import { v4 as uuid } from "uuid";
import { uploadFile, deleteFile } from "../diplomat/firebase.js";
import type { FileMulter } from "../diplomat/http_in/sound.js";

class SoundController {
  static async createSound(soundRequest: SoundRequest, file?: FileMulter): Promise<SoundModel> {
    SoundLogic.validateSoundRequest(soundRequest);
    SoundLogic.validateSoundFile(file);
    
    const soundId = `${uuid()}`;
    
    try {
      // Fazer upload para Firebase
      const url = await uploadFile(
        file!.buffer,
        soundId,
      );
      
      const sound = await writeSound({...soundRequest, id: soundId, url: url});
      
      return sound;
    } catch (error) {
      // Se der erro, deletar o arquivo do Firebase
      try {
        await deleteFile(soundId);
      } catch (deleteError) {
        console.error('Failed to delete file from Firebase after error:', deleteError);
        throw deleteError;
      }
      throw error;
    }
  }

  static async getAllSounds(): Promise<SoundModel[]> {
    return await readAllSounds();
  }

  static async deleteSound(id: string): Promise<boolean> {
    // Primeiro buscar o som para verificar se existe
    const sounds = await readAllSounds();
    const soundToDelete = sounds.find(sound => sound.id === id);
    
    if (!soundToDelete) {
      return false;
    }

    try {
      // Primeiro tentar deletar o arquivo do Firebase
      try {
        await deleteFile(id);
      } catch (firebaseError) {
        console.warn('Failed to delete file from Firebase:', firebaseError);
        // Não falha a operação se o Firebase não funcionar
      }
      
      // Depois deletar do banco de dados
      const deleted = await deleteSound(id);
      
      return deleted;
    } catch (error) {
      console.error('Error deleting sound:', error);
      throw error;
    }
  }

  static async updateSound(id: string, name: string, categoryIds: string[]): Promise<SoundModel> {
    if (!name || name.trim() === '') {
      throw new Error('Sound name is required');
    }

    return await updateSound(id, name.trim(), categoryIds);
  }
}

export default SoundController;
