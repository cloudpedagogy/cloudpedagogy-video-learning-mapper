export interface TranscriptLine {
  start?: number; // in seconds
  end?: number;   // in seconds
  text: string;
}

export interface FileData {
  filename: string;
  rawContent: string;
  lines: TranscriptLine[];
  prepopulatedSegments?: VideoSegment[];
}

export interface Config {
  segmentLengthMinutes: number;
  removeFillerWords: boolean;
  removeDuplicates: boolean;
  mergeShortLines: boolean;
  fillerWords: string[];
  stopwords: string[];
  aiInvolvement?: string;
  assumptions?: string;
  risks?: string;
  rationale?: string;
  reviewNotes?: string;
  supportedCapability?: string;
  usePattern?: string;
  humanCheckpoint?: string;
  reflectionPrompt?: string;
  nextStep?: string;
}

export interface TimeMapSegment {
  start: number;
  end: number;
  segmentNumber: number;
  excerpt: string;
  wordCount: number;
}

export interface KeywordData {
  word: string;
  count: number;
}

export interface VideoSegment {
  start: number;
  end: number;
  text: string;
  cuePhrase?: string;
  wordCount: number;
  theme?: string;
  learningObjective?: string;
}

export interface AuditResult {
  filename: string;
  hasTranscript: boolean;
  durationSeconds?: number;
  wordCount: number;
  wpm?: number;
  numSegments: number;
  issues: string[];
}
