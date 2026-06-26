import { z } from "zod";

const envSchema = z.object({
  APP_NAME: z.string().default("nextjs-web"),
  APP_ENV: z.enum(["development", "test", "production"]).default("development"),
  MONGODB_URI: z.string().min(1).default("mongodb://127.0.0.1:27017/nextjs_web"),
  MONGODB_DB_NAME: z.string().min(1).default("nextjs_web"),
  OPHIM_BASE_URL: z.string().url().default("https://ophim1.com"),
  OPHIM_IMAGE_BASE_URL: z
    .string()
    .url()
    .default("https://img.ophim.live/uploads/movies"),
  MOVIE_API_BASE_URL: z
    .string()
    .url()
    .default("https://egluy2hhb21vaw5ndw9pbmhl.darkbytes.xyz/api/v1"),
  CRAWL_SECRET_KEY: z.string().min(1).default("dev-crawl-secret"),
});

export const env = envSchema.parse({
  APP_NAME: process.env.APP_NAME,
  APP_ENV: process.env.APP_ENV ?? process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
  OPHIM_BASE_URL: process.env.OPHIM_BASE_URL,
  OPHIM_IMAGE_BASE_URL: process.env.OPHIM_IMAGE_BASE_URL,
  MOVIE_API_BASE_URL: process.env.MOVIE_API_BASE_URL,
  CRAWL_SECRET_KEY: process.env.CRAWL_SECRET_KEY,
});
