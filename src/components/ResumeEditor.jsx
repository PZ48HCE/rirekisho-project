import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, Upload, AlertCircle } from 'lucide-react';
import { translateToJapaneseBusiness, parseCvText } from '../utils/gemini';

function ResumeEditor({ data, onChange, geminiKey, onOpenSettings }) {
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'education' | 'work' | 'certs' | 'pr' | 'import'
  const [loadingSection, setLoadingSection] = useState(null); // null | 'selfPR' | 'motivation' | 'parseCV'
  const [cvText, setCvText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const updatePersonalInfo = (field, value) => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value
      }
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalInfo('photoUrl', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addListEntry = (type) => {
    const newEntry = { id: `${type}-${Date.now()}`, year: '', month: '', detail: '' };
    onChange({
      ...data,
      [type]: [...(data[type] || []), newEntry]
    });
  };

  const updateListEntry = (type, index, field, value) => {
    const newList = [...(data[type] || [])];
    newList[index] = { ...newList[index], [field]: value };
    onChange({
      ...data,
      [type]: newList
    });
  };

  const removeListEntry = (type, index) => {
    const newList = [...(data[type] || [])];
    newList.splice(index, 1);
    onChange({
      ...data,
      [type]: newList
    });
  };

  // AI Translation helper
  const handleAITranslate = async (section) => {
    if (!geminiKey) {
      setErrorMsg("Please add your Gemini API Key in the settings (top-right Key icon) to enable AI translation.");
      onOpenSettings();
      return;
    }
    
    const englishText = section === 'selfPR' ? data.selfPR : data.motivation;
    if (!englishText || englishText.trim() === "") {
      alert("Please enter some English text first to translate.");
      return;
    }

    setLoadingSection(section);
    setErrorMsg('');
    try {
      const translated = await translateToJapaneseBusiness(geminiKey, englishText, section === 'selfPR' ? "Self-PR" : "Motivation");
      onChange({
        ...data,
        [section === 'selfPR' ? 'selfPRJapanese' : 'motivationJapanese']: translated
      });
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to translate. Please check your API key.");
    } finally {
      setLoadingSection(null);
    }
  };

  // AI CV Parser helper
  const handleAIParse = async () => {
    if (!geminiKey) {
      setErrorMsg("Please add your Gemini API Key in the settings (top-right Key icon) to enable AI parsing.");
      onOpenSettings();
      return;
    }
    if (!cvText || cvText.trim() === "") {
      alert("Please paste your raw CV text first.");
      return;
    }

    setLoadingSection('parseCV');
    setErrorMsg('');
    try {
      const parsedData = await parseCvText(geminiKey, cvText);
      
      // Merge parsed data into existing schema
      const mergedData = {
        ...data,
        personalInfo: {
          ...data.personalInfo,
          fullName: parsedData.personalInfo?.fullName || data.personalInfo.fullName,
          fullNameKana: parsedData.personalInfo?.fullNameKana || data.personalInfo.fullNameKana,
          birthDate: parsedData.personalInfo?.birthDate || data.personalInfo.birthDate,
          gender: parsedData.personalInfo?.gender || data.personalInfo.gender,
          phone: parsedData.personalInfo?.phone || data.personalInfo.phone,
          email: parsedData.personalInfo?.email || data.personalInfo.email,
          address: parsedData.personalInfo?.address || data.personalInfo.address,
          addressKana: parsedData.personalInfo?.addressKana || data.personalInfo.addressKana,
        },
        education: parsedData.education?.map((edu, idx) => ({
          id: `edu-parsed-${idx}`,
          year: edu.year || '',
          month: edu.month || '',
          detail: edu.detail || ''
        })) || data.education,
        workExperience: parsedData.workExperience?.map((work, idx) => ({
          id: `work-parsed-${idx}`,
          year: work.year || '',
          month: work.month || '',
          detail: work.detail || ''
        })) || data.workExperience,
        certifications: parsedData.certifications?.map((cert, idx) => ({
          id: `cert-parsed-${idx}`,
          year: cert.year || '',
          month: cert.month || '',
          detail: cert.detail || ''
        })) || data.certifications,
        selfPR: parsedData.selfPR || data.selfPR,
        motivation: parsedData.motivation || data.motivation
      };

      // Trigger translate on the newly parsed PR/Motivation automatically if they exist
      if (mergedData.selfPR) {
        try {
          mergedData.selfPRJapanese = await translateToJapaneseBusiness(geminiKey, mergedData.selfPR, "Self-PR");
        } catch (_) {}
      }
      if (mergedData.motivation) {
        try {
          mergedData.motivationJapanese = await translateToJapaneseBusiness(geminiKey, mergedData.motivation, "Motivation");
        } catch (_) {}
      }

      onChange(mergedData);
      setActiveTab('personal');
      alert("CV parsed and loaded successfully!");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to parse CV text. Make sure you entered valid text and your key is active.");
    } finally {
      setLoadingSection(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Editor Tabs Navigation */}
      <div className="tab-container no-print">
        <button className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`} onClick={() => setActiveTab('personal')}>Personal Info</button>
        <button className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`} onClick={() => setActiveTab('education')}>Education</button>
        <button className={`tab-btn ${activeTab === 'work' ? 'active' : ''}`} onClick={() => setActiveTab('work')}>Employment</button>
        <button className={`tab-btn ${activeTab === 'certs' ? 'active' : ''}`} onClick={() => setActiveTab('certs')}>Certs</button>
        <button className={`tab-btn ${activeTab === 'pr' ? 'active' : ''}`} onClick={() => setActiveTab('pr')}>PR & Motivation</button>
        <button className={`tab-btn ${activeTab === 'import' ? 'active' : ''}`} onClick={() => setActiveTab('import')}>⚡ AI Import</button>
      </div>

      {errorMsg && (
        <div className="p-3.5 mb-5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}

      {/* Editor Tab Panes */}
      <div className="flex-1 overflow-y-auto pr-1">
        
        {/* Tab 1: Personal Info */}
        {activeTab === 'personal' && (
          <div className="editor-section-card animate-fade-in">
            <h3 className="font-bold text-lg border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-5">Personal Details</h3>
            
            <div className="grid grid-cols-3 gap-5 items-start">
              <div className="col-span-2 space-y-4">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name (英語・漢字)</label>
                    <input type="text" className="form-input" value={data.personalInfo.fullName || ''} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} placeholder="e.g. John Smith" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Furigana (ふりがな)</label>
                    <input type="text" className="form-input" value={data.personalInfo.fullNameKana || ''} onChange={(e) => updatePersonalInfo('fullNameKana', e.target.value)} placeholder="e.g. ジョン スミス" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Birth Date</label>
                    <input type="date" className="form-input" value={data.personalInfo.birthDate || ''} onChange={(e) => updatePersonalInfo('birthDate', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender (性別)</label>
                    <select className="form-select" value={data.personalInfo.gender || ''} onChange={(e) => updatePersonalInfo('gender', e.target.value)}>
                      <option value="Male">Male (男)</option>
                      <option value="Female">Female (女)</option>
                      <option value="Other">Other (その他)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Photo Slot */}
              <div className="col-span-1 flex flex-col items-center">
                <div className="w-28 h-36 border border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 relative shadow-sm">
                  {data.personalInfo.photoUrl ? (
                    <>
                      <img src={data.personalInfo.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button className="absolute bottom-1.5 right-1.5 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition" onClick={() => updatePersonalInfo('photoUrl', '')} title="Remove Photo">
                        <Trash2 size={12} />
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center p-2 text-center h-full w-full">
                      <Upload size={20} className="text-zinc-400 mb-1" />
                      <span className="text-[10px] text-zinc-500 font-semibold">Upload Photo<br />(Ratio 4:3)</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="form-row mt-4">
              <div className="form-group">
                <label className="form-label">Phone Number (電話番号)</label>
                <input type="tel" className="form-input" value={data.personalInfo.phone || ''} onChange={(e) => updatePersonalInfo('phone', e.target.value)} placeholder="e.g. +81 80-1234-5678" />
              </div>
              <div className="form-group">
                <label className="form-label">Email (メール)</label>
                <input type="email" className="form-input" value={data.personalInfo.email || ''} onChange={(e) => updatePersonalInfo('email', e.target.value)} placeholder="e.g. john@example.com" />
              </div>
            </div>

            <div className="form-group mt-2">
              <label className="form-label">Address (住所)</label>
              <input type="text" className="form-input" value={data.personalInfo.address || ''} onChange={(e) => updatePersonalInfo('address', e.target.value)} placeholder="e.g. 2-1-1 Nihonbashi, Chuo-ku, Tokyo" />
            </div>

            <div className="form-group">
              <label className="form-label">Address Kana (住所 ふりがな)</label>
              <input type="text" className="form-input" value={data.personalInfo.addressKana || ''} onChange={(e) => updatePersonalInfo('addressKana', e.target.value)} placeholder="e.g. トウキョウト チュウオウク ニホンバシ..." />
            </div>
          </div>
        )}

        {/* Tab 2: Education List */}
        {activeTab === 'education' && (
          <div className="editor-section-card animate-fade-in">
            <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-5">
              <h3 className="font-bold text-lg">Academic Background</h3>
              <button className="btn btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5" onClick={() => addListEntry('education')}>
                <Plus size={14} /> Add School
              </button>
            </div>

            {(!data.education || data.education.length === 0) && (
              <p className="text-zinc-500 text-sm italic">No education entries added yet.</p>
            )}

            <div className="space-y-4">
              {data.education?.map((edu, index) => (
                <div key={edu.id} className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 flex gap-3 items-end">
                  <div className="w-20">
                    <label className="form-label">Year</label>
                    <input type="text" className="form-input" placeholder="YYYY" value={edu.year} onChange={(e) => updateListEntry('education', index, 'year', e.target.value)} />
                  </div>
                  <div className="w-16">
                    <label className="form-label">Month</label>
                    <input type="text" className="form-input" placeholder="MM" value={edu.month} onChange={(e) => updateListEntry('education', index, 'month', e.target.value)} />
                  </div>
                  <div className="flex-1">
                    <label className="form-label">Description (School, Degree, Status)</label>
                    <input type="text" className="form-input" placeholder="e.g. Stanford University, CS (Admission)" value={edu.detail} onChange={(e) => updateListEntry('education', index, 'detail', e.target.value)} />
                  </div>
                  <button className="btn btn-danger p-2 h-[42px] w-[42px] flex items-center justify-center rounded-lg" onClick={() => removeListEntry('education', index)} title="Delete Entry">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Employment List */}
        {activeTab === 'work' && (
          <div className="editor-section-card animate-fade-in">
            <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-5">
              <h3 className="font-bold text-lg">Work Experience</h3>
              <button className="btn btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5" onClick={() => addListEntry('workExperience')}>
                <Plus size={14} /> Add Employment
              </button>
            </div>

            {(!data.workExperience || data.workExperience.length === 0) && (
              <p className="text-zinc-500 text-sm italic">No work experience entries added yet.</p>
            )}

            <div className="space-y-4">
              {data.workExperience?.map((work, index) => (
                <div key={work.id} className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 flex gap-3 items-end">
                  <div className="w-20">
                    <label className="form-label">Year</label>
                    <input type="text" className="form-input" placeholder="YYYY" value={work.year} onChange={(e) => updateListEntry('workExperience', index, 'year', e.target.value)} />
                  </div>
                  <div className="w-16">
                    <label className="form-label">Month</label>
                    <input type="text" className="form-input" placeholder="MM" value={work.month} onChange={(e) => updateListEntry('workExperience', index, 'month', e.target.value)} />
                  </div>
                  <div className="flex-1">
                    <label className="form-label">Description (Company, Role, Status)</label>
                    <input type="text" className="form-input" placeholder="e.g. Apex Tech - Developer (Joined)" value={work.detail} onChange={(e) => updateListEntry('workExperience', index, 'detail', e.target.value)} />
                  </div>
                  <button className="btn btn-danger p-2 h-[42px] w-[42px] flex items-center justify-center rounded-lg" onClick={() => removeListEntry('workExperience', index)} title="Delete Entry">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Certifications */}
        {activeTab === 'certs' && (
          <div className="editor-section-card animate-fade-in">
            <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-5">
              <h3 className="font-bold text-lg">Licenses & Certifications</h3>
              <button className="btn btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5" onClick={() => addListEntry('certifications')}>
                <Plus size={14} /> Add Certification
              </button>
            </div>

            {(!data.certifications || data.certifications.length === 0) && (
              <p className="text-zinc-500 text-sm italic">No certifications added yet.</p>
            )}

            <div className="space-y-4">
              {data.certifications?.map((cert, index) => (
                <div key={cert.id} className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 flex gap-3 items-end">
                  <div className="w-20">
                    <label className="form-label">Year</label>
                    <input type="text" className="form-input" placeholder="YYYY" value={cert.year} onChange={(e) => updateListEntry('certifications', index, 'year', e.target.value)} />
                  </div>
                  <div className="w-16">
                    <label className="form-label">Month</label>
                    <input type="text" className="form-input" placeholder="MM" value={cert.month} onChange={(e) => updateListEntry('certifications', index, 'month', e.target.value)} />
                  </div>
                  <div className="flex-1">
                    <label className="form-label">Description (Certificate Title)</label>
                    <input type="text" className="form-input" placeholder="e.g. JLPT N2 Certificate" value={cert.detail} onChange={(e) => updateListEntry('certifications', index, 'detail', e.target.value)} />
                  </div>
                  <button className="btn btn-danger p-2 h-[42px] w-[42px] flex items-center justify-center rounded-lg" onClick={() => removeListEntry('certifications', index)} title="Delete Entry">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: PR & Motivation */}
        {activeTab === 'pr' && (
          <div className="space-y-6 animate-fade-in">
            {/* Self-PR Section */}
            <div className="editor-section-card">
              <h3 className="font-bold text-lg border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">Self-PR (自己PR)</h3>
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Self-PR in English</label>
                  <textarea className="form-input form-textarea" placeholder="Describe your key strengths, achievements, and technical expertise..." value={data.selfPR || ''} onChange={(e) => onChange({ ...data, selfPR: e.target.value })} />
                </div>
                
                <div className="flex items-center gap-3">
                  <button className="btn btn-primary py-2 px-4 text-xs flex items-center gap-1.5" onClick={() => handleAITranslate('selfPR')} disabled={loadingSection === 'selfPR'}>
                    <Sparkles size={14} className={loadingSection === 'selfPR' ? 'animate-spin' : ''} />
                    {loadingSection === 'selfPR' ? 'Translating...' : 'Translate & Refine (AI)'}
                  </button>
                  <p className="text-[10px] text-zinc-500 font-medium">Uses Gemini to translate into professional business Keigo</p>
                </div>

                <div className="form-group mt-3">
                  <label className="form-label">Japanese Self-PR (Output Area)</label>
                  <textarea className="form-input form-textarea" style={{ height: '140px' }} value={data.selfPRJapanese || ''} onChange={(e) => onChange({ ...data, selfPRJapanese: e.target.value })} placeholder="AI-generated or manual Japanese text..." />
                </div>
              </div>
            </div>

            {/* Motivation Section */}
            <div className="editor-section-card">
              <h3 className="font-bold text-lg border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">Motivation (志望動機)</h3>
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Motivation in English</label>
                  <textarea className="form-input form-textarea" placeholder="Why do you want to join this company? Why work in Japan?..." value={data.motivation || ''} onChange={(e) => onChange({ ...data, motivation: e.target.value })} />
                </div>

                <div className="flex items-center gap-3">
                  <button className="btn btn-primary py-2 px-4 text-xs flex items-center gap-1.5" onClick={() => handleAITranslate('motivation')} disabled={loadingSection === 'motivation'}>
                    <Sparkles size={14} className={loadingSection === 'motivation' ? 'animate-spin' : ''} />
                    {loadingSection === 'motivation' ? 'Translating...' : 'Translate & Refine (AI)'}
                  </button>
                  <p className="text-[10px] text-zinc-500 font-medium">Uses Gemini to translate into polite resume format</p>
                </div>

                <div className="form-group mt-3">
                  <label className="form-label">Japanese Motivation (Output Area)</label>
                  <textarea className="form-input form-textarea" style={{ height: '120px' }} value={data.motivationJapanese || ''} onChange={(e) => onChange({ ...data, motivationJapanese: e.target.value })} placeholder="AI-generated or manual Japanese text..." />
                </div>
              </div>
            </div>

            {/* Minor Options Card */}
            <div className="editor-section-card">
              <h4 className="font-bold text-sm border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-4">Other Minor Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Commuting Time</label>
                  <input type="text" className="form-input" placeholder="e.g. 40 mins" value={data.commutingTime || ''} onChange={(e) => onChange({ ...data, commutingTime: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Dependents Count</label>
                  <input type="number" className="form-input" min="0" value={data.dependentsCount || '0'} onChange={(e) => onChange({ ...data, dependentsCount: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="form-group">
                  <label className="form-label">Spouse</label>
                  <select className="form-select" value={data.spouse || 'No'} onChange={(e) => onChange({ ...data, spouse: e.target.value })}>
                    <option value="Yes">Yes (有)</option>
                    <option value="No">No (無)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Spouse Support Duty</label>
                  <select className="form-select" value={data.spouseSupport || 'No'} onChange={(e) => onChange({ ...data, spouseSupport: e.target.value })}>
                    <option value="Yes">Yes (有)</option>
                    <option value="No">No (無)</option>
                  </select>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 6: AI Paste & Parse */}
        {activeTab === 'import' && (
          <div className="editor-section-card animate-fade-in">
            <h3 className="font-bold text-lg border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-2">⚡ Paste Raw English CV</h3>
            <p className="text-xs text-zinc-500 leading-normal mb-5">
              Have an existing English resume? Paste the raw text below and click "Parse CV" to automatically populate all sections of the form using AI (Gemini).
            </p>

            <div className="form-group">
              <textarea 
                className="form-input form-textarea" 
                style={{ height: '280px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }} 
                placeholder="Paste your LinkedIn PDF export or raw CV text here..." 
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                className="btn btn-primary py-2.5 px-6 text-sm flex items-center gap-2 rounded-xl"
                onClick={handleAIParse}
                disabled={loadingSection === 'parseCV'}
              >
                <Sparkles size={16} className={loadingSection === 'parseCV' ? 'animate-spin' : ''} />
                {loadingSection === 'parseCV' ? 'Parsing & Translating...' : 'Parse CV with AI'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ResumeEditor;
