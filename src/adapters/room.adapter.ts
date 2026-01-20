import type { RoomModel } from "../models/room.js";
import type { Room } from "../models/db/room.interface.js";
import type { RoomRequest } from "../wire/in/room.js";
import type { RoomResponse, RoomListResponse } from "../wire/out/room.js";

class RoomAdapter {
  static toWireOut(room: Room): RoomResponse {
    return { id: room.id, name: room.name, createdAt: room.createdAt };
  }

  static toWireOutList(rooms: Room[]): RoomListResponse {
    return { rooms: rooms.map(room => this.toWireOut(room)) };
  }

  static toModel(room: RoomRequest): RoomModel {
    return { name: room.name };
  }
}

export default RoomAdapter;
