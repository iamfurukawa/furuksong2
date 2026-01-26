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
  const sound = await SoundController.createSound(soundRequest, file);
  const response = SoundAdapter.toWireOut(sound);
  res.status(201).json(response);
}

export async function getAllSounds(req: Request, res: Response): Promise<void> {
  const sounds = await SoundController.getAllSounds();
  const response = SoundAdapter.toWireOutList(sounds);
  res.status(200).json(response);
}

export default {
  createSound,
  getAllSounds,
};
