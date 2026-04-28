import React from 'react';
import { TimeMapSegment, KeywordData, AuditResult, TranscriptLine } from '../types';
import { compileCleanText } from '../processors/cleaner';

interface ExportPanelProps {
  cleanLines: TranscriptLine[];
  map: TimeMapSegment[];
  keywords: KeywordData[];
  audit: AuditResult[];
  quartoMd: string;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ cleanLines, map, keywords, audit, quartoMd }) => {

  const downloadBlob = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportCleanTxT = () => downloadBlob(compileCleanText(cleanLines), 'clean_transcript.txt', 'text/plain');
  
  const exportQuarto = () => downloadBlob(quartoMd, 'learning_guide.md', 'text/markdown');
  
  const exportMapCSV = () => {
    let csv = "Start,End,Segment,WordCount,Excerpt\n";
    map.forEach(m => {
      const excerpt = m.excerpt.replace(/"/g, '""');
      csv += `${m.start},${m.end},${m.segmentNumber},${m.wordCount},"${excerpt}"\n`;
    });
    downloadBlob(csv, 'video_map.csv', 'text/csv');
  };

  const exportKeywordsCSV = () => {
    let csv = "Keyword,Count\n";
    keywords.forEach(k => {
      csv += `"${k.word.replace(/"/g, '""')}",${k.count}\n`;
    });
    downloadBlob(csv, 'keywords.csv', 'text/csv');
  };

  const exportAuditCSV = () => {
    let csv = "Filename,Duration,WordCount,WPM,Segments,Issues\n";
    audit.forEach(a => {
      const issues = a.issues.join('; ').replace(/"/g, '""');
      csv += `"${a.filename}",${a.durationSeconds || 0},${a.wordCount},${a.wpm || 0},${a.numSegments},"${issues}"\n`;
    });
    downloadBlob(csv, 'audit.csv', 'text/csv');
  };

  return (
    <div className="panel flex gap-sm">
      <button className="button" onClick={exportCleanTxT}>Export TXT</button>
      <button className="button button-outline" onClick={exportQuarto}>Export Quarto MD</button>
      <button className="button button-outline" onClick={exportMapCSV}>Export Map CSV</button>
      <button className="button button-outline" onClick={exportKeywordsCSV}>Export Keywords CSV</button>
      <button className="button button-outline" onClick={exportAuditCSV}>Export Audit CSV</button>
    </div>
  );
};
