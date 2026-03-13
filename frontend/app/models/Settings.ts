import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
    {
        isGlobalConfig: { type: Boolean, default: true, unique: true }, // Singleton enforcer
        heroBadge: { type: String, default: "The Premium Experience" },
        heroTitle: { type: String, default: "Infinite Insights" },
        heroTitleColor: { type: String, default: "#f9fafb" },
        heroDescription: { type: String, default: "Explore meticulously crafted ideas, thoughts, and reflections, beautifully designed for those who appreciate typographical perfection." },
        heroFont: { type: String, default: "var(--font-poppins)" },
        siteBackground: { type: String, default: "#0a0a0a" },
        primaryAccent: { type: String, default: "#f59e0b" }, // Maps to brand-orange dynamically
        defaultAuthorName: { type: String, default: "Anonymous" },
        defaultAvatarUrl: { type: String, default: "" },
        footerTwitter: { type: String, default: "" },
        footerGithub: { type: String, default: "" },
        footerLinkedin: { type: String, default: "" },
        themePreset: { type: String, default: "infinity" },
    },
    { timestamps: true }
);
if (mongoose.models.Settings) {
    delete mongoose.models.Settings;
}
export default mongoose.model("Settings", SettingsSchema);
