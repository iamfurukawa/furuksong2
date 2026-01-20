import type { SoundRequest } from "../wire/in/sound.js";
import type { SoundModel } from "../models/sound.js";
import { writeSound, readAllSounds, incrementVersion } from "../diplomat/db.js";
import SoundLogic from "../logic/sound.js";

class SoundController {
  static async createSound(soundRequest: SoundRequest): Promise<SoundModel> {
    SoundLogic.validateSoundRequest(soundRequest);
    
    const sound = await writeSound({...soundRequest, url: "https://"});
    await incrementVersion();
    
    return sound;
  }

  static async getAllSounds(): Promise<SoundModel[]> {
    return await readAllSounds();
  }
}

export default SoundController;
