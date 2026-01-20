import { createRoom, getRooms, deleteRoom } from '../diplomat/db.js';
import type { RoomModel } from '../models/room.js';
import RoomLogic from '../logic/room.js';

export default class RoomController {
  static async createRoom(room: RoomModel) {
    RoomLogic.isValid(room);
    return await createRoom(room);
  }

  static async getRooms() {
    return await getRooms();
  }

  static async deleteRoom(id: string) {
    RoomLogic.isValidId(id);
    return await deleteRoom(id);
  }
}
