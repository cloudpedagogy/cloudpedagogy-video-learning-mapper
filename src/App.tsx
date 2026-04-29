import { useState, useMemo, useEffect } from 'react';
import { UploadPanel } from './components/UploadPanel';
import { ConfigPanel } from './components/ConfigPanel';
import { ResultsViewer } from './components/ResultsViewer';
import { ExportPanel } from './components/ExportPanel';
import { Config, FileData, VideoSegment } from './types';
import { parseTranscript } from './processors/parser';
import { cleanTranscript } from './processors/cleaner';
import { generateTimeMap } from './processors/mapper';
import { extractKeywords } from './processors/keyword';
import { detectSegments } from './processors/segmenter';
import { runAudit } from './processors/audit';
import { generateQuarto } from './processors/quarto';

const DEFAULT_STOPWORDS = [
  "i","me","my","myself","we","our","ours","ourselves","you","your","yours",
  "yourself","yourselves","he","him","his","himself","she","her","hers",
  "herself","it","its","itself","they","them","their","theirs","themselves",
  "what","which","who","whom","this","that","these","those","am","is","are",
  "was","were","be","been","being","have","has","had","having","do","does",
  "did","doing","a","an","the","and","but","if","or","because","as","until",
  "while","of","at","by","for","with","about","against","between","into",
  "through","during","before","after","above","below","to","from","up","down",
  "in","out","on","off","over","under","again","further","then","once","here",
  "there","when","where","why","how","all","any","both","each","few","more",
  "most","other","some","such","no","nor","not","only","own","same","so",
  "than","too","very","s","t","can","will","just","don","should","now"
];

const DEMO_STATE = {
  videoTitle: "AI-Assisted Surveillance in Public Health",
  transcript: `WEBVTT

00:00:00.000 --> 00:00:05.000
Welcome to this session on AI-assisted surveillance in public health systems.

00:00:05.000 --> 00:00:12.000
In this lecture, we explore how machine learning supports early outbreak detection.

00:00:12.000 --> 00:00:20.000
We begin by examining traditional epidemiological monitoring approaches.

00:00:20.000 --> 00:00:28.000
These systems rely on delayed reporting from clinical and laboratory sources.

00:00:28.000 --> 00:00:36.000
AI introduces the ability to process real-time data streams from multiple sources.

00:00:36.000 --> 00:00:45.000
These include hospital records, mobility data, and social media signals.

00:00:45.000 --> 00:00:55.000
However, the use of such data raises important ethical and governance concerns.

00:00:55.000 --> 00:01:05.000
Issues include privacy, bias in data sources, and accountability for automated decisions.

00:01:05.000 --> 00:01:15.000
Public health professionals must balance innovation with responsible data use.

00:01:15.000 --> 00:01:25.000
In the next section, we will examine case studies of AI deployment in outbreak response.
`,
  segments: [
    {
      start: "00:00:00",
      end: "00:00:20",
      theme: "Introduction to AI in Public Health",
      learningObjective: "Understand the role of AI in surveillance systems"
    },
    {
      start: "00:00:20",
      end: "00:00:45",
      theme: "Data Sources and Methods",
      learningObjective: "Identify data streams used in AI-supported monitoring"
    },
    {
      start: "00:00:45",
      end: "00:01:15",
      theme: "Ethics and Governance",
      learningObjective: "Evaluate risks related to privacy and bias"
    }
  ]
};

function parseDemoStateToFileData(demo: typeof DEMO_STATE): FileData {
  const lines = parseTranscript(demo.videoTitle + ".vtt", demo.transcript);
  
  const parseTimeStr = (t: string) => {
    const p = t.split(':');
    return parseInt(p[0]) * 3600 + parseInt(p[1]) * 60 + parseInt(p[2]);
  };

  const prepopulatedSegments: VideoSegment[] = demo.segments.map(s => ({
    start: parseTimeStr(s.start),
    end: parseTimeStr(s.end),
    theme: s.theme,
    learningObjective: s.learningObjective,
    text: '',
    wordCount: 0
  }));

  // Populate text and wordCount for prepopulated segments based on lines
  prepopulatedSegments.forEach(seg => {
    const segmentLines = lines.filter(l => (l.start || 0) >= seg.start && (l.start || 0) < seg.end);
    seg.text = segmentLines.map(l => l.text).join(' ');
    seg.wordCount = seg.text.split(/\\s+/).filter(w => w.length > 0).length;
  });

  return {
    filename: demo.videoTitle + ".vtt",
    rawContent: demo.transcript,
    lines,
    prepopulatedSegments
  };
}

function getInitialFilesData(): FileData[] {
  const saved = localStorage.getItem("app_state");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      } else if (parsed.transcript) {
        return [parseDemoStateToFileData(parsed as typeof DEMO_STATE)];
      }
    } catch (e) {
      console.error(e);
    }
  }
  return [parseDemoStateToFileData(DEMO_STATE)];
}

