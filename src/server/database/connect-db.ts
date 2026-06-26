import mongoose from "mongoose";

import { env } from "@/server/config/env";

declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const globalCache = globalThis.mongooseConnection ?? {
  conn: null,
  promise: null,
};

globalThis.mongooseConnection = globalCache;

export async function connectDb() {
  if (globalCache.conn) {
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(env.MONGODB_URI, {
      dbName: env.MONGODB_DB_NAME,
    });
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}
