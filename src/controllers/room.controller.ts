import { createRoom, getRooms, deleteRoom, updateRoom } from "../diplomat/db-postgres.js";
import type { RoomModel } from '../models/room.js';
import type { RoomInsert } from '../models/db/room.interface.js';
import RoomLogic from '../logic/room.js';

export default class RoomController {
  static async createRoom(room: RoomModel): Promise<RoomModel> {
    RoomLogic.isValid(room);
    const roomInsert: RoomInsert = { name: room.name };
    return await createRoom(roomInsert);
  }

  static async getRooms(): Promise<RoomModel[]> {
    return await getRooms();
  }

  static async deleteRoom(id: string): Promise<boolean> {
    RoomLogic.isValidId(id);
    return await deleteRoom(id);
  }

  static async updateRoom(id: string, room: RoomModel): Promise<RoomModel> {
    RoomLogic.isValid(room);
    RoomLogic.isValidId(id);
    return await updateRoom(id, { name: room.name });
  }
}