function App() {
  const [config, setConfig] = useState<Config>({
    segmentLengthMinutes: 3,
    removeFillerWords: true,
    removeDuplicates: true,
    mergeShortLines: true,
    fillerWords: ['um', 'uh', 'erm', 'ah', 'like', 'you know'],
    stopwords: DEFAULT_STOPWORDS
  });

  const [filesData, setFilesData] = useState<FileData[]>(getInitialFilesData);
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);

  useEffect(() => {
    // Only persist if we actually have data, to prevent immediate clearing on first load if we wanted to allow empty state.
    // However, user requires it to always open in non-empty state.
    localStorage.setItem("app_state", JSON.stringify(filesData));
  }, [filesData]);

  const loadDemoState = () => {
    localStorage.setItem("app_state", JSON.stringify(DEMO_STATE));
    window.location.reload();
  };

  const clearState = () => {
    localStorage.removeItem("app_state");
    window.location.reload();
  };

  const handleFilesAccepted = async (files: File[]) => {
    const newFilesData: FileData[] = [];
    
    for (const file of files) {
      const text = await file.text();
      const lines = parseTranscript(file.name, text);
      newFilesData.push({
        filename: file.name,
        rawContent: text,
        lines
      });
    }

    setFilesData(prev => {
      // If we are replacing the demo state upon first upload, we could clear it, but the spec says "do not remove existing logic".
      // We will just append it.
      return [...prev, ...newFilesData];
    });
    
    // Switch to the newly uploaded file
    setActiveFileIndex(filesData.length);
  };

  const activeFile = filesData[activeFileIndex];

  // Process data using useMemo so it runs instantly on the client side
  const { cleanLines, map, keywords, segments, audit, quartoMd } = useMemo(() => {
    if (!activeFile) {
      return { cleanLines: [], map: [], keywords: [], segments: [], audit: [], quartoMd: '' };
    }

    const cleanLines = cleanTranscript(activeFile.lines, config);
    const map = generateTimeMap(cleanLines, config);
    const keywords = extractKeywords(cleanLines, config);
    const segments = activeFile.prepopulatedSegments || detectSegments(cleanLines);
    
    // Audit processes all files
    const audit = runAudit(filesData, config);
    
    let finalQuartoMd = generateQuarto(activeFile.filename, map, keywords);

    const governanceSection = [];
    if (config.aiInvolvement) governanceSection.push(`- **AI Involvement:** ${config.aiInvolvement}`);
    if (config.assumptions) governanceSection.push(`- **Assumptions:** ${config.assumptions}`);
    if (config.risks) governanceSection.push(`- **Risks/Concerns:** ${config.risks}`);
    if (config.rationale) governanceSection.push(`- **Rationale:** ${config.rationale}`);
    if (config.reviewNotes) governanceSection.push(`- **Review Notes:** ${config.reviewNotes}`);
    
    if (governanceSection.length > 0) {
      finalQuartoMd += `\n\n## Capability & Governance Notes\n${governanceSection.join('\n')}\n`;
    }

    return { cleanLines, map, keywords, segments, audit, quartoMd: finalQuartoMd };
  }, [activeFile, filesData, config]);

  return (
    <div>
      <header className="app-header">
        <div className="container flex justify-between items-center">
          <div>
            <a href="https://www.cloudpedagogy.com/" className="brand-link">CloudPedagogy</a>
            <span className="brand-subtitle">Video Learning Mapper</span>
          </div>
          <div className="demo-controls" style={{ marginBottom: 0 }}>
            <button id="load-demo-btn" onClick={loadDemoState}>Load Demo</button>
            <button id="clear-btn" onClick={clearState}>Start Fresh</button>
          </div>
        </div>
      </header>

      <main className="container">
        <UploadPanel onFilesAccepted={handleFilesAccepted} />

        {filesData.length > 0 && (
          <div className="flex gap-md mb-md">
            <div style={{ flex: '0 0 300px' }}>
              <ConfigPanel config={config} setConfig={setConfig} />
              
              <div className="panel mt-md">
                <h3>Uploaded Files</h3>
                <div className="flex-col gap-sm">
                  {filesData.map((f, i) => (
                    <button 
                      key={i} 
                      className={`button ${i === activeFileIndex ? '' : 'button-outline'}`}
                      onClick={() => setActiveFileIndex(i)}
                      style={{ textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {f.filename}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <ExportPanel 
                cleanLines={cleanLines} 
                map={map} 
                keywords={keywords} 
                audit={audit} 
                quartoMd={quartoMd} 
              />
              <ResultsViewer 
                cleanLines={cleanLines} 
                map={map} 
                keywords={keywords} 
                segments={segments} 
                audit={audit} 
                quartoMd={quartoMd} 
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
