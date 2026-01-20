import type { SoundRequest } from "../wire/in/sound.js";
import { ValidationError } from "../errors/app.error.js";
import type { FileMulter } from "../diplomat/http_in/sound.js";

class SoundLogic {
  static validateSoundRequest(sound: SoundRequest): void {
    if (!sound.name || sound.name.trim().length === 0) {
      throw new ValidationError("Sound name cannot be empty");
    }
  }

  static validateSoundFile(file?: FileMulter): void {
    if (!file) {
      throw new ValidationError("Sound file is required");
    }

    const maxSize = 1 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new ValidationError("File size exceeds 1MB limit");
    }

    if (!file.mimetype.includes('audio/mpeg') && !file.originalname.endsWith('.mp3')) {
      throw new ValidationError("Only MP3 files are allowed");
    }
  }
}

export default SoundLogic;
