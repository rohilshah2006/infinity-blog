import React, { useState } from "react";
import Image from "next/image";

interface BlogCardProps {
  title: string;
  content: string;
  author: string;
  backgroundColor: string;
  image: string | null;
  contentFont: string;
  tags?: string[];
  category?: string;
  excerpt?: string;
  readingTime?: number;
  textAlignment?: string;
  layoutStyle?: string;
  avatarUrl?: string;
  coverImagePosition?: string;
  likes?: number;
  isFeatured?: boolean;
  entranceAnimation?: string;
  titleColor?: string;
  onLike?: () => void;
  onRead?: () => void;
  onDelete: () => void;
}

export default function BlogCard({
  title = "Untitled",
  content = "No content available.",
  author = "Anonymous",
  backgroundColor = "#faf9f5",
  image = null,
  contentFont = "Arial",
  tags = [],
  category = "Thinking",
  excerpt = "",
  readingTime = 5,
  textAlignment = "left",
  layoutStyle = "classic",
  avatarUrl = "",
  coverImagePosition = "top",
  likes = 0,
  isFeatured = false,
  entranceAnimation = "fadeInUp",
  titleColor = "#171717",
  onLike,
  onRead,
  onDelete,
}: BlogCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [localLikes, setLocalLikes] = useState(likes);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = () => {
    if (isLiking) return;
    setIsLiking(true);
    setLocalLikes(prev => prev + 1);
    if (onLike) onLike();
    setTimeout(() => setIsLiking(false), 1000);
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete();
    }, 400); // Matched with transition duration
  };

  const appliedFont = contentFont === "Arial" ? "var(--font-lora)" : contentFont;

  // Layout resolution
  let containerClasses = "group flex h-full transform transition-all duration-500 ease-out overflow-hidden relative";
  
  if (layoutStyle === "classic") {
    containerClasses += " rounded-2xl shadow-subtle hover:shadow-subtle-hover border border-brand-lightgray hover:-translate-y-1.5";
  } else if (layoutStyle === "modern") {
    containerClasses += " rounded-[2.5rem] shadow-lg hover:shadow-2xl hover:-translate-y-2 border-none ring-1 ring-black/5";
  } else if (layoutStyle === "minimal") {
    containerClasses += " rounded-none border-b-2 border-transparent hover:border-brand-dark shadow-none hover:-translate-y-1 bg-transparent";
  }

  // Cover image position
  const flexDir = coverImagePosition === "bottom" ? "flex-col-reverse" : "flex-col";
  
  // Text alignment
  const textAlignClass = textAlignment === "center" ? "text-center items-center" 
                       : textAlignment === "justify" ? "text-justify items-start" 
                       : "text-left items-start";

  // External container width control for featured items
  const featuredClass = isFeatured ? "md:col-span-2" : "";

  return (
    <div
      className={`${containerClasses} ${flexDir} ${featuredClass} ${isDeleting ? "opacity-0 scale-90" : "opacity-100"}`}
      style={{ 
        backgroundColor: layoutStyle === "minimal" ? "transparent" : (backgroundColor !== "#ffffff" ? backgroundColor : "#ffffff"),
        boxShadow: isFeatured ? "0 0 20px 2px var(--brand-accent)" : undefined,
        borderColor: isFeatured ? "var(--brand-accent)" : undefined,
        borderWidth: isFeatured ? "2px" : undefined,
        borderStyle: isFeatured ? "solid" : undefined
      }}
    >
      {/* Cover Image Container */}
      <div className={`relative overflow-hidden w-full ${layoutStyle === "minimal" ? (isFeatured ? "aspect-[21/9] md:aspect-[24/9]" : "aspect-[16/9]") : (isFeatured ? "pt-[65%] md:pt-[35%]" : "pt-[65%]")} bg-brand-lightgray/30 z-10 ${layoutStyle === "minimal" ? "rounded-2xl mb-6 shadow-sm group-hover:shadow-md transition-shadow" : ""}`}>
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:rotate-1"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-mid/50 font-poppins text-sm bg-gradient-to-br from-brand-light to-brand-lightgray group-hover:scale-105 transition-transform duration-700">
            <svg className="w-8 h-8 opacity-40 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            No Cover
          </div>
        )}
        
        {/* Abstract Gradient Overlay for Modern Layout */}
        {layoutStyle === "modern" && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 mix-blend-multiply pointer-events-none"></div>
        )}
        
        <button
          onClick={handleDelete}
          className="absolute top-4 right-4 w-10 h-10 bg-brand-surface/90 backdrop-blur-md shadow-sm rounded-full flex items-center justify-center text-brand-mid hover:text-red-500 hover:bg-brand-surface transition-all duration-300 z-20 opacity-0 group-hover:opacity-100 hover:scale-110"
          aria-label="Delete Blog Post"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
        
        {/* Floating Category Badge */}
        {category && layoutStyle !== "minimal" && (
          <div className="absolute top-4 left-4 px-3.5 py-1.5 bg-brand-surface/90 backdrop-blur-md shadow-sm rounded-full text-[10px] tracking-widest uppercase font-poppins font-medium text-brand-dark z-20">
            {category}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className={`flex flex-col flex-grow ${layoutStyle === "minimal" ? "p-1" : "p-6 md:p-8"} ${textAlignClass} relative z-20`}>
        
        {/* Minimal layout specific category/time */}
        {layoutStyle === "minimal" && (
          <div className={`flex items-center gap-3 mb-4 text-[11px] font-poppins font-medium tracking-widest text-brand-mid w-full ${textAlignment === 'center' ? 'justify-center' : ''}`}>
            {category && <span className="text-brand-orange uppercase">{category}</span>}
            {category && <span className="w-1 h-1 rounded-full bg-brand-lightgray"></span>}
            <span>{readingTime} MIN READ</span>
          </div>
        )}

        {/* Title */}
        <h2 
          className={`text-2xl md:text-[1.7rem] font-poppins font-bold leading-snug mb-4 line-clamp-2 ${layoutStyle === "modern" ? "tracking-tight" : ""}`}
          style={{ color: titleColor }}
        >
          {title}
        </h2>
        
        {/* Excerpt or Content Snippet */}
        <p
          className={`text-brand-dark/70 text-base leading-relaxed flex-grow line-clamp-3 mb-6 ${layoutStyle === "minimal" ? "text-[1.1rem] font-light" : ""}`}
          style={{ fontFamily: appliedFont }}
        >
          {excerpt || content}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className={`flex flex-wrap gap-2 mb-8 ${textAlignment === 'center' ? 'justify-center' : ''} w-full`}>
            {tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2.5 py-1 bg-brand-lightgray/50 text-brand-dark text-[10px] uppercase tracking-wider font-poppins font-semibold rounded-[4px] border border-brand-lightgray/40">
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2.5 py-1 text-brand-mid text-[10px] font-poppins font-semibold">+{tags.length - 3}</span>
            )}
          </div>
        )}
        
        {/* Footer info (Author & Reading Time) */}
        <div className={`mt-auto pt-6 border-t ${layoutStyle === "minimal" ? "border-brand-dark/10" : "border-brand-lightgray/60"} flex items-center justify-between w-full`}>
          <div className="flex items-center gap-3">
             {avatarUrl ? (
               <div className="relative w-10 h-10 rounded-full overflow-hidden border border-brand-lightgray hidden sm:block shrink-0 shadow-sm">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={avatarUrl} alt={author} className="w-full h-full object-cover" />
               </div>
             ) : (
               <div className={`w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center font-poppins font-bold text-sm hidden sm:flex shrink-0 shadow-sm border border-brand-orange/10 text-brand-orange`}>
                 {author.charAt(0).toUpperCase()}
               </div>
             )}
            <div className={`flex flex-col ${textAlignment === 'right' ? 'items-end' : 'items-start'}`}>
              <p className="text-sm font-poppins font-semibold text-brand-dark tracking-tight">
                {author}
              </p>
              {layoutStyle !== "minimal" && (
                <p className="text-xs font-poppins text-brand-mid mt-0.5 font-medium">
                  {readingTime} min read
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Interactive Like Button */}
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ${isLiking || localLikes > likes ? 'scale-110 text-brand-orange' : 'text-brand-mid hover:text-brand-orange'}`}
              style={{ backgroundColor: (isLiking || localLikes > likes) ? 'rgba(255,255,255,0.05)' : 'transparent' }}
            >
              <svg className={`w-4 h-4 transition-colors ${isLiking || localLikes > likes ? 'fill-current stroke-current' : 'fill-none stroke-current'}`} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              <span className="text-xs font-poppins font-semibold">{localLikes}</span>
            </button>

            {/* Read Button */}
            <div className="relative group/btn ml-2">
              <div 
                className="absolute inset-0 blur-md opacity-40 transition-all duration-300 group-hover/btn:opacity-70 group-hover/btn:blur-lg rounded-full"
                style={{ backgroundColor: "var(--brand-accent)" }}
              ></div>
              <button 
                onClick={() => onRead && onRead()}
                className="relative flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0a0a0a] text-white transition-all duration-300 hover:scale-105"
              >
                <span className="text-[11px] uppercase tracking-wider font-poppins font-bold">Read</span>
                <svg className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 transition-transform text-brand-orange" style={{ color: "var(--brand-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}