import { TranscriptLine, VideoSegment } from '../types';

export function detectSegments(lines: TranscriptLine[]): VideoSegment[] {
  const segments: VideoSegment[] = [];
  
  const cuePhrases = ["next", "now", "in summary", "to recap", "moving on", "finally"];
  const regex = new RegExp(`\\b(${cuePhrases.join('|')})\\b`, 'i');

  let currentSegment: Partial<VideoSegment> = {
    start: lines.length > 0 ? lines[0].start || 0 : 0,
    text: '',
    wordCount: 0
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.text.match(regex);

    if (match && currentSegment.text && currentSegment.text.length > 50) {
      // End current segment
      currentSegment.end = line.start || (currentSegment.start as number) + 60; // fallback
      segments.push(currentSegment as VideoSegment);

      // Start new segment
      currentSegment = {
        start: line.start || currentSegment.end,
        text: line.text + ' ',
        cuePhrase: match[0].toLowerCase(),
        wordCount: line.text.split(/\s+/).filter(w => w.length > 0).length
      };
    } else {
      currentSegment.text += line.text + ' ';
      currentSegment.wordCount = (currentSegment.wordCount || 0) + line.text.split(/\s+/).filter(w => w.length > 0).length;
    }
  }

  if (currentSegment.text && currentSegment.text.trim().length > 0) {
    currentSegment.end = lines[lines.length - 1].end || (currentSegment.start as number) + 60;
    segments.push(currentSegment as VideoSegment);
  }

  return segments;
}
