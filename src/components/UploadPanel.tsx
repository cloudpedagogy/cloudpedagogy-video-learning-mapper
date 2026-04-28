import React, { useCallback, useState } from 'react';

interface UploadPanelProps {
  onFilesAccepted: (files: File[]) => void;
}

export const UploadPanel: React.FC<UploadPanelProps> = ({ onFilesAccepted }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesAccepted(Array.from(e.dataTransfer.files));
    }
  }, [onFilesAccepted]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      onFilesAccepted(Array.from(e.target.files));
    }
  }, [onFilesAccepted]);

  return (
    <div className="panel mb-lg">
      <h2>Upload Transcripts</h2>
      <p>Upload your video transcripts to begin processing. Supported formats: <strong>.txt, .vtt, .srt, .csv</strong></p>
      
      <div 
        className={`dropzone ${isDragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <p>Drag and drop your files here, or click to select files</p>
        <input 
          id="file-upload" 
          type="file" 
          multiple 
          accept=".txt,.vtt,.srt,.csv"
          onChange={handleChange} 
          style={{ display: 'none' }} 
        />
      </div>
    </div>
  );
};
