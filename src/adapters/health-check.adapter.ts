import type { HealthCheckResponse } from "../wire/out/health-check.js";

class HealthCheckAdapter {
  static toWireOut(status: string, timestamp: Date): HealthCheckResponse {
    return { status, timestamp: timestamp.toISOString() };
  }
}

export default HealthCheckAdapter;