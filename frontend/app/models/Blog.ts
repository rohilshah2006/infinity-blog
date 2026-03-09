import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlog extends Document {
  title: string;
  content: string;
  author: string;
  backgroundColor: string;
  image?: string;
  contentFont: string;
  titleColor: string;
  tags?: string[];
  category?: string;
  excerpt?: string;
  readingTime?: number;
  textAlignment?: string;
  layoutStyle?: string;
  avatarUrl?: string;
  coverImagePosition?: string;
  createdAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    backgroundColor: { type: String, default: "#171717" },
    titleColor: { type: String, default: "#f9fafb" },
    image: { type: String }, // Storing Base64 string (Okay for small apps, bad for huge ones)
    contentFont: { type: String, default: "Arial" },
    tags: { type: [String], default: [] },
    category: { type: String, default: "Uncategorized" },
    excerpt: { type: String },
    readingTime: { type: Number },
    textAlignment: { type: String, default: "left" },
    layoutStyle: { type: String, default: "classic" },
    avatarUrl: { type: String },
    coverImagePosition: { type: String, default: "top" },
    likes: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    entranceAnimation: { type: String, default: "fadeInUp" },
  },
  { timestamps: true }
);

// Next.js hack: forcefully delete and recompile the model to ensure new fields are recognized during hot reloads
if (mongoose.models.Blog) {
  delete mongoose.models.Blog;
}
const Blog: Model<IBlog> = mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;