import { createRoom, getRooms, deleteRoom } from '../diplomat/db.js';
import type { RoomModel } from '../models/room.js';
import RoomLogic from '../logic/room.js';

export default class RoomController {
  static async createRoom(room: RoomModel): Promise<RoomModel> {
    RoomLogic.isValid(room);
    return await createRoom(room);
  }

  static async getRooms(): Promise<RoomModel[]> {
    return await getRooms();
  }

  static async deleteRoom(id: string): Promise<boolean> {
    RoomLogic.isValidId(id);
    return await deleteRoom(id);
  }
}
