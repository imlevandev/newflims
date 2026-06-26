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

function isLocalMongoUri(uri: string) {
  return uri.includes("127.0.0.1") || uri.includes("localhost");
}

export async function connectDb() {
  if (env.APP_ENV === "production" && isLocalMongoUri(env.MONGODB_URI)) {
    throw new Error("MONGODB_URI must be configured in production.");
  }

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
