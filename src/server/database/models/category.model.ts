import { model, models, Schema, type Model } from "mongoose";

export interface CategoryDbObject {
  name: string;
  slug: string;
  description: string;
  seo_title: string;
  seo_desc: string;
  order: number;
  movie_count: number;
  created: Date;
}

const categorySchema = new Schema<CategoryDbObject>(
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
    description: {
      type: String,
      default: "",
    },
    seo_title: {
      type: String,
      default: "",
      trim: true,
    },
    seo_desc: {
      type: String,
      default: "",
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
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

export const CategoryModel =
  (models.Category as Model<CategoryDbObject>) ||
  model<CategoryDbObject>("Category", categorySchema);
