"use server";

import connectDB from "./lib/db";
import Blog from "./models/Blog";
import Settings from "./models/Settings";
import { revalidatePath } from "next/cache";

// --- SETTINGS ACTIONS ---

export async function getSettings() {
  try {
    await connectDB();
    let settings = await Settings.findOne({ isGlobalConfig: true }).lean();

    // Auto-create singleton if it doesn't exist
    if (!settings) {
      const created = await Settings.create({});
      settings = created.toJSON();
    }

    // Force strict JSON serialization to strip BSON ObjectId and Date classes
    return JSON.parse(JSON.stringify(settings));
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateSettings(data: any) {
  try {
    await connectDB();
    await Settings.findOneAndUpdate(
      { isGlobalConfig: true },
      { $set: data },
      { upsert: true, new: true }
    );
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false };
  }
}

// --- BLOG ACTIONS ---

// 1. Fetch all blogs
export async function getBlogs(timestamp?: number) {
  try {
    console.log("--- Executing getBlogs ---", timestamp);
    await connectDB();
    console.log("Connected to DB, finding blogs...");
    const blogs = await Blog.find().sort({ order: 1, createdAt: -1 }).lean();
    console.log(`Found ${blogs.length} blogs in DB.`);

    // Force strict JSON serialization to strip BSON ObjectId and Date classes
    const serialized = JSON.stringify(blogs);
    // console.log("Serialized:", serialized.substring(0, 100)); // Truncated to avoid massive logs
    return JSON.parse(serialized);
  } catch (error) {
    console.error("Error fetching blogs (getBlogs):", error);
    return [];
  }
}

export async function createBlog(data: {
  title: string;
  content: string;
  author: string;
  backgroundColor: string;
  image: string | null;
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
  isFeatured?: boolean;
  entranceAnimation?: string;
}) {
  try {
    await connectDB();

    // Build payload explicitly to avoid assigning null to optional strings
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: Record<string, any> = {
      title: data.title,
      content: data.content,
      author: data.author,
      backgroundColor: data.backgroundColor,
      titleColor: data.titleColor,
      contentFont: data.contentFont,
      tags: data.tags || [],
      category: data.category || "Uncategorized",
      excerpt: data.excerpt,
      readingTime: data.readingTime,
      textAlignment: data.textAlignment || "left",
      layoutStyle: data.layoutStyle || "classic",
      avatarUrl: data.avatarUrl,
      coverImagePosition: data.coverImagePosition || "top",
      isFeatured: data.isFeatured || false,
      entranceAnimation: data.entranceAnimation || "fadeInUp",
      likes: 0,
    };

    if (data.image) {
      payload.image = data.image; // Only append if truthy (not null/empty)
    }

    await Blog.create(payload);

    // This tells Next.js: "Data changed, refresh the page!"
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating blog:", error);
    return { success: false };
  }
}

// 3. Delete a blog
export async function deleteBlog(id: string) {
  try {
    await connectDB();
    await Blog.findByIdAndDelete(id);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting blog:", error);
    return { success: false };
  }
}

// 4. Like a blog
export async function likeBlog(id: string) {
  try {
    await connectDB();
    await Blog.findByIdAndUpdate(id, { $inc: { likes: 1 } });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error liking blog:", error);
    return { success: false };
  }
}

// 5. Update a blog
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateBlog(id: string, data: any) {
  try {
    await connectDB();
    await Blog.findByIdAndUpdate(id, { $set: data });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating blog:", error);
    return { success: false };
  }
}

// 6. Update blog order
export async function updateBlogOrder(updates: { _id: string; order: number }[]) {
  try {
    await connectDB();
    const bulkOps = updates.map((update) => ({
      updateOne: {
        filter: { _id: update._id },
        update: { $set: { order: update.order } },
      },
    }));
    await Blog.bulkWrite(bulkOps);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating blog order:", error);
    return { success: false };
  }
}