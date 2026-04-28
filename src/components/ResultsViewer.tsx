import React, { useState } from 'react';
import { TimeMapSegment, KeywordData, VideoSegment, AuditResult, TranscriptLine } from '../types';
import { compileCleanText } from '../processors/cleaner';

interface ResultsViewerProps {
  cleanLines: TranscriptLine[];
  map: TimeMapSegment[];
  keywords: KeywordData[];
  segments: VideoSegment[];
  audit: AuditResult[];
  quartoMd: string;
}

export const ResultsViewer: React.FC<ResultsViewerProps> = ({
  cleanLines, map, keywords, segments, audit, quartoMd
}) => {
  const [activeTab, setActiveTab] = useState<string>('transcript');

  const tabs = [
    { id: 'transcript', label: 'Clean Transcript' },
    { id: 'map', label: 'Video Map' },
    { id: 'keywords', label: 'Keywords' },
    { id: 'segments', label: 'Segments' },
    { id: 'audit', label: 'Audit' },
    { id: 'quarto', label: 'Quarto Output' },
  ];

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="panel">
      <div className="tabs">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'transcript' && (
          <pre className="code-output">{compileCleanText(cleanLines) || 'No transcript data.'}</pre>
        )}

        {activeTab === 'map' && (
          <div>
            {map.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Start</th>
                    <th>End</th>
                    <th>Segment</th>
                    <th>Word Count</th>
                    <th>Excerpt</th>
                  </tr>
                </thead>
                <tbody>
                  {map.map((m, i) => (
                    <tr key={i}>
                      <td>{formatTime(m.start)}</td>
                      <td>{formatTime(m.end)}</td>
                      <td>{m.segmentNumber}</td>
                      <td>{m.wordCount}</td>
                      <td>{m.excerpt.length > 100 ? m.excerpt.substring(0, 100) + '...' : m.excerpt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p>No map generated.</p>}
          </div>
        )}

        {activeTab === 'keywords' && (
          <div>
            {keywords.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Keyword</th>
                    <th>Frequency Count</th>
                  </tr>
                </thead>
                <tbody>
                  {keywords.map((k, i) => (
                    <tr key={i}>
                      <td>{k.word}</td>
                      <td>{k.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p>No keywords extracted.</p>}
          </div>
        )}

        {activeTab === 'segments' && (
          <div>
            {segments.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Start</th>
                    <th>End</th>
                    <th>Cue Phrase / Theme</th>
                    <th>Word Count</th>
                    <th>Excerpt / Objective</th>
                  </tr>
                </thead>
                <tbody>
                  {segments.map((s, i) => (
                    <tr key={i}>
                      <td>{formatTime(s.start)}</td>
                      <td>{formatTime(s.end)}</td>
                      <td>{s.theme || s.cuePhrase || '-'}</td>
                      <td>{s.wordCount}</td>
                      <td>
                        {s.learningObjective && <div style={{fontWeight: 500, marginBottom: '4px'}}>{s.learningObjective}</div>}
                        {s.text.length > 100 ? s.text.substring(0, 100) + '...' : s.text}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p>No segments detected.</p>}
          </div>
        )}

        {activeTab === 'audit' && (
          <div>
            {audit.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Filename</th>
                    <th>Duration</th>
                    <th>Words</th>
                    <th>WPM</th>
                    <th>Issues</th>
                  </tr>
                </thead>
                <tbody>
                  {audit.map((a, i) => (
                    <tr key={i}>
                      <td>{a.filename}</td>
                      <td>{a.durationSeconds ? formatTime(a.durationSeconds) : 'Unknown'}</td>
                      <td>{a.wordCount}</td>
                      <td>{a.wpm || 'Unknown'}</td>
                      <td>
                        {a.issues.length > 0 ? (
                          <ul style={{ paddingLeft: '20px' }}>
                            {a.issues.map((issue, idx) => <li key={idx} className="error-text">{issue}</li>)}
                          </ul>
                        ) : 'None'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p>No audit results.</p>}
          </div>
        )}

        {activeTab === 'quarto' && (
          <pre className="code-output">{quartoMd || 'No Quarto data generated.'}</pre>
        )}
      </div>
    </div>
  );
};
