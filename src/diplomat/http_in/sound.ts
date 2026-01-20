import type { Request, Response } from "express";
import SoundAdapter from "../../adapters/sound.adapter.js";
import SoundController from "../../controllers/sound.controller.js";

export async function createSound(req: Request, res: Response): Promise<void> {
  const soundRequest = req.body;
  const sound = await SoundController.createSound(soundRequest);
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
