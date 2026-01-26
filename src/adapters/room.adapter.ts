import type { RoomModel } from "../models/room.js";
import type { Room } from "../models/db/room.interface.js";
import type { RoomRequest } from "../wire/in/room.js";
import type { RoomResponse, RoomListResponse } from "../wire/out/room.js";

class RoomAdapter {
  static toModel(room: RoomRequest | Room): RoomModel {
    if ('id' in room && 'createdAt' in room) {
      return { id: room.id, name: room.name, createdAt: room.createdAt };
    }
    return { id: null, name: room.name, createdAt: null };
  }

  static toWireOut(room: RoomModel): RoomResponse {
    return { id: room.id || '', name: room.name, createdAt: room.createdAt || Date.now() };
  }

  static toWireOutList(rooms: RoomModel[]): RoomListResponse {
    return { rooms: rooms.map(room => this.toWireOut(room)) };
  }
}

export default RoomAdapter;
