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

  static async deleteRoom(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    
    if (!id || typeof id !== 'string') {
      res.status(400).json({ error: 'Invalid room ID' });
      return;
    }
    
    const deleted = await RoomController.deleteRoom(id);
    
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Room not found' });
    }
  }

  static async updateRoom(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!id || typeof id !== 'string') {
      res.status(400).json({ error: 'Invalid room ID' });
      return;
    }
    
    if (!name || typeof name !== 'string') {
      res.status(400).json({ error: 'Name is required' });
      return;
    }
    
    try {
      const updatedRoom = await RoomController.updateRoom(id as string, { id: null, name, createdAt: Date.now() });
      const response = RoomAdapter.toWireOut(updatedRoom);
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error && error.message === 'Room not found') {
        res.status(404).json({ error: 'Room not found' });
      } else {
        res.status(500).json({ error: 'Failed to update room' });
      }
    }
  }
}
