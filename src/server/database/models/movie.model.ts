import { model, models, Schema, type Model, type Types } from "mongoose";

export type MovieType = "series" | "movie" | "trailer";
export type MovieStatus = "ongoing" | "completed" | "trailer";

export interface MovieTaxonomyItem {
  id?: string;
  name?: string;
  slug?: string;
}

export interface MovieTmdbSnapshot {
  id?: string;
  type?: string;
  season?: number;
  vote_average?: number;
  vote_count?: number;
}

export interface MovieImdbSnapshot {
  id?: string;
  vote_average?: number;
  vote_count?: number;
}

export interface MovieDbObject {
  name: string;
  origin_name: string;
  slug: string;
  content: string;
  type: MovieType;
  status: MovieStatus;
  quality: string;
  lang: string;
  year: number | null;
  poster_url: string;
  thumb_url: string;
  banner_url: string;
  episode_current: string;
  episode_total: string;
  episode_time: string;
  season: number;
  tmdb: MovieTmdbSnapshot;
  imdb: MovieImdbSnapshot;
  view_day: number;
  view_week: number;
  view_month: number;
  view_total: number;
  category: MovieTaxonomyItem[];
  country: MovieTaxonomyItem[];
  director: string[];
  actor: string[];
  trailer_url: string;
  showtime: string;
  created: Date;
  modified: Date;
  is_recommended: boolean;
  notify: string;
  franchiseId: Types.ObjectId | null;
  partNumber: number;
  image_name: string;
}

const taxonomyItemSchema = new Schema<MovieTaxonomyItem>(
  {
    id: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
    id: false,
  },
);

const tmdbSnapshotSchema = new Schema<MovieTmdbSnapshot>(
  {
    id: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      trim: true,
    },
    season: {
      type: Number,
      default: 1,
      min: 1,
    },
    vote_average: {
      type: Number,
      default: 0,
      min: 0,
    },
    vote_count: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
    id: false,
  },
);

const imdbSnapshotSchema = new Schema<MovieImdbSnapshot>(
  {
    id: {
      type: String,
      trim: true,
    },
    vote_average: {
      type: Number,
      default: 0,
      min: 0,
    },
    vote_count: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
    id: false,
  },
);

const movieSchema = new Schema<MovieDbObject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    origin_name: {
      type: String,
      default: "",
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    content: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: ["series", "movie", "trailer"],
      default: "series",
      required: true,
    },
    status: {
      type: String,
      enum: ["ongoing", "completed", "trailer"],
      default: "ongoing",
      required: true,
    },
    quality: {
      type: String,
      default: "HD",
      trim: true,
    },
    lang: {
      type: String,
      default: "",
      trim: true,
    },
    year: {
      type: Number,
      default: null,
    },
    poster_url: {
      type: String,
      default: "",
      trim: true,
    },
    thumb_url: {
      type: String,
      default: "",
      trim: true,
    },
    banner_url: {
      type: String,
      default: "",
      trim: true,
    },
    episode_current: {
      type: String,
      default: "",
      trim: true,
    },
    episode_total: {
      type: String,
      default: "",
      trim: true,
    },
    episode_time: {
      type: String,
      default: "",
      trim: true,
    },
    season: {
      type: Number,
      default: 1,
      min: 1,
    },
    tmdb: {
      type: tmdbSnapshotSchema,
      default: () => ({}),
    },
    imdb: {
      type: imdbSnapshotSchema,
      default: () => ({}),
    },
    view_day: {
      type: Number,
      default: 0,
      min: 0,
    },
    view_week: {
      type: Number,
      default: 0,
      min: 0,
    },
    view_month: {
      type: Number,
      default: 0,
      min: 0,
    },
    view_total: {
      type: Number,
      default: 0,
      min: 0,
    },
    category: {
      type: [taxonomyItemSchema],
      default: [],
    },
    country: {
      type: [taxonomyItemSchema],
      default: [],
    },
    director: {
      type: [String],
      default: [],
    },
    actor: {
      type: [String],
      default: [],
    },
    trailer_url: {
      type: String,
      default: "",
      trim: true,
    },
    showtime: {
      type: String,
      default: "",
      trim: true,
    },
    is_recommended: {
      type: Boolean,
      default: false,
    },
    notify: {
      type: String,
      default: "",
      trim: true,
    },
    franchiseId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    partNumber: {
      type: Number,
      default: 1,
      min: 1,
    },
    image_name: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: {
      createdAt: "created",
      updatedAt: "modified",
    },
    versionKey: false,
  },
);

movieSchema.index({ type: 1, status: 1 });
movieSchema.index({ "category.slug": 1 });
movieSchema.index({ "country.slug": 1 });
movieSchema.index({ modified: -1 });
movieSchema.index({ view_total: -1 });
movieSchema.index({ name: "text", origin_name: "text" });

export const MovieModel =
  (models.Movie as Model<MovieDbObject>) || model<MovieDbObject>("Movie", movieSchema);
