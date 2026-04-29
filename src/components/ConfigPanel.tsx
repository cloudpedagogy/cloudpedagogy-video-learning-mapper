import React from 'react';
import { Config } from '../types';

interface ConfigPanelProps {
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, setConfig }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>, key: keyof Config) => {
    const val = e.target.value;
    setConfig(prev => ({
      ...prev,
      [key]: val.split(',').map(s => s.trim()).filter(Boolean)
    }));
  };

  return (
    <div className="panel">
      <h2>Configuration</h2>
      <p>Customise how the transcript is cleaned and processed.</p>
      
      <div className="flex-col gap-sm mt-md">
        <label className="flex items-center gap-sm">
          <input 
            type="checkbox" 
            name="removeFillerWords" 
            checked={config.removeFillerWords} 
            onChange={handleChange} 
          />
          Remove filler words
        </label>
        
        <label className="flex items-center gap-sm">
          <input 
            type="checkbox" 
            name="removeDuplicates" 
            checked={config.removeDuplicates} 
            onChange={handleChange} 
          />
          Remove duplicate lines
        </label>
        
        <label className="flex items-center gap-sm">
          <input 
            type="checkbox" 
            name="mergeShortLines" 
            checked={config.mergeShortLines} 
            onChange={handleChange} 
          />
          Merge short broken lines
        </label>
        
        <div className="mt-sm">
          <label className="label">Segment Length (Minutes)</label>
          <input 
            type="number" 
            name="segmentLengthMinutes" 
            className="input" 
            value={config.segmentLengthMinutes} 
            onChange={handleChange}
            min={1} 
            max={60} 
            style={{ width: '150px' }}
          />
        </div>

        <div className="mt-sm">
          <label className="label">Filler Words (comma separated)</label>
          <textarea 
            className="textarea" 
            rows={2} 
            value={config.fillerWords.join(', ')} 
            onChange={e => handleArrayChange(e, 'fillerWords')} 
          />
        </div>
      </div>
      
      {/* Lightweight capability and governance layer */}
      {/* This optional section supports visibility, reflection, and accountability */}
      {/* without altering the core workflow or introducing constraints. */}
      <details className="mt-md meta-text" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 500 }}>Capability & Governance Notes (Optional)</summary>
        <div className="flex-col gap-sm mt-sm">
          <label className="label">AI Involvement</label>
          <input type="text" name="aiInvolvement" className="input meta-text" value={config.aiInvolvement || ''} onChange={handleChange} />
          
          <label className="label">Assumptions</label>
          <input type="text" name="assumptions" className="input meta-text" value={config.assumptions || ''} onChange={handleChange} />
          
          <label className="label">Risks or concerns</label>
          <input type="text" name="risks" className="input meta-text" value={config.risks || ''} onChange={handleChange} />
          
          <label className="label">Rationale</label>
          <input type="text" name="rationale" className="input meta-text" value={config.rationale || ''} onChange={handleChange} />
          
          <label className="label">Human review notes</label>
          <input type="text" name="reviewNotes" className="input meta-text" value={config.reviewNotes || ''} onChange={handleChange} />
        </div>
      </details>
    </div>
  );
};
