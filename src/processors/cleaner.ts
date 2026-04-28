import { TranscriptLine, Config } from '../types';

export function cleanTranscript(lines: TranscriptLine[], config: Config): TranscriptLine[] {
  let result: TranscriptLine[] = [];
  let previousText = '';

  for (let i = 0; i < lines.length; i++) {
    let text = lines[i].text.trim();

    // Remove duplicates
    if (config.removeDuplicates && text === previousText) {
      continue;
    }
    previousText = text;

    // Remove filler words
    if (config.removeFillerWords && config.fillerWords.length > 0) {
      const regex = new RegExp(`\\b(${config.fillerWords.join('|')})\\b`, 'gi');
      text = text.replace(regex, '').replace(/\s+/g, ' ').trim();
    }

    if (!text) continue;

    // Merge short lines
    if (config.mergeShortLines && result.length > 0) {
      const lastLine = result[result.length - 1];
      // Basic heuristic: if the previous line doesn't end with punctuation, or if it's very short.
      const endsWithPunctuation = /[.!?]$/.test(lastLine.text.trim());
      if (!endsWithPunctuation || lastLine.text.split(' ').length < 5) {
        lastLine.text += ' ' + text;
        if (lines[i].end !== undefined) {
          lastLine.end = lines[i].end;
        }
        continue;
      }
    }

    result.push({ ...lines[i], text });
  }

  return result;
}

export function compileCleanText(lines: TranscriptLine[]): string {
  return lines.map(l => l.text).join('\n\n');
}
