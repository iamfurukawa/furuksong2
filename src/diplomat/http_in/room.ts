import type { Request, Response } from 'express';
import RoomController from '../../controllers/room.controller.js';
import RoomAdapter from '../../adapters/room.adapter.js';

export default class Room {
  static async createRoom(req: Request, res: Response) {
    const roomModel = RoomAdapter.toModel(req.body);
    const room = await RoomController.createRoom(roomModel);
    const roomResponse = RoomAdapter.toWireOut(room);
    res.status(201).json(roomResponse);
  }

  static async getRooms(_: Request, res: Response) {
    const rooms = await RoomController.getRooms();
    const roomsResponse = RoomAdapter.toWireOutList(rooms);
    res.status(200).json(roomsResponse);
  }

  static async deleteRoom(req: Request, res: Response) {
    const { id } = req.params;
    await RoomController.deleteRoom(id);
    res.status(204).send();
  }
}
