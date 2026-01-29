import type { Request, Response } from "express";
import { Readable } from "stream";
import SoundController from "../../controllers/sound.controller.js";
import SoundAdapter from "../../adapters/sound.adapter.js";

export interface FileMulter {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
  stream: Readable;
}

export interface MulterRequest extends Request {
  file?: FileMulter
}

export async function createSound(req: MulterRequest, res: Response): Promise<void> {
  const soundRequest = req.body;
  const file = req.file;
  
  // Processar categories: converter de string para array se necessário
  if (soundRequest.categories && typeof soundRequest.categories === 'string') {
    soundRequest.categories = soundRequest.categories.split(',').map((cat: string) => cat.trim()).filter((cat: string) => cat);
  }
  
  const sound = await SoundController.createSound(soundRequest, file);
  const response = SoundAdapter.toWireOut(sound);
  res.status(201).json(response);
}

export async function getAllSounds(req: Request, res: Response): Promise<void> {
  const sounds = await SoundController.getAllSounds();
  const response = SoundAdapter.toWireOutList(sounds);
  res.status(200).json(response);
}

export async function deleteSound(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  
  if (!id || typeof id !== 'string') {
    res.status(400).json({ error: 'Invalid sound ID' });
    return;
  }
  
  const deleted = await SoundController.deleteSound(id);
  
  if (deleted) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Sound not found' });
  }
}

export async function updateSound(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { name, categoryIds } = req.body;
  
  if (!id || typeof id !== 'string') {
    res.status(400).json({ error: 'Invalid sound ID' });
    return;
  }
  
  if (!name || typeof name !== 'string') {
    res.status(400).json({ error: 'Name is required' });
    return;
  }
  
  if (!Array.isArray(categoryIds)) {
    res.status(400).json({ error: 'Category IDs must be an array' });
    return;
  }
  
  try {
    const updatedSound = await SoundController.updateSound(id as string, name, categoryIds);
    const response = SoundAdapter.toWireOut(updatedSound);
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Sound not found' || error.message === 'Sound not found after update') {
        res.status(404).json({ error: 'Sound not found' });
      } else if (error.message === 'Sound name is required') {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update sound' });
      }
    } else {
      res.status(500).json({ error: 'Failed to update sound' });
    }
  }
}

export default {
  createSound,
  getAllSounds,
  deleteSound,
  updateSound,
};
