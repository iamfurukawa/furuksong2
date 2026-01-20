import type { RoomModel } from "../models/room.js";
import { ValidationError } from "../errors/app.error.js";

class RoomLogic {
  static isValid(room: RoomModel) {
    if (!room.name) {
      throw new ValidationError("Room name is required", "The name field is mandatory for room creation");
    }
  }

  static isValidId(id: string) {
    if (!id) {
      throw new ValidationError("Room ID is required", "The ID field is mandatory for room operations");
    }
  }
}

export default RoomLogic;
