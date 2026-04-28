import { TimeMapSegment, KeywordData } from '../types';

export function generateQuarto(title: string, map: TimeMapSegment[], keywords: KeywordData[]): string {
  let md = `---
title: "Learning Guide: ${title}"
format: html
---

## Video Overview
Provide a brief summary of what this video covers.

## Before Watching
- What do you already know about this topic?
- Review the Key Terms below to familiarise yourself with the vocabulary.

## While Watching
Pay attention to the following sections:

### Timestamped Guide
`;

  if (map.length > 0) {
    for (const seg of map) {
      const startStr = formatTime(seg.start);
      md += `- **[${startStr}]** Segment ${seg.segmentNumber}\n`;
      md += `  > ${truncate(seg.excerpt, 150)}\n`;
    }
  } else {
    md += "_No timestamps available._\n";
  }

  md += `
## Key Terms
`;
  if (keywords.length > 0) {
    const terms = keywords.slice(0, 15).map(k => k.word).join(', ');
    md += `${terms}\n`;
  } else {
    md += "_No key terms extracted._\n";
  }

  md += `
## After Watching
- Did the video clarify any concepts you were unsure about?
- How does this relate to the broader topic?

## Reflection Prompt
Write a short paragraph summarising the most important takeaway from this video.
`;

  return md;
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}
