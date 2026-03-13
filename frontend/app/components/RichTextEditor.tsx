"use client";

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import React from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const buttons = [
    { label: 'B', action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), title: 'Bold' },
    { label: 'I', action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), title: 'Italic' },
    { label: 'H1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }), title: 'Heading 1' },
    { label: 'H2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }), title: 'Heading 2' },
    { label: 'Bullet', action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList'), title: 'Bullet List' },
    { label: 'Quote', action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote'), title: 'Blockquote' },
    { label: 'Code', action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive('codeBlock'), title: 'Code Block' },
  ];

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-brand-lightgray bg-black/40 backdrop-blur-md sticky top-0 z-10 rounded-t-xl transition-all duration-300">
      {buttons.map((btn) => (
        <button
          key={btn.label}
          onClick={(e) => {
            e.preventDefault();
            btn.action();
          }}
          title={btn.title}
          className={`px-3 py-1.5 rounded-lg text-sm font-poppins transition-all duration-200 ${
            btn.active 
              ? 'bg-brand-orange text-white shadow-[0_0_15px_rgba(217,119,87,0.3)]' 
              : 'text-brand-mid hover:bg-white/5 hover:text-brand-dark'
          }`}
        >
          {btn.label === 'Bullet' ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
          ) : btn.label === 'Quote' ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
          ) : btn.label === 'Code' ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
          ) : (
            btn.label
          )}
        </button>
      ))}
      <div className="flex-1" />
      <button
        onClick={(e) => {
           e.preventDefault();
           editor.chain().focus().setHighlight().run();
        }}
        className={`p-1.5 rounded-lg text-brand-mid hover:bg-white/5 hover:text-brand-dark transition-all duration-200 ${editor.isActive('highlight') ? 'text-brand-orange' : ''}`}
        title="Highlight"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
      </button>
    </div>
  );
};

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || 'Start writing your thought...',
      }),
      TextStyle,
      Color,
      Highlight,
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] px-6 py-6 text-brand-dark leading-relaxed font-lora',
      },
    },
  });

  // Handle outside content updates (e.g. when editing a blog)
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="w-full bg-black/40 border border-brand-lightgray rounded-xl overflow-hidden focus-within:border-brand-orange/50 transition-all duration-300">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
