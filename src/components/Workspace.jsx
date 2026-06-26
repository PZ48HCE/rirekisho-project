import React, { useState, useRef } from 'react';
import ResumeEditor from './ResumeEditor';
import RirekishoTemplate from './RirekishoTemplate';
import ShokumuTemplate from './ShokumuTemplate';
import { exportToJsonFile, defaultResumeData } from '../utils/storage';
import { Download, Upload, RefreshCw, Printer, ZoomIn, ZoomOut, FileText } from 'lucide-react';

function Workspace({ resumeData, setResumeData, geminiKey, onOpenSettings }) {
  const [docType, setDocType] = useState('rirekisho'); // 'rirekisho' | 'shokumu'
  const [shokumuStyle, setShokumuStyle] = useState('engineering'); // 'engineering' | 'sales' | 'admin'
  const [zoomScale, setZoomScale] = useState(0.7); // 0.4 - 1.2
  const [fontStyle, setFontStyle] = useState('gothic'); // 'gothic' | 'serif'
  const fileInputRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const handleImportJson = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.personalInfo) {
            setResumeData(parsed);
            alert("Resume backup loaded successfully!");
          } else {
            alert("Invalid backup file format.");
          }
        } catch (err) {
          alert("Error parsing JSON file: " + err.message);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to clear your current progress and reset to the default sample data?")) {
      setResumeData(defaultResumeData);
    }
  };

  return (
    <div className="workspace-layout">
      {/* Left Pane: Form Editor */}
      <div className="editor-pane">
        <ResumeEditor 
          data={resumeData} 
          onChange={setResumeData} 
          geminiKey={geminiKey} 
          onOpenSettings={onOpenSettings}
        />
      </div>

      {/* Right Pane: Live Document Preview */}
      <div className="preview-pane">
        
        {/* Preview Control Bar (No Print) */}
        <div className="preview-controls-bar no-print">
          
          {/* Document Switcher */}
          <div className="control-tabs">
            <button 
              className={`control-tab-btn ${docType === 'rirekisho' ? 'active' : ''}`}
              onClick={() => setDocType('rirekisho')}
            >
              <FileText size={14} />
              Rirekisho (履歴書)
            </button>
            <button 
              className={`control-tab-btn ${docType === 'shokumu' ? 'active' : ''}`}
              onClick={() => setDocType('shokumu')}
            >
              <FileText size={14} />
              Shokumu (職務経歴書)
            </button>
          </div>

          {/* Font Selector */}
          <div className="control-style-selector">
            <span className="control-label">Font:</span>
            <select 
              className="form-select select-sm"
              value={fontStyle}
              onChange={(e) => setFontStyle(e.target.value)}
            >
              <option value="gothic">Gothic (ゴシック)</option>
              <option value="serif">Mincho (明朝)</option>
            </select>
          </div>

          {/* Shokumu Layout Style */}
          {docType === 'shokumu' && (
            <div className="control-style-selector">
              <span className="control-label">Style:</span>
              <select 
                className="form-select select-sm"
                value={shokumuStyle}
                onChange={(e) => setShokumuStyle(e.target.value)}
              >
                <option value="engineering">Engineering (IT)</option>
                <option value="sales">Sales (営業)</option>
                <option value="admin">Standard / Admin</option>
              </select>
            </div>
          )}

          {/* Scale Control */}
          <div className="control-zoom">
            <button 
              className="zoom-btn" 
              onClick={() => setZoomScale(Math.max(0.4, zoomScale - 0.05))}
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <input 
              type="range" 
              min="0.4" 
              max="1.2" 
              step="0.05"
              value={zoomScale} 
              onChange={(e) => setZoomScale(parseFloat(e.target.value))}
            />
            <button 
              className="zoom-btn" 
              onClick={() => setZoomScale(Math.min(1.2, zoomScale + 0.05))}
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <span className="zoom-value">{Math.round(zoomScale * 100)}%</span>
          </div>

          {/* Actions */}
          <div className="control-actions">
            <button 
              className="btn btn-secondary btn-icon-sm"
              onClick={handlePrint}
              title="Print / Save PDF (A4 Layout)"
            >
              <Printer size={14} />
            </button>
            <button 
              className="btn btn-secondary btn-icon-sm"
              onClick={() => exportToJsonFile(resumeData)}
              title="Export Data Backup (JSON)"
            >
              <Download size={14} />
            </button>
            <button 
              className="btn btn-secondary btn-icon-sm"
              onClick={() => fileInputRef.current.click()}
              title="Import Data Backup (JSON)"
            >
              <Upload size={14} />
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="application/json" 
                onChange={handleImportJson} 
              />
            </button>
            <button 
              className="btn btn-secondary btn-icon-sm btn-hover-danger"
              onClick={handleResetData}
              title="Reset to Sample Data"
            >
              <RefreshCw size={14} />
            </button>
          </div>

        </div>

        {/* Scaled Preview Frame */}
        <div className="preview-pane-frame">
          <div 
            style={{ 
              transform: `scale(${zoomScale})`, 
              transformOrigin: 'top center',
              marginBottom: `${-297 * (1 - zoomScale)}mm`
            }}
            className="transition-transform duration-100 ease-out scaled-doc-wrap"
          >
            {docType === 'rirekisho' ? (
              <RirekishoTemplate data={resumeData} fontStyle={fontStyle} />
            ) : (
              <ShokumuTemplate data={resumeData} style={shokumuStyle} fontStyle={fontStyle} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Workspace;
