import { model, models, Schema, type Model } from "mongoose";

export interface RegionDbObject {
  name: string;
  slug: string;
  movie_count: number;
  created: Date;
}

const regionSchema = new Schema<RegionDbObject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    movie_count: {
      type: Number,
      default: 0,
      min: 0,
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

export const RegionModel =
  (models.Region as Model<RegionDbObject>) || model<RegionDbObject>("Region", regionSchema);
