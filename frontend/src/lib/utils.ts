import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stripMarkdown(markdown: string): string {
  if (!markdown) return ""

  return markdown
    // Remove code blocks (```)
    .replace(/```[\s\S]*?```/g, "")
    // Remove inline code (`code`)
    .replace(/`([^`]+)`/g, "$1")
    // Remove images (![alt](url))
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    // Remove links ([text](url))
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove reference-style links ([text][ref])
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, "$1")
    // Remove bold (**text** or __text__)
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    // Remove italic (*text* or _text_)
    .replace(/(\*|_)(.*?)\1/g, "$2")
    // Remove strikethrough (~~text~~)
    .replace(/~~(.*?)~~/g, "$1")
    // Remove headers (# ## ### etc)
    .replace(/^#{1,6}\s+/gm, "")
    // Remove horizontal rules (---, ***, ___)
    .replace(/^(-{3,}|\*{3,}|_{3,})$/gm, "")
    // Remove blockquotes (>)
    .replace(/^>\s+/gm, "")
    // Remove unordered list markers (-, *, +)
    .replace(/^[\s]*[-*+]\s+/gm, "")
    // Remove ordered list markers (1. 2. etc)
    .replace(/^[\s]*\d+\.\s+/gm, "")
    // Remove HTML tags
    .replace(/<[^>]+>/g, "")
    // Remove extra whitespace and newlines
    .replace(/\n{2,}/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
}
