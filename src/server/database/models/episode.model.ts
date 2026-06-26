import { model, models, Schema, type Model, type Types } from "mongoose";

export type EpisodeSourceStatus = "active" | "error" | "processing";

export interface EpisodeItem {
  name: string;
  slug: string;
  embed: string;
  m3u8: string;
  filename: string;
  size: number;
  duration: number;
  source_status: EpisodeSourceStatus;
  source_error: string;
  thumbnail: string;
  air_date: Date | null;
  created: Date;
}

export interface EpisodeDbObject {
  movie_id: Types.ObjectId;
  server_name: string;
  server_slug: string;
  items: EpisodeItem[];
  created: Date;
}

const episodeItemSchema = new Schema<EpisodeItem>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      default: "",
      trim: true,
    },
    embed: {
      type: String,
      default: "",
      trim: true,
    },
    m3u8: {
      type: String,
      default: "",
      trim: true,
    },
    filename: {
      type: String,
      default: "",
      trim: true,
    },
    size: {
      type: Number,
      default: 0,
      min: 0,
    },
    duration: {
      type: Number,
      default: 0,
      min: 0,
    },
    source_status: {
      type: String,
      enum: ["active", "error", "processing"],
      default: "active",
      required: true,
    },
    source_error: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
      trim: true,
    },
    air_date: {
      type: Date,
      default: null,
    },
    created: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
    id: false,
  },
);

const episodeSchema = new Schema<EpisodeDbObject>(
  {
    movie_id: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
      index: true,
    },
    server_name: {
      type: String,
      required: true,
      trim: true,
    },
    server_slug: {
      type: String,
      default: "",
      trim: true,
    },
    items: {
      type: [episodeItemSchema],
      default: [],
    },
    created: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

episodeSchema.index({ movie_id: 1, server_slug: 1 });

export const EpisodeModel =
  (models.Episode as Model<EpisodeDbObject>) ||
  model<EpisodeDbObject>("Episode", episodeSchema);
