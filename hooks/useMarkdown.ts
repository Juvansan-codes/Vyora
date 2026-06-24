'use client';

import { useMemo } from 'react';

/**
 * Lightweight markdown-to-HTML renderer.
 * Handles: headings, bold, italic, code blocks, inline code,
 * unordered lists, ordered lists, links, and horizontal rules.
 * No heavy dependencies needed.
 */
export function useMarkdown(text: string): string {
  return useMemo(() => renderMarkdown(text), [text]);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderMarkdown(text: string): string {
  if (!text) return '';

  let html = text;

  // Code blocks (``` ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
    return `<pre class="chat-code-block"><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Process line by line for block elements
  const lines = html.split('\n');
  const result: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Skip lines inside code blocks (already processed)
    if (line.includes('<pre class="chat-code-block">')) {
      // Pass through pre blocks as-is
      let preBlock = line;
      while (!line.includes('</pre>') && i < lines.length - 1) {
        i++;
        line = lines[i];
        preBlock += '\n' + line;
      }
      if (inList) {
        result.push(listType === 'ol' ? '</ol>' : '</ul>');
        inList = false;
        listType = null;
      }
      result.push(preBlock);
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      if (inList) {
        result.push(listType === 'ol' ? '</ol>' : '</ul>');
        inList = false;
        listType = null;
      }
      result.push('<hr class="chat-hr" />');
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,4})\s+(.+)/);
    if (headingMatch) {
      if (inList) {
        result.push(listType === 'ol' ? '</ol>' : '</ul>');
        inList = false;
        listType = null;
      }
      const level = headingMatch[1].length;
      const content = processInline(headingMatch[2]);
      result.push(`<h${level} class="chat-h${level}">${content}</h${level}>`);
      continue;
    }

    // Unordered list items
    const ulMatch = line.match(/^[\s]*[-*]\s+(.+)/);
    if (ulMatch) {
      if (!inList || listType !== 'ul') {
        if (inList) result.push(listType === 'ol' ? '</ol>' : '</ul>');
        result.push('<ul class="chat-ul">');
        inList = true;
        listType = 'ul';
      }
      result.push(`<li>${processInline(ulMatch[1])}</li>`);
      continue;
    }

    // Ordered list items
    const olMatch = line.match(/^[\s]*(\d+)\.\s+(.+)/);
    if (olMatch) {
      if (!inList || listType !== 'ol') {
        if (inList) result.push(listType === 'ol' ? '</ol>' : '</ul>');
        result.push('<ol class="chat-ol">');
        inList = true;
        listType = 'ol';
      }
      result.push(`<li>${processInline(olMatch[2])}</li>`);
      continue;
    }

    // Close any open list
    if (inList && line.trim() === '') {
      result.push(listType === 'ol' ? '</ol>' : '</ul>');
      inList = false;
      listType = null;
      result.push('<br />');
      continue;
    }

    if (inList) {
      result.push(listType === 'ol' ? '</ol>' : '</ul>');
      inList = false;
      listType = null;
    }

    // Empty line
    if (line.trim() === '') {
      result.push('<br />');
      continue;
    }

    // Regular paragraph
    result.push(`<p class="chat-p">${processInline(line)}</p>`);
  }

  // Close any remaining open list
  if (inList) {
    result.push(listType === 'ol' ? '</ol>' : '</ul>');
  }

  return result.join('\n');
}

function processInline(text: string): string {
  let result = text;

  // Inline code
  result = result.replace(/`([^`]+)`/g, '<code class="chat-inline-code">$1</code>');

  // Bold + italic
  result = result.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');

  // Bold
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Links
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-link">$1</a>'
  );

  // Emoji shorthand (keep as-is, they render natively)

  return result;
}
