import React from 'react';
import { ArrowRight, Sparkles, Download, CheckCircle, ShieldCheck, Languages } from 'lucide-react';

function LandingPage({ onEnterWorkspace }) {
  return (
    <div className="landing-page-container">
      
      {/* Hero Section */}
      <section className="hero-section">
        {/* Glow Effects */}
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>

        <div className="hero-content">
          <div className="hero-badge animate-fade-in">
            <Sparkles size={14} />
            100% Free & Open-Source Resume Builder
          </div>

          <h1 className="hero-title">
            Japan-Ready Resumes <br />
            <span className="gradient-text">
              Generated in Seconds
            </span>
          </h1>

          <p className="hero-subtitle">
            Upload your resume or enter your details in English. Our client-side builder translates your experience into polished business Japanese (Rirekisho & Shokumu) for free.
          </p>

          <div className="hero-buttons">
            <button 
              className="btn btn-primary btn-lg"
              onClick={onEnterWorkspace}
            >
              Start Building for Free
              <ArrowRight size={18} className="arrow-icon" />
            </button>
            <a 
              href="#how-it-works"
              className="btn btn-secondary btn-lg"
            >
              How it works
            </a>
          </div>

          {/* Interactive CSS Mockup of Resume Split Screen */}
          <div className="workspace-mockup">
            <div className="mockup-header">
              <div className="mockup-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="mockup-header-title">KonnichiCV Workspace Preview</div>
              <div className="mockup-spacer"></div>
            </div>
            
            <div className="mockup-body">
              {/* Mock Editor */}
              <div className="mockup-editor">
                <div className="mock-skeleton title"></div>
                <div className="mock-input-group">
                  <div className="mock-input">John Smith</div>
                  <div className="mock-input">2-1-1 Nihonbashi, Tokyo</div>
                </div>
                <div className="mock-skeleton subtitle"></div>
                <div className="mock-textarea">
                  React and UI engineer with 6+ years experience...
                </div>
                <div className="btn btn-primary mock-btn">
                  Translate with Gemini AI
                </div>
              </div>

              {/* Mock Resume Sheet */}
              <div className="mockup-preview">
                <div className="mock-rirekisho">
                  <div className="mock-rirekisho-header">
                    <div className="mock-name-section">
                      <div className="mock-kana">じょん すみす</div>
                      <div className="mock-name">John Smith</div>
                    </div>
                    <div className="mock-photo-box">Photo</div>
                  </div>
                  
                  <div className="mock-rirekisho-body">
                    <div className="mock-body-title">学歴・職歴</div>
                    <div className="mock-rows">
                      <div className="mock-row">
                        <span className="mock-year">2014</span>
                        <span className="mock-month">09</span>
                        <span className="mock-detail">スタンフォード大学 コンピュータサイエンス学科 入学</span>
                      </div>
                      <div className="mock-row">
                        <span className="mock-year">2018</span>
                        <span className="mock-month">06</span>
                        <span className="mock-detail">スタンフォード大学 コンピュータサイエンス学科 卒業</span>
                      </div>
                      <div className="mock-row">
                        <span className="mock-year">2018</span>
                        <span className="mock-month">08</span>
                        <span className="mock-detail">Apex Technology株式会社 入社</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mock-rirekisho-footer">
                    <div className="mock-footer-title">自己PR</div>
                    <div className="mock-footer-text">
                      私はReactおよびUI/UXエンジニアリング分野で6年以上の経験を持つフロントエンドデベロッパーです。
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <h2 className="section-title">How It Works</h2>
        <div className="how-it-works-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3 className="step-title">Input Your CV Info</h3>
            <p className="step-description">
              Paste your raw CV details, upload details, or write them out in English. Standard templates format schools, jobs, and certifications.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3 className="step-title">Convert to Japanese AI</h3>
            <p className="step-description">
              Use your free Gemini API Key to translate and polish descriptions using proper Keigo (business Japanese honorifics).
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3 className="step-title">Save as PDF</h3>
            <p className="step-description">
              Export pixel-perfect, A4-sized Standard JIS Rirekisho and Shokumu Keirekisho PDFs using standard print styles.
            </p>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="capabilities-section">
        <div className="capabilities-container">
          <h2 className="section-title">Core Capabilities</h2>
          <div className="capabilities-grid">
            <div className="capability-item">
              <div className="capability-icon">
                <Languages size={20} />
              </div>
              <div className="capability-text">
                <h4 className="capability-title">Honorific Translation</h4>
                <p className="capability-description">Translates experience using proper Keigo (謙譲語), sounding modest yet impactful to local recruiters.</p>
              </div>
            </div>
            <div className="capability-item">
              <div className="capability-icon">
                <ShieldCheck size={20} />
              </div>
              <div className="capability-text">
                <h4 className="capability-title">100% Private (Local Storage)</h4>
                <p className="capability-description">Your personal details are stored inside your browser. No remote servers ever see your CV details.</p>
              </div>
            </div>
            <div className="capability-item">
              <div className="capability-icon">
                <Download size={20} />
              </div>
              <div className="capability-text">
                <h4 className="capability-title">ATS Friendly Exports</h4>
                <p className="capability-description">PDF layout generates cleanly coded structural grids that clear ATS systems unlike macro-heavy Excel sheets.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (Free VS Paid Comparison) */}
      <section className="pricing-section">
        <h2 className="section-title">Self-Hosted & 100% Free</h2>
        <p className="section-subtitle">Why pay $20/month for simple translation builders? Check the differences:</p>
        
        <div className="pricing-comparison">
          {/* Competitor Card */}
          <div className="pricing-card competitor-card">
            <h3 className="pricing-card-header">Other Builders</h3>
            <div className="price-tag">¥3,000 / mo</div>
            <ul className="price-features">
              <li>❌ Paywalls for PDF exports</li>
              <li>❌ Uploaded photos sent to cloud databases</li>
              <li>❌ Subscriptions that auto-renew</li>
              <li>❌ Limited to single layouts</li>
            </ul>
          </div>
          
          {/* Main Card */}
          <div className="pricing-card main-card">
            <div className="badge-tag">You are Here</div>
            <h3 className="pricing-card-header text-emerald">KonnichiCV</h3>
            <div className="price-tag text-emerald">¥0 (Free Forever)</div>
            <ul className="price-features">
              <li><CheckCircle size={16} className="check-icon" /> Unlimited A4 PDF printing</li>
              <li><CheckCircle size={16} className="check-icon" /> Zero database server data retention</li>
              <li><CheckCircle size={16} className="check-icon" /> Direct API calls using free Gemini Key</li>
              <li><CheckCircle size={16} className="check-icon" /> Save/load raw details as local JSON</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="landing-footer">
        <p>© 2026 KonnichiCV. Developed with Antigravity AI.</p>
        <div className="footer-links">
          <a href="#how-it-works">Documentation</a>
          <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer">Google AI Studio</a>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;
