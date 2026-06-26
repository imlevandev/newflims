import { describe, expect, it } from "vitest";

import { PingService } from "../src/modules/ping/ping.service";

describe("PingService", () => {
  it("builds a human-readable latency response", () => {
    const service = new PingService();

    expect(service.buildReply(42)).toEqual({
      content: "Pong! Gateway latency: 42ms",
    });
  });
});
