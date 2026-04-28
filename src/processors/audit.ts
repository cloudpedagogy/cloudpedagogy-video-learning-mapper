import { FileData, AuditResult } from '../types';
import { generateTimeMap } from './mapper';

export function runAudit(files: FileData[], config: any): AuditResult[] {
  return files.map(file => {
    const lines = file.lines;
    const issues: string[] = [];

    const hasTimestamps = lines.some(l => l.start !== undefined);
    if (!hasTimestamps) {
      issues.push("Missing timestamps: Map and segments will be inaccurate.");
    }

    const segments = generateTimeMap(lines, { ...config, segmentLengthMinutes: 3 });
    const totalWords = segments.reduce((sum, seg) => sum + seg.wordCount, 0);

    if (totalWords === 0) {
      issues.push("No transcript detected: 0 words found.");
    }

    // Estimate duration
    let durationSeconds = 0;
    if (lines.length > 0) {
      const lastLine = lines[lines.length - 1];
      if (lastLine.end) durationSeconds = lastLine.end;
      else if (lastLine.start) durationSeconds = lastLine.start + 10;
    }

    if (durationSeconds > 20 * 60) {
      issues.push(`Long video: Estimated length is >20 minutes (${Math.round(durationSeconds / 60)} mins).`);
    }

    const durationMinutes = durationSeconds / 60;
    let wpm = 0;
    if (durationMinutes > 0) {
      wpm = totalWords / durationMinutes;
      if (wpm > 0 && wpm < 50) {
        issues.push(`Low transcript density: ~${Math.round(wpm)} words per minute.`);
      }
    }

    // Detect long unbroken segments
    const longSegments = segments.filter(s => (s.end - s.start) > 5 * 60);
    if (longSegments.length > 0) {
       issues.push("Long unbroken segments: Some time blocks are over 5 minutes.");
    }

    return {
      filename: file.filename,
      hasTranscript: totalWords > 0,
      durationSeconds,
      wordCount: totalWords,
      wpm: durationMinutes > 0 ? Math.round(wpm) : undefined,
      numSegments: segments.length,
      issues
    };
  });
}
