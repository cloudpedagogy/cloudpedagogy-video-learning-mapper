import { TranscriptLine, Config, TimeMapSegment } from '../types';

export function generateTimeMap(lines: TranscriptLine[], config: Config): TimeMapSegment[] {
  const segmentLengthSeconds = config.segmentLengthMinutes * 60;
  const segments: TimeMapSegment[] = [];
  
  if (lines.length === 0) return segments;

  let currentSegment: Partial<TimeMapSegment> = {
    start: lines[0].start || 0,
    segmentNumber: 1,
    excerpt: '',
    wordCount: 0
  };

  let currentExcerptText = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineTime = line.start !== undefined ? line.start : (currentSegment.start as number);
    
    // Check if we've crossed the boundary
    if (lineTime - (currentSegment.start as number) >= segmentLengthSeconds && currentExcerptText.length > 0) {
      currentSegment.end = lineTime;
      currentSegment.excerpt = currentExcerptText.trim();
      currentSegment.wordCount = currentExcerptText.split(/\s+/).filter(w => w.length > 0).length;
      segments.push(currentSegment as TimeMapSegment);
      
      currentSegment = {
        start: lineTime,
        segmentNumber: segments.length + 1,
        excerpt: '',
        wordCount: 0
      };
      currentExcerptText = '';
    }

    currentExcerptText += line.text + ' ';
    if (line.end !== undefined) {
       // Best guess for end time if the loop finishes
       currentSegment.end = line.end;
    }
  }

  // Push the last segment if there's leftover text
  if (currentExcerptText.trim().length > 0) {
    if (!currentSegment.end) {
      currentSegment.end = (currentSegment.start as number) + segmentLengthSeconds; // Fallback
    }
    currentSegment.excerpt = currentExcerptText.trim();
    currentSegment.wordCount = currentExcerptText.split(/\s+/).filter(w => w.length > 0).length;
    segments.push(currentSegment as TimeMapSegment);
  }

  // If no lines had timestamps, we just have one big block.
  // We can try to proportionally chunk it if we want, but for now
  // it gracefully handles it by putting everything in one segment.

  return segments;
}
