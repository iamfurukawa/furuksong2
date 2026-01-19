import { getVersion } from '../diplomat/db.js';

export default class VersionController {
  static async getCurrentVersion() {
    return await getVersion();
  }
}
