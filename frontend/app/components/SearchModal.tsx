import React, { useState, useEffect, useRef } from "react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Array<{ _id: string; title: string; category?: string; tags?: string[] }>;
  onSelect: (id: string) => void;
}

export function SearchModal({ isOpen, onClose, items, onSelect }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category?.toLowerCase().includes(query.toLowerCase()) ||
      item.tags?.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 8); // Limit results for speed

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSelectedIndex(0);
      setQuery("");
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      onSelect(filteredItems[selectedIndex]._id);
      onClose();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-brand-surface border border-brand-lightgray rounded-2xl shadow-2xl overflow-hidden animate-zoomIn"
        onKeyDown={handleKeyDown}
      >
        <div className="relative flex items-center p-4 border-b border-brand-lightgray">
          <svg className="w-5 h-5 text-brand-mid mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent text-lg text-brand-dark outline-none font-poppins placeholder:text-brand-mid/50"
            placeholder="Search stories, categories, or tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="px-2 py-1 rounded bg-black/30 border border-brand-lightgray text-[10px] text-brand-mid font-mono">
            ESC
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {filteredItems.length > 0 ? (
            <div className="p-2">
              {filteredItems.map((item, index) => (
                <button
                  key={item._id}
                  onClick={() => {
                    onSelect(item._id);
                    onClose();
                  }}
                  className={`w-full flex items-center p-4 rounded-xl transition-all duration-200 ${
                    index === selectedIndex
                      ? "bg-brand-orange/10 border border-brand-orange/20"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                    index === selectedIndex ? "bg-brand-orange text-white" : "bg-black/40 text-brand-mid"
                  }`}>
                    {item.category === "Thinking" ? "💡" : "✍️"}
                  </div>
                  <div className="flex flex-col items-start flex-1 text-left">
                    <span className={`font-poppins font-medium ${index === selectedIndex ? "text-brand-orange" : "text-brand-dark"}`}>
                      {item.title}
                    </span>
                    <span className="text-xs text-brand-mid mt-0.5">{item.category} • {item.tags?.join(", ")}</span>
                  </div>
                  {index === selectedIndex && (
                    <span className="text-brand-orange animate-pulse">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : query ? (
            <div className="p-12 text-center">
              <p className="text-brand-mid font-poppins">No thoughts found for &quot;{query}&quot;</p>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-brand-mid font-poppins uppercase tracking-widest opacity-50">
              Type to search...
            </div>
          )}
        </div>

        <div className="p-3 bg-black/40 border-t border-brand-lightgray flex items-center justify-between text-[10px] text-brand-mid font-poppins">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 rounded bg-black border border-brand-lightgray">↑↓</span> Navigate</span>
            <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 rounded bg-black border border-brand-lightgray">ENTER</span> Select</span>
          </div>
          <span>INFINITY SEARCH</span>
        </div>
      </div>
    </div>
  );
}
