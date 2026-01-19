import type { Request, Response } from 'express';
import VersionController from '../../controllers/version.controller.js';
import VersionAdapter from '../../adapters/version.adapter.js';

export default class Version {
  static async getCurrentVersion(_: Request, res: Response) {
    try {
      const version = await VersionController.getCurrentVersion();
      const versionResponse = VersionAdapter.toWireOut(version);
      res.json(versionResponse);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get version' });
    }
  }
}
