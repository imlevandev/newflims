export class PingService {
  buildReply(latencyMs: number) {
    return {
      content: `Pong! Gateway latency: ${latencyMs}ms`,
    };
  }
}
