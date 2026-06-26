import { model, models, Schema, type Model, type Types } from "mongoose";

export interface HomepageListDbObject {
  name: string;
  slug: string;
  style: number;
  order: number;
  color: string;
  filter: string;
  movies: Types.ObjectId[];
  cache_at: Date | null;
}

const homepageListSchema = new Schema<HomepageListDbObject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
    },
    style: {
      type: Number,
      default: 6,
    },
    order: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: "",
      trim: true,
    },
    filter: {
      type: String,
      default: "",
      trim: true,
    },
    movies: {
      type: [Schema.Types.ObjectId],
      ref: "Movie",
      default: [],
    },
    cache_at: {
      type: Date,
      default: null,
    },
  },
  {
    versionKey: false,
  },
);

export const HomepageListModel =
  (models.HomepageList as Model<HomepageListDbObject>) ||
  model<HomepageListDbObject>("HomepageList", homepageListSchema);
