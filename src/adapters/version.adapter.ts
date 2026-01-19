import type { Version } from "../models/db/version.interface.js";
import type { VersionResponse } from "../wire/out/version.js";

class VersionAdapter {
  static toWireOut(version: Version): VersionResponse {
    return { version: version.id };
  }
}

export default VersionAdapter;