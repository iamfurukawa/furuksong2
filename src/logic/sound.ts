import type { SoundRequest } from "../wire/in/sound.js";
import { ValidationError } from "../errors/app.error.js";

class SoundLogic {
  static validateSoundRequest(sound: SoundRequest): void {
    if (!sound.name || sound.name.trim().length === 0) {
      throw new ValidationError("Sound name cannot be empty");
    }
  }
}

export default SoundLogic;
