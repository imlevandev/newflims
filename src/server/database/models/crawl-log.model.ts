import { model, models, Schema, type Model } from "mongoose";

export type CrawlType = "full" | "incremental" | "single";
export type CrawlStatus = "running" | "done" | "error";

export interface CrawlErrorItem {
  slug?: string;
  message?: string;
}

export interface CrawlLogDbObject {
  source: string;
  type: CrawlType;
  status: CrawlStatus;
  page_start: number;
  page_end: number | null;
  total_movies: number;
  new_movies: number;
  updated_movies: number;
  error_movies: number;
  crawl_errors: CrawlErrorItem[];
  started: Date;
  finished: Date | null;
}

const crawlErrorSchema = new Schema<CrawlErrorItem>(
  {
    slug: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
    id: false,
  },
);

const crawlLogSchema = new Schema<CrawlLogDbObject>(
  {
    source: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["full", "incremental", "single"],
      default: "incremental",
      required: true,
    },
    status: {
      type: String,
      enum: ["running", "done", "error"],
      default: "running",
      required: true,
    },
    page_start: {
      type: Number,
      default: 1,
      min: 1,
    },
    page_end: {
      type: Number,
      default: null,
      min: 1,
    },
    total_movies: {
      type: Number,
      default: 0,
      min: 0,
    },
    new_movies: {
      type: Number,
      default: 0,
      min: 0,
    },
    updated_movies: {
      type: Number,
      default: 0,
      min: 0,
    },
    error_movies: {
      type: Number,
      default: 0,
      min: 0,
    },
    crawl_errors: {
      type: [crawlErrorSchema],
      default: [],
    },
    started: {
      type: Date,
      default: Date.now,
    },
    finished: {
      type: Date,
      default: null,
    },
  },
  {
    versionKey: false,
  },
);

export const CrawlLogModel =
  (models.CrawlLog as Model<CrawlLogDbObject>) ||
  model<CrawlLogDbObject>("CrawlLog", crawlLogSchema);
