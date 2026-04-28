import { TranscriptLine } from '../types';

function parseTime(timeString: string): number {
  const parts = timeString.replace(',', '.').split(':');
  let seconds = 0;
  if (parts.length === 3) {
    seconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseFloat(parts[2]);
  } else if (parts.length === 2) {
    seconds = parseInt(parts[0]) * 60 + parseFloat(parts[1]);
  } else {
    seconds = parseFloat(parts[0]) || 0;
  }
  return seconds;
}

export function parseVTT(raw: string): TranscriptLine[] {
  const lines = raw.split(/\r?\n/);
  const result: TranscriptLine[] = [];
  let currentBlock: Partial<TranscriptLine> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === 'WEBVTT' || line === '') continue;

    if (line.includes('-->')) {
      const [startStr, endStr] = line.split('-->').map(s => s.trim());
      currentBlock.start = parseTime(startStr);
      currentBlock.end = parseTime(endStr);
      currentBlock.text = '';
    } else if (currentBlock.start !== undefined) {
      if (!currentBlock.text) {
        currentBlock.text = line;
      } else {
        currentBlock.text += ' ' + line;
      }
      
      // Look ahead for end of block
      if (i === lines.length - 1 || lines[i+1].trim() === '') {
        result.push(currentBlock as TranscriptLine);
        currentBlock = {};
      }
    }
  }
  return result;
}

export function parseSRT(raw: string): TranscriptLine[] {
  // SRT is very similar to VTT, just using commas instead of dots for milliseconds,
  // and numbers before the timestamp lines.
  const lines = raw.split(/\r?\n/);
  const result: TranscriptLine[] = [];
  let currentBlock: Partial<TranscriptLine> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '' || /^\d+$/.test(line)) continue;

    if (line.includes('-->')) {
      const [startStr, endStr] = line.split('-->').map(s => s.trim());
      currentBlock.start = parseTime(startStr);
      currentBlock.end = parseTime(endStr);
      currentBlock.text = '';
    } else if (currentBlock.start !== undefined) {
      if (!currentBlock.text) {
        currentBlock.text = line;
      } else {
        currentBlock.text += ' ' + line;
      }
      
      // Look ahead for end of block
      if (i === lines.length - 1 || lines[i+1].trim() === '' || /^\d+$/.test(lines[i+1].trim())) {
        if (currentBlock.text) {
          result.push(currentBlock as TranscriptLine);
        }
        currentBlock = {};
      }
    }
  }
  return result;
}

export function parseTXT(raw: string): TranscriptLine[] {
  // Try to find [00:00:00] style inline timestamps, otherwise just line by line without timestamps
  const lines = raw.split(/\r?\n/);
  const result: TranscriptLine[] = [];

  for (const line of lines) {
    const tLine = line.trim();
    if (!tLine) continue;

    const timestampMatch = tLine.match(/^\[?(\d{1,2}:\d{2}(?::\d{2})?)\]?\s*(.*)$/);
    if (timestampMatch) {
      result.push({
        start: parseTime(timestampMatch[1]),
        text: timestampMatch[2].trim()
      });
    } else {
      result.push({
        text: tLine
      });
    }
  }
  return result;
}

export function parseTranscript(filename: string, raw: string): TranscriptLine[] {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'vtt') return parseVTT(raw);
  if (ext === 'srt') return parseSRT(raw);
  return parseTXT(raw);
}
