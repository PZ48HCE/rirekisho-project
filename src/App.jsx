import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Workspace from './components/Workspace';
import { loadResumeData, saveResumeData, loadGeminiKey, saveGeminiKey, defaultResumeData } from './utils/storage';
import { FileText, Sun, Moon, Key } from 'lucide-react';

function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'workspace'
  const [resumeData, setResumeData] = useState(loadResumeData());
  const [geminiKey, setGeminiKey] = useState(loadGeminiKey());
  const [darkMode, setDarkMode] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(geminiKey);

  // Sync state changes to storage
  useEffect(() => {
    saveResumeData(resumeData);
  }, [resumeData]);

  // Sync API Key to storage
  useEffect(() => {
    saveGeminiKey(geminiKey);
    setTempApiKey(geminiKey);
  }, [geminiKey]);

  // Apply Dark Mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    setGeminiKey(tempApiKey);
    setShowApiKeyModal(false);
  };

  return (
    <div className="app-container">
      {/* Universal Navigation Header */}
      <header className="main-nav glassmorphism no-print">
        <div className="nav-brand" onClick={() => setView('landing')}>
          <div className="nav-logo-icon">
            <FileText size={20} />
          </div>
          <div className="nav-brand-text">
            <h1 className="nav-title">
              KonnichiCV <span className="badge-tag">Free</span>
            </h1>
            <p className="nav-subtitle">AI Japanese Resume Builder</p>
          </div>
        </div>

        <div className="nav-actions">
          {view === 'workspace' && (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setView('landing')}
            >
              Back to Home
            </button>
          )}
          {view === 'landing' && (
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setView('workspace')}
            >
              Open Builder
            </button>
          )}

          <button 
            className="btn btn-secondary btn-icon"
            onClick={() => setShowApiKeyModal(true)}
            title="Configure Gemini API Key"
          >
            <Key size={18} className={geminiKey ? "text-active" : "text-inactive"} />
          </button>

          <button 
            className="btn btn-secondary btn-icon"
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {view === 'landing' ? (
          <LandingPage onEnterWorkspace={() => setView('workspace')} />
        ) : (
          <Workspace 
            resumeData={resumeData} 
            setResumeData={setResumeData} 
            geminiKey={geminiKey} 
            onOpenSettings={() => setShowApiKeyModal(true)}
          />
        )}
      </main>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-icon">
                <Key size={20} />
              </div>
              <div className="modal-header-text">
                <h3 className="modal-title">Configure Gemini API Key</h3>
                <p className="modal-subtitle">Enable free translation and parsing</p>
              </div>
            </div>

            <form onSubmit={handleSaveApiKey} className="modal-form">
              <p className="modal-description">
                To keep this builder 100% free and serverless, AI features use your own Google Gemini API key. 
                Your key is saved <b>locally in your browser</b> and never sent to our servers.
              </p>

              <div className="modal-info-box">
                <p className="info-title">How to get a free API Key:</p>
                <ol className="info-steps">
                  <li>Visit <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="link-text">Google AI Studio</a></li>
                  <li>Sign in with your Google account</li>
                  <li>Click <b>"Get API Key"</b> at the top</li>
                  <li>Create a new key and paste it below</li>
                </ol>
              </div>

              <div className="form-group">
                <label className="form-label">Gemini API Key</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="AIzaSy..." 
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowApiKeyModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Save API Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
