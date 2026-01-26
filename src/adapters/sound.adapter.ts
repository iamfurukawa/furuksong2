import type { SoundModel } from "../models/sound.js";
import type { SoundWithCategories } from "../models/db/sound.interface.js";
import type { SoundRequest } from "../wire/in/sound.js";
import type { SoundListResponse, SoundResponse } from "../wire/out/sound.js";

class SoundAdapter {
  static toModel(sound: SoundRequest | SoundWithCategories): SoundModel {
    if ('id' in sound) {
      return {
        id: sound.id,
        name: sound.name,
        url: sound.url ?? "",
        playCount: sound.playCount,
        createdAt: sound.createdAt,
        categories: sound.categories.map((category) => ({ id: category.id, label: category.label })),
      };
    }
    return {
      id: null,
      name: sound.name,
      url: sound.url ?? "",
      playCount: 0,
      createdAt: null,
      categories: [],
    };
  }

  static toWireOut(sound: SoundModel): SoundResponse {
    return {
      id: sound.id || '',
      name: sound.name,
      url: sound.url,
      playCount: sound.playCount,
      createdAt: sound.createdAt || Date.now(),
      categories: sound.categories.map((category) => ({ 
        id: category.id || '', 
        label: category.label 
      })),
    };
  }

  static toWireOutList(sounds: SoundModel[]): SoundListResponse {
    return { sounds: sounds.map((sound) => this.toWireOut(sound)) };
  }
}

export default SoundAdapter;
