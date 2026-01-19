import type { Request, Response } from 'express';
import { getVersion } from '../diplomat/db.js';

export default class VersionController {
  static async getCurrentVersion(_: Request, res: Response) {
    try {
      const version = await getVersion();
      res.json(version);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get version' });
    }
  }
}
