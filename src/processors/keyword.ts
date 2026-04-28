import { TranscriptLine, Config, KeywordData } from '../types';

export function extractKeywords(lines: TranscriptLine[], config: Config): KeywordData[] {
  const words: Record<string, number> = {};
  
  const stopSet = new Set(config.stopwords.map(w => w.toLowerCase()));

  for (const line of lines) {
    const tokens = line.text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    for (const token of tokens) {
      if (!stopSet.has(token)) {
        words[token] = (words[token] || 0) + 1;
      }
    }
  }

  const sorted: KeywordData[] = Object.keys(words)
    .map(word => ({ word, count: words[word] }))
    .sort((a, b) => b.count - a.count);

  return sorted.slice(0, 50); // Top 50
}
