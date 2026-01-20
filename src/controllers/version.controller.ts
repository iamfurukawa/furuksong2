import { getVersion } from '../diplomat/db.js';
import type { VersionModel } from '../models/version.js';

export default class VersionController {
  static async getCurrentVersion(): Promise<VersionModel> {
    return await getVersion();
  }
}
