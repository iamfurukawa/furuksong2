import type { SoundRequest } from "../wire/in/sound.js";
import type { SoundModel } from "../models/sound.js";
import { writeSound, readAllSounds, incrementVersion } from "../diplomat/db-postgres.js";
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
      await incrementVersion();
      
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
}

export default SoundController;
