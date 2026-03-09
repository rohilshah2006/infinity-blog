"use client";

import { useState, useEffect } from "react";
import BlogCard from "./components/BlogCard"; 
import { getBlogs, createBlog, deleteBlog, getSettings, updateSettings, likeBlog } from "./actions";

interface Blog {
  _id: string; 
  title: string;
  content: string;
  author: string;
  backgroundColor: string;
  image: string | null;
  contentFont: string;
  tags: string[];
  category: string;
  excerpt: string;
  readingTime: number;
  textAlignment: string;
  layoutStyle: string;
  avatarUrl: string;
  coverImagePosition: string;
  isFeatured: boolean;
  entranceAnimation: string;
  likes: number;
  titleColor: string;
}

interface SiteSettings {
  heroBadge: string;
  heroTitle: string;
  heroTitleColor: string;
  heroDescription: string;
  heroFont: string;
  siteBackground: string;
  primaryAccent: string;
  defaultAuthorName: string;
  defaultAvatarUrl: string;
  footerTwitter: string;
  footerGithub: string;
  footerLinkedin: string;
}

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    backgroundColor: "#171717",
    titleColor: "#f9fafb",
    image: null as string | null,
    contentFont: "Arial", // Note: The BlogCard forces Lora for Arial to fit the brand
    tags: [] as string[],
    category: "Thinking",
    excerpt: "",
    readingTime: 5,
    textAlignment: "left",
    layoutStyle: "classic",
    avatarUrl: "",
    coverImagePosition: "top",
    isFeatured: false,
    entranceAnimation: "fadeInUp",
  });
  
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  
  // Dedicated state for editing global settings
  const [settingsData, setSettingsData] = useState<SiteSettings | null>(null);

  const [tagInput, setTagInput] = useState("");
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showHeroFontDropdown, setShowHeroFontDropdown] = useState(false);

  const fonts = ["Arial", "Georgia", "Courier New", "Times New Roman", "Verdana", "Trebuchet MS", "Comic Sans MS", "Allura", "var(--font-poppins)", "var(--font-lora)"];

  useEffect(() => {
    async function loadData() {
      const dbSettings = await getSettings();
      if (dbSettings) {
        setSettings(dbSettings as unknown as SiteSettings);
        setSettingsData(dbSettings as unknown as SiteSettings);
        
        // Inject defaults into composer form
        setFormData(prev => ({
          ...prev,
          author: prev.author || dbSettings.defaultAuthorName,
          avatarUrl: prev.avatarUrl || dbSettings.defaultAvatarUrl
        }));
      }

      const dbBlogs = await getBlogs(Date.now());
      setBlogs(dbBlogs as unknown as Blog[]);
    }
    loadData();
  }, []);

  const toggleForm = () => {
    if (!showForm && settings) {
        setFormData(prev => ({
          ...prev,
          author: prev.author || settings.defaultAuthorName,
          avatarUrl: prev.avatarUrl || settings.defaultAvatarUrl
        }));
    }
    setShowForm((prev) => !prev);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsData) return;
    
    await updateSettings(settingsData);
    setSettings(settingsData);
    setShowSettings(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createBlog(formData);

    const updatedBlogs = await getBlogs(Date.now());
    setBlogs(updatedBlogs as unknown as Blog[]);

    setFormData({
      title: "",
      content: "",
      author: settings?.defaultAuthorName || "",
      backgroundColor: "#171717",
      titleColor: "#f9fafb",
      image: null,
      contentFont: "Arial",
      tags: [],
      category: "Thinking",
      excerpt: "",
      readingTime: 5,
      textAlignment: "left",
      layoutStyle: "classic",
      avatarUrl: settings?.defaultAvatarUrl || "",
      coverImagePosition: "top",
      isFeatured: false,
      entranceAnimation: "fadeInUp",
    });
    setShowForm(false);
  };

  const handleLikeBlog = async (id: string) => {
    // Optimistically update top-level state so parent re-renders don't revert the child!
    setBlogs(prev => prev.map(b => b._id === id ? { ...b, likes: b.likes + 1 } : b));
    await likeBlog(id);
  };

  const handleDelete = async (id: string) => {
    const gridItem = document.getElementById(`blog-${id}`);
    if (gridItem) {
      gridItem.classList.add("opacity-0", "scale-95");
      
      setTimeout(async () => {
        await deleteBlog(id);
        const updatedBlogs = await getBlogs(Date.now());
        setBlogs(updatedBlogs as unknown as Blog[]);
      }, 400);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  // Explicit mapping of Tailwind classes to force HMR to compile them
  const animationClasses: Record<string, string> = {
    fadeInUp: "animate-fadeInUp",
    zoomIn: "animate-zoomIn",
    slideRight: "animate-slideRight",
    flip: "animate-flip",
  };

  return (
    <div 
      className="min-h-screen text-brand-dark px-4 sm:px-6 lg:px-8 py-12 md:py-20 font-lora transition-colors duration-500"
      style={{
        backgroundColor: settings?.siteBackground || "#0a0a0a",
        ["--brand-accent" as any]: settings?.primaryAccent || "#f59e0b"
      }}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="relative flex flex-col md:flex-row items-center justify-between mb-16 pb-12 border-b border-brand-lightgray/50">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/5 via-brand-light to-brand-blue/5 rounded-full -z-10 blur-3xl transform scale-110"></div>
          <div className="text-center md:text-left mb-8 md:mb-0 relative z-10 space-y-4">
            <div className="inline-block px-3 py-1 bg-brand-dark text-white text-xs font-poppins font-medium tracking-widest uppercase rounded-full shadow-md animate-fadeInUp">
              {settings?.heroBadge || "The Premium Experience"}
            </div>
            <h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
              style={{ fontFamily: settings?.heroFont || "var(--font-poppins)", color: settings?.heroTitleColor || "#f9fafb" }}
            >
              {settings?.heroTitle || "Infinite Insights"}
            </h1>
            <p className="text-brand-mid text-lg md:text-xl max-w-2xl font-lora leading-relaxed">
              {settings?.heroDescription || "Explore meticulously crafted ideas, thoughts, and reflections, beautifully designed for those who appreciate typographical perfection."}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full md:w-auto">
            <div className="relative group w-full sm:w-auto">
              {!showForm && (
                <div 
                  className="absolute inset-0 blur-xl opacity-50 transition-all duration-300 group-hover:opacity-80 group-hover:blur-2xl rounded"
                  style={{ backgroundColor: "var(--brand-accent)" }}
                ></div>
              )}
              <button
                onClick={toggleForm}
                className={`relative w-full sm:w-auto px-8 py-3.5 text-sm font-poppins font-semibold rounded text-white transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  showForm 
                    ? "bg-brand-mid hover:bg-brand-dark focus:ring-brand-mid" 
                    : "bg-[#0a0a0a] hover:scale-105"
                }`}
              >
                {showForm ? "Close Menu" : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                    <span>Create Post</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Compose Form Modal/Overlay */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md transition-all duration-300 animate-fadeIn">
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-brand-surface p-8 md:p-10 rounded-2xl shadow-2xl border border-brand-lightgray transform transition-all animate-fadeInUp">
              <button 
                onClick={() => setShowForm(false)} 
                className="absolute top-6 right-6 p-2 text-brand-mid hover:text-brand-dark hover:bg-brand-light rounded-full transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              
              <h2 className="text-3xl font-poppins font-semibold mb-8 text-brand-dark">Draft your thought</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Title and Image Grid */}
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-grow">
                    <label className="block text-sm font-poppins text-brand-mid mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="An intriguing title..."
                      className="w-full px-4 py-3 bg-black/50 border border-brand-lightgray rounded focus:border-brand-orange focus:ring-1 focus:ring-brand-orange text-brand-dark placeholder-brand-mid transition-colors duration-200 outline-none font-poppins text-lg"
                      required
                    />
                  </div>
                  
                  <div className="sm:w-32 flex flex-col">
                    <label className="block text-sm font-poppins text-brand-mid mb-2">Cover Image</label>
                    <div className="relative flex-grow">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === "string") {
                                setFormData({ ...formData, image: reader.result });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="upload-image"
                      />
                      <label
                        htmlFor="upload-image"
                        className={`flex items-center justify-center w-full h-full min-h-[52px] cursor-pointer rounded border border-brand-lightgray transition-colors duration-200 hover:border-brand-mid ${formData.image ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-light text-brand-mid'}`}
                      >
                        {formData.image ? (
                          <span className="font-poppins text-sm font-medium">Uploaded</span>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-poppins text-brand-mid">Content</label>
                    
                    <div className="relative">
                      <button
                        type="button"
                        className="text-brand-mid hover:text-brand-dark transition-colors duration-200 text-sm font-poppins flex items-center space-x-1"
                        onClick={() => setShowFontDropdown((prev) => !prev)}
                      >
                        <span>Font: {formData.contentFont === "Arial" ? "Lora (Brand)" : formData.contentFont}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                      </button>
                      
                      {showFontDropdown && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-[#171717] border border-[#333] shadow-2xl rounded-md py-2 z-[60]">
                          {fonts.map((font) => (
                            <button
                              key={font}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, contentFont: font });
                                setShowFontDropdown(false);
                              }}
                              className={`block w-full text-left px-4 py-2 hover:bg-white/5 text-sm transition-colors ${formData.contentFont === font ? 'text-brand-orange font-medium' : 'text-brand-dark'}`}
                              style={{ fontFamily: font === "Arial" ? "var(--font-lora)" : font }}
                            >
                              {font === "Arial" ? "Lora (Brand Standard)" : font}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your story..."
                    className="w-full px-4 py-4 bg-black/50 border border-brand-lightgray rounded focus:border-brand-orange focus:ring-1 focus:ring-brand-orange text-brand-dark placeholder-brand-mid transition-colors duration-200 outline-none min-h-[200px] resize-y"
                    style={{ fontFamily: formData.contentFont === "Arial" ? "var(--font-lora)" : formData.contentFont }}
                    required
                  />
                </div>

                {/* Meta details */}
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <label className="block text-sm font-poppins text-brand-mid mb-2">Author Name</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Your name"
                      className="w-full px-4 py-3 bg-black/50 border border-brand-lightgray rounded focus:border-brand-orange focus:ring-1 focus:ring-brand-orange text-brand-dark outline-none font-poppins"
                      required
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-1">
                      <label className="block text-sm font-poppins text-brand-mid mb-2">Backdrop Tint</label>
                      <div className="flex h-[50px] rounded border border-brand-lightgray bg-brand-light overflow-hidden pr-2">
                         <input
                          type="color"
                          value={formData.backgroundColor}
                          onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                          className="h-full w-12 cursor-pointer border-0 p-0 m-0 bg-transparent"
                          required
                        />
                        <span className="flex items-center pl-2 text-sm text-brand-mid font-poppins uppercase tracking-wider">
                          {formData.backgroundColor}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-sm font-poppins text-brand-mid mb-2">Title Color</label>
                      <div className="flex h-[50px] rounded border border-brand-lightgray bg-brand-light overflow-hidden pr-2">
                         <input
                          type="color"
                          value={formData.titleColor}
                          onChange={(e) => setFormData({ ...formData, titleColor: e.target.value })}
                          className="h-full w-12 cursor-pointer border-0 p-0 m-0 bg-transparent"
                          required
                        />
                        <span className="flex items-center pl-2 text-sm text-brand-mid font-poppins uppercase tracking-wider">
                          {formData.titleColor}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advanced Settings Grid */}
                <div className="pt-6 mt-6 border-t border-brand-lightgray space-y-6">
                  <h3 className="text-lg font-poppins font-medium text-brand-dark">Advanced Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Tags */}
                    <div className="md:col-span-2">
                       <label className="block text-sm font-poppins text-brand-mid mb-2">Tags</label>
                       <div className="flex flex-wrap gap-2 mb-2">
                         {formData.tags.map(tag => (
                           <span key={tag} className="inline-flex items-center px-3 py-1 bg-brand-light text-brand-dark text-xs rounded-full font-poppins border border-brand-lightgray">
                             {tag}
                             <button type="button" onClick={() => removeTag(tag)} className="ml-2 text-brand-mid hover:text-brand-orange focus:outline-none">&times;</button>
                           </span>
                         ))}
                       </div>
                       <input
                         type="text"
                         value={tagInput}
                         onChange={(e) => setTagInput(e.target.value)}
                         onKeyDown={handleAddTag}
                         placeholder="Press Enter to add tags..."
                         className="w-full px-4 py-2.5 bg-black/50 border border-brand-lightgray rounded focus:border-brand-orange text-brand-dark outline-none font-poppins text-sm"
                       />
                    </div>
                    {/* Category */}
                    <div>
                      <label className="block text-sm font-poppins text-brand-mid mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2.5 bg-black/50 border border-brand-lightgray rounded focus:border-brand-orange text-brand-dark outline-none font-poppins text-sm appearance-none"
                      >
                        <option value="Thinking">Thinking</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Design">Design</option>
                        <option value="Life">Life</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Excerpt */}
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-poppins text-brand-mid mb-2">Excerpt</label>
                      <textarea
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        placeholder="A brief summary for the card view..."
                        className="w-full px-4 py-3 bg-black/50 border border-brand-lightgray rounded focus:border-brand-orange text-brand-dark outline-none font-poppins text-sm resize-none h-20"
                      />
                    </div>
                    {/* Reading Time */}
                    <div>
                      <label className="block text-sm font-poppins text-brand-mid mb-2">Read Time (min)</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.readingTime}
                        onChange={(e) => setFormData({ ...formData, readingTime: parseInt(e.target.value) || 1 })}
                        className="w-full px-4 py-2.5 bg-black/50 border border-brand-lightgray rounded focus:border-brand-orange text-brand-dark outline-none font-poppins text-sm"
                      />
                    </div>
                    {/* Avatar URL */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-poppins text-brand-mid mb-2">Author Avatar URL (Optional)</label>
                      <input
                        type="url"
                        value={formData.avatarUrl}
                        onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                        placeholder="https://example.com/avatar.png"
                        className="w-full px-4 py-2.5 bg-black/50 border border-brand-lightgray rounded focus:border-brand-orange text-brand-dark outline-none font-poppins text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Layout Style */}
                    <div>
                      <label className="block text-sm font-poppins text-brand-mid mb-2">Card Layout</label>
                      <select
                        value={formData.layoutStyle}
                        onChange={(e) => setFormData({ ...formData, layoutStyle: e.target.value })}
                        className="w-full px-4 py-2.5 bg-black/50 border border-brand-lightgray rounded focus:border-brand-orange text-brand-dark outline-none font-poppins text-sm appearance-none"
                      >
                        <option value="classic">Classic</option>
                        <option value="modern">Modern (Rounded)</option>
                        <option value="minimal">Minimalist (No Borders)</option>
                      </select>
                    </div>
                    {/* Text Alignment */}
                    <div>
                      <label className="block text-sm font-poppins text-brand-mid mb-2">Text Alignment</label>
                      <select
                        value={formData.textAlignment}
                        onChange={(e) => setFormData({ ...formData, textAlignment: e.target.value })}
                        className="w-full px-4 py-2.5 bg-black/50 border border-brand-lightgray rounded focus:border-brand-orange text-brand-dark outline-none font-poppins text-sm appearance-none"
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="justify">Justify</option>
                      </select>
                    </div>
                    {/* Cover Image Pos */}
                    <div>
                      <label className="block text-sm font-poppins text-brand-mid mb-2">Cover Position</label>
                      <select
                        value={formData.coverImagePosition}
                        onChange={(e) => setFormData({ ...formData, coverImagePosition: e.target.value })}
                        className="w-full px-4 py-2.5 bg-black/50 border border-brand-lightgray rounded focus:border-brand-orange text-brand-dark outline-none font-poppins text-sm appearance-none"
                      >
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Featured Toggle */}
                    <div className="flex items-center justify-between p-4 rounded border border-brand-lightgray bg-black/30">
                      <div>
                        <label className="block text-sm font-poppins font-medium text-brand-dark">Featured Highlight</label>
                        <p className="text-xs text-brand-mid mt-1">Make this post span 2 columns to stand out.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        />
                        <div className="w-11 h-6 bg-[#333] border border-[#555] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-orange peer-checked:border-brand-orange"></div>
                      </label>
                    </div>

                    {/* Entrance Animation */}
                    <div>
                      <label className="block text-sm font-poppins text-brand-mid mb-2">Entrance Animation</label>
                      <select
                        value={formData.entranceAnimation}
                        onChange={(e) => setFormData({ ...formData, entranceAnimation: e.target.value })}
                        className="w-full px-4 py-2.5 bg-black/50 border border-brand-lightgray rounded focus:border-brand-orange text-brand-dark outline-none font-poppins text-sm appearance-none"
                      >
                        <option value="fadeInUp">Fade In Up (Classic)</option>
                        <option value="zoomIn">Zoom In (Bounce)</option>
                        <option value="slideRight">Slide Right</option>
                        <option value="flip">3D Flip</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <div className="relative group w-full">
                    <div 
                      className="absolute inset-0 blur-xl opacity-50 transition-all duration-300 group-hover:opacity-80 group-hover:blur-2xl rounded"
                      style={{ backgroundColor: "var(--brand-accent)" }}
                    ></div>
                    <button
                      type="submit"
                      className="relative w-full bg-[#0a0a0a] text-white font-poppins font-medium py-3.5 px-4 rounded transition-all duration-300 hover:scale-[1.02]"
                    >
                      Publish Post
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-brand-mid font-lora text-lg italic">No stories published yet. Be the first.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 auto-rows-fr">
            {blogs.map((blog, index) => {
              const animClass = animationClasses[blog.entranceAnimation] || animationClasses.fadeInUp;
              return (
              <div
                id={`blog-${blog._id}`}
                key={blog._id}
                className={`transition-opacity duration-300 origin-center ${animClass} ${blog.isFeatured ? 'md:col-span-2' : ''}`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <BlogCard
                  {...blog}
                  titleColor={blog.titleColor || "#f9fafb"}
                  onLike={() => handleLikeBlog(blog._id)}
                  onDelete={() => handleDelete(blog._id)}
                  onRead={() => setSelectedBlog(blog)}
                />
              </div>
              );
            })}
          </div>
        )}

        {/* Global Settings Button (Floating Bottom Right) */}
        <button
          onClick={() => {
            if (settings) setSettingsData({ ...settings });
            setShowSettings(true);
          }}
          className="fixed bottom-6 right-6 w-14 h-14 bg-brand-surface border border-brand-lightgray shadow-xl rounded-full flex items-center justify-center text-brand-mid hover:text-brand-orange hover:border-brand-orange/50 hover:shadow-[0_0_20px_rgb(217,119,87,0.2)] transition-all duration-300 z-40 group hover:scale-110"
          aria-label="Site Settings"
        >
          <svg className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        </button>

        {/* Global Settings Modal/Overlay */}
        {showSettings && settingsData && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md transition-all duration-300 animate-fadeIn">
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-brand-surface p-8 md:p-10 rounded-2xl shadow-2xl border border-brand-lightgray transform transition-all animate-fadeInUp">
              <button 
                onClick={() => setShowSettings(false)} 
                className="absolute top-6 right-6 p-2 text-brand-mid hover:text-brand-dark hover:bg-brand-light rounded-full transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              
              <div className="flex flex-col mb-8">
                <h2 className="text-3xl font-poppins font-semibold text-brand-dark">Site Configuration</h2>
                <p className="text-brand-mid mt-2 font-poppins text-sm">Customize your blog's identity globally. No code changes required.</p>
              </div>
              
              <form onSubmit={handleSaveSettings} className="space-y-8">
                
                {/* 1. Hero Identity */}
                <div className="space-y-4">
                  <h3 className="text-lg font-poppins font-medium text-brand-orange border-b border-brand-lightgray pb-2">1. The Hero Section</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-poppins text-brand-mid mb-2">Badge Text</label>
                      <input type="text" value={settingsData.heroBadge} onChange={(e) => setSettingsData({...settingsData, heroBadge: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-brand-lightgray rounded focus:border-brand-orange text-brand-dark outline-none font-poppins" />
                    </div>
                    <div>
                      <label className="block text-sm font-poppins text-brand-mid mb-2">Main Title Text</label>
                      <input type="text" value={settingsData.heroTitle} onChange={(e) => setSettingsData({...settingsData, heroTitle: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-brand-lightgray rounded focus:border-brand-orange text-brand-dark outline-none font-poppins" />
                    </div>
                    
                    <div className="md:col-span-2 flex items-center gap-4 border p-4 rounded border-brand-lightgray bg-black/30">
                      <div>
                        <label className="block text-sm font-poppins text-brand-mid mb-1">Title Text Color</label>
                        <p className="text-xs text-brand-mid">Customize the display color of the infinite insights headline.</p>
                      </div>
                      <div className="ml-auto flex h-[42px] rounded border border-brand-lightgray bg-brand-light overflow-hidden pr-2">
                        <input type="color" value={settingsData.heroTitleColor || "#f9fafb"} onChange={(e) => setSettingsData({...settingsData, heroTitleColor: e.target.value})} className="h-[50px] w-12 cursor-pointer border-0 p-0 -mt-1 -ml-1 bg-transparent" />
                        <span className="flex items-center pl-2 text-sm text-brand-mid font-poppins uppercase">{settingsData.heroTitleColor || "#f9fafb"}</span>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                       <label className="block text-sm font-poppins text-brand-mid mb-2">Description</label>
                       <textarea value={settingsData.heroDescription} onChange={(e) => setSettingsData({...settingsData, heroDescription: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-brand-lightgray rounded focus:border-brand-orange text-brand-dark outline-none font-poppins h-20 resize-none" />
                    </div>
                    
                    <div className="md:col-span-2 relative">
                      <label className="block text-sm font-poppins text-brand-mid mb-2">Hero Typography Font</label>
                      <button type="button" className="w-full px-4 py-2.5 bg-black/50 border border-brand-lightgray rounded text-brand-dark outline-none font-poppins text-left flex justify-between items-center" onClick={() => setShowHeroFontDropdown(!showHeroFontDropdown)}>
                        <span>{settingsData.heroFont === "var(--font-poppins)" ? "Poppins (Brand Standard)" : settingsData.heroFont === "var(--font-lora)" ? "Lora" : settingsData.heroFont}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                      </button>
                      {showHeroFontDropdown && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-[#171717] border border-[#333] shadow-2xl rounded py-1 z-[70] max-h-48 overflow-y-auto">
                          {fonts.map(f => (
                            <button 
                              key={f} 
                              type="button" 
                              onClick={() => { setSettingsData({...settingsData, heroFont: f}); setShowHeroFontDropdown(false); }} 
                              className="w-full text-left px-4 py-2 hover:bg-white/5 text-brand-dark font-poppins text-sm"
                              style={{ fontFamily: f === "var(--font-poppins)" ? "var(--font-poppins)" : f === "var(--font-lora)" ? "var(--font-lora)" : f }}
                            >
                              {f === "var(--font-poppins)" ? "Poppins (Brand Standard)" : f === "var(--font-lora)" ? "Lora" : f}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Global Colors */}
                <div className="space-y-4">
                  <h3 className="text-lg font-poppins font-medium text-brand-orange border-b border-brand-lightgray pb-2">2. Global Theme Colors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-poppins text-brand-mid mb-2">Site Background Layer</label>
                      <div className="flex h-[42px] rounded border border-brand-lightgray bg-brand-light overflow-hidden pr-2">
                        <input type="color" value={settingsData.siteBackground} onChange={(e) => setSettingsData({...settingsData, siteBackground: e.target.value})} className="h-[50px] w-12 cursor-pointer border-0 p-0 -mt-1 -ml-1 bg-transparent" />
                        <span className="flex items-center pl-2 text-sm text-brand-mid font-poppins uppercase">{settingsData.siteBackground}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-poppins text-brand-mid mb-2">Primary Accent Color (Buttons/Hover)</label>
                      <div className="flex h-[42px] rounded border border-brand-lightgray bg-brand-light overflow-hidden pr-2">
                        <input type="color" value={settingsData.primaryAccent} onChange={(e) => setSettingsData({...settingsData, primaryAccent: e.target.value})} className="h-[50px] w-12 cursor-pointer border-0 p-0 -mt-1 -ml-1 bg-transparent" />
                        <span className="flex items-center pl-2 text-sm text-brand-mid font-poppins uppercase">{settingsData.primaryAccent}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Author Defaults */}
                <div className="space-y-4">
                  <h3 className="text-lg font-poppins font-medium text-brand-orange border-b border-brand-lightgray pb-2">3. Default Author Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-poppins text-brand-mid mb-2">Author Name</label>
                      <input type="text" value={settingsData.defaultAuthorName} onChange={(e) => setSettingsData({...settingsData, defaultAuthorName: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-brand-lightgray rounded focus:border-brand-orange text-brand-dark outline-none font-poppins" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-poppins text-brand-mid mb-2">Avatar URL</label>
                      <input type="url" value={settingsData.defaultAvatarUrl} onChange={(e) => setSettingsData({...settingsData, defaultAvatarUrl: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-brand-lightgray rounded focus:border-brand-orange text-brand-dark outline-none font-poppins" placeholder="https://..." />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="relative group w-full">
                    <div 
                      className="absolute inset-0 blur-xl opacity-50 transition-all duration-300 group-hover:opacity-80 group-hover:blur-2xl rounded"
                      style={{ backgroundColor: "var(--brand-accent)" }}
                    ></div>
                    <button type="submit" 
                      className="relative w-full bg-[#0a0a0a] text-white font-poppins font-medium py-3.5 px-4 rounded transition-all duration-300 hover:scale-[1.02]"
                    >
                      Save Global Configuration
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Selected Blog Reading Modal */}
        {selectedBlog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-lg animate-fadeIn">
            <div className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto bg-brand-light rounded-2xl shadow-2xl border border-brand-lightgray transform transition-all animate-zoomIn">
              <button 
                onClick={() => setSelectedBlog(null)} 
                className="absolute top-6 right-6 p-2 text-brand-mid hover:text-white hover:bg-white/10 rounded-full transition-colors z-20"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              
              {selectedBlog.image && (
                <div className="relative w-full h-64 md:h-80 lg:h-96">
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-light to-transparent z-10" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className={`px-8 py-10 md:px-12 md:py-16 mx-auto ${selectedBlog.image ? '-mt-24 relative z-10' : ''}`}>
                <div className="mb-8 flex flex-col items-center text-center">
                  <h1 
                    className="text-4xl md:text-5xl font-poppins font-bold mb-6 tracking-tight leading-tight"
                    style={{ color: selectedBlog.titleColor || '#f9fafb' }}
                  >
                    {selectedBlog.title}
                  </h1>
                  
                  <div className="flex items-center gap-4 text-brand-mid text-sm font-poppins font-medium">
                    <div className="flex items-center gap-2">
                      {selectedBlog.avatarUrl ? (
                         // eslint-disable-next-line @next/next/no-img-element
                        <img src={selectedBlog.avatarUrl} alt="author" className="w-8 h-8 rounded-full shadow-sm" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-brand-orange/20 text-brand-orange border-brand-orange/50 flex items-center justify-center border">{selectedBlog.author.charAt(0)}</div>
                      )}
                      <span className="text-white">{selectedBlog.author}</span>
                    </div>
                    {selectedBlog.category && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-brand-lightgray" />
                        <span className="uppercase tracking-widest text-[#f59e0b]">{selectedBlog.category}</span>
                      </>
                    )}
                    <span className="w-1 h-1 rounded-full bg-brand-lightgray" />
                    <span>{selectedBlog.readingTime || 5} MIN READ</span>
                  </div>
                </div>
                
                <div className="w-12 h-1 bg-brand-orange mx-auto mb-12 rounded-full opacity-50"></div>
                
                <div 
                  className="prose prose-lg prose-invert text-white/80 max-w-3xl mx-auto leading-relaxed"
                  style={{ 
                    fontFamily: selectedBlog.contentFont === 'Arial' ? 'var(--font-lora)' : selectedBlog.contentFont,
                    textAlign: selectedBlog.textAlignment as any || 'left'
                  }}
                >
                  {selectedBlog.content.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-6">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}