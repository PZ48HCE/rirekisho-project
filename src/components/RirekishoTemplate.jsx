import React from 'react';

// Simple helper to calculate age based on birthDate
const calculateAge = (birthDateStr) => {
  if (!birthDateStr) return '';
  const birthDate = new Date(birthDateStr);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Formats year/month to Japanese style if requested, or displays as-is
const formatJapaneseDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日現在`;
};

function RirekishoTemplate({ data, fontStyle }) {
  const {
    personalInfo = {},
    education = [],
    workExperience = [],
    certifications = [],
    selfPRJapanese = "",
    motivationJapanese = "",
    commutingTime = "",
    dependentsCount = "0",
    spouse = "No",
    spouseSupport = "No"
  } = data;

  const age = calculateAge(personalInfo.birthDate);
  const currentDateFormatted = formatJapaneseDate(new Date().toISOString().slice(0, 10));

  // Merge education and work history for the single main table grid
  // Standard JIS has a single large table for both
  const historyRows = [];
  
  // 1. Education Section
  historyRows.push({ year: '', month: '', detail: '学　　歴', isHeader: true });
  education.forEach(edu => {
    historyRows.push({ year: edu.year, month: edu.month, detail: edu.detail });
  });

  // 2. Work Experience Section
  historyRows.push({ year: '', month: '', detail: '職　　歴', isHeader: true });
  workExperience.forEach(work => {
    historyRows.push({ year: work.year, month: work.month, detail: work.detail });
  });
  
  // Append "以上" (End) right-aligned in the last work experience row
  if (historyRows.length > 2) {
    historyRows.push({ year: '', month: '', detail: '以上', isEnd: true });
  }

  // A standard Rirekisho table has exactly 14 rows for history.
  // We pad with empty rows if the total is less than 14.
  const TOTAL_HISTORY_ROWS = 14;
  const paddingRowsCount = Math.max(0, TOTAL_HISTORY_ROWS - historyRows.length);
  for (let i = 0; i < paddingRowsCount; i++) {
    historyRows.push({ year: '', month: '', detail: '' });
  }

  // Certifications grid: standard 6 rows
  const certRows = [...certifications];
  const TOTAL_CERT_ROWS = 6;
  const certPaddingCount = Math.max(0, TOTAL_CERT_ROWS - certRows.length);
  for (let i = 0; i < certPaddingCount; i++) {
    certRows.push({ year: '', month: '', detail: '' });
  }

  // Split birthDate into YYYY / MM / DD
  let birthYear = '', birthMonth = '', birthDay = '';
  if (personalInfo.birthDate) {
    const parts = personalInfo.birthDate.split('-');
    if (parts.length === 3) {
      birthYear = parts[0];
      birthMonth = parts[1];
      birthDay = parts[2];
    }
  }

  return (
    <div className={`document-container rirekisho-page ${fontStyle === 'serif' ? 'serif' : ''}`}>
      
      {/* Title & Date */}
      <div className="rirekisho-header">
        <h2 className="rirekisho-title">履　歴　書</h2>
        <div className="rirekisho-date">
          {currentDateFormatted}
        </div>
      </div>

      {/* Profile Info Box */}
      <div className="profile-box">
        <div className="profile-info">
          
          {/* Furigana Row */}
          <div className="profile-info-row furigana-row" style={{ gridTemplateColumns: '80px 1fr' }}>
            <div className="border-r border-black flex items-center justify-center font-bold text-[7pt]" style={{ height: '100%' }}>
              フリガナ
            </div>
            <div className="flex items-center pl-2 text-[7pt] tracking-wider">
              {personalInfo.fullNameKana || ''}
            </div>
          </div>

          {/* Full Name Row */}
          <div className="profile-info-row" style={{ gridTemplateColumns: '80px 1fr 100px', minHeight: '50px' }}>
            <div className="border-r border-black flex items-center justify-center font-bold text-[9pt]">
              氏　　名
            </div>
            <div className="flex items-center pl-4 font-bold text-[14pt]">
              {personalInfo.fullName || ''}
            </div>
            <div className="border-l border-black flex items-center justify-center">
              <div className="hanko-slot">印</div>
            </div>
          </div>

          {/* Birthday / Gender Row */}
          <div className="profile-info-row" style={{ gridTemplateColumns: '80px 1fr 100px' }}>
            <div className="border-r border-black flex items-center justify-center font-bold text-[8pt]">
              生年月日
            </div>
            <div className="flex items-center pl-2 text-[9pt]">
              {birthYear ? `${birthYear}年 ${birthMonth}月 ${birthDay}日生` : ''}
              {age !== '' ? ` （満 ${age} 歳）` : ''}
            </div>
            <div className="border-l border-black flex items-center justify-center text-[9pt] gap-2" style={{ gap: '6px' }}>
              <span className={personalInfo.gender === 'Male' ? 'gender-circle' : ''}>男</span>
              <span style={{ color: '#d1d5db', fontSize: '7pt' }}>・</span>
              <span className={personalInfo.gender === 'Female' ? 'gender-circle' : ''}>女</span>
            </div>
          </div>

        </div>

        {/* Photo Box */}
        <div className="profile-photo-slot">
          {personalInfo.photoUrl ? (
            <img src={personalInfo.photoUrl} alt="Profile" className="profile-photo-img" />
          ) : (
            <div className="photo-placeholder-text">
              写真貼付
              <br />
              <span style={{ fontSize: '6.5pt' }}>
                横 24〜30mm
                <br />
                縦 36〜40mm
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Address & Contact Info Box */}
      <div style={{ border: '1px solid #000000', marginBottom: '8px' }}>
        {/* Present Address Furigana */}
        <div className="profile-info-row furigana-row" style={{ gridTemplateColumns: '80px 1fr', borderBottom: '1px solid #000000' }}>
          <div className="border-r border-black flex items-center justify-center font-bold text-[7pt]">ふりがな</div>
          <div className="flex items-center pl-2 text-[7pt]">{personalInfo.addressKana || ''}</div>
        </div>

        {/* Present Address */}
        <div className="profile-info-row" style={{ gridTemplateColumns: '80px 1fr', borderBottom: '1px solid #000000', minHeight: '44px' }}>
          <div className="border-r border-black flex items-center justify-center font-bold text-[8.5pt]">現 住 所</div>
          <div className="flex items-start pl-2 pt-1 text-[9pt] leading-normal">{personalInfo.address || ''}</div>
        </div>

        {/* Phone & Email Row */}
        <div className="profile-info-row" style={{ gridTemplateColumns: '80px 1.2fr 60px 1fr' }}>
          <div className="border-r border-black flex items-center justify-center font-bold text-[8pt]">電話番号</div>
          <div className="border-r border-black flex items-center pl-2 text-[9pt]">{personalInfo.phone || ''}</div>
          <div className="border-r border-black flex items-center justify-center font-bold text-[8pt]">E-mail</div>
          <div className="flex items-center pl-2 text-[8.5pt]">{personalInfo.email || ''}</div>
        </div>
      </div>

      {/* Education & Work Experience Table */}
      <table className="history-table">
        <thead>
          <tr>
            <th className="col-year" style={{ fontSize: '8.5pt', fontWeight: 'bold' }}>年</th>
            <th className="col-month" style={{ fontSize: '8.5pt', fontWeight: 'bold' }}>月</th>
            <th className="col-detail" style={{ fontSize: '8.5pt', fontWeight: 'bold', textAlign: 'center' }}>学　歴　・　職　歴</th>
          </tr>
        </thead>
        <tbody>
          {historyRows.map((row, idx) => {
            if (row.isHeader) {
              return (
                <tr key={`history-${idx}`} style={{ height: '20px' }}>
                  <td className="col-year"></td>
                  <td className="col-month"></td>
                  <td className="col-detail" style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '9pt' }}>
                    {row.detail}
                  </td>
                </tr>
              );
            }
            if (row.isEnd) {
              return (
                <tr key={`history-${idx}`} style={{ height: '20px' }}>
                  <td className="col-year"></td>
                  <td className="col-month"></td>
                  <td className="col-detail" style={{ textAlign: 'right', paddingRight: '20px', fontSize: '9pt', fontWeight: 'bold' }}>
                    {row.detail}
                  </td>
                </tr>
              );
            }
            return (
              <tr key={`history-${idx}`} style={{ height: '20px' }}>
                <td className="col-year">{row.year}</td>
                <td className="col-month">{row.month}</td>
                <td className="col-detail" style={{ fontSize: '9.2pt' }}>{row.detail}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Licenses & Certifications Table */}
      <table className="history-table">
        <thead>
          <tr>
            <th className="col-year" style={{ fontSize: '8.5pt', fontWeight: 'bold' }}>年</th>
            <th className="col-month" style={{ fontSize: '8.5pt', fontWeight: 'bold' }}>月</th>
            <th className="col-detail" style={{ fontSize: '8.5pt', fontWeight: 'bold', textAlign: 'center' }}>免　許　・　資　格</th>
          </tr>
        </thead>
        <tbody>
          {certRows.map((row, idx) => (
            <tr key={`cert-${idx}`} style={{ height: '21px' }}>
              <td className="col-year">{row.year}</td>
              <td className="col-month">{row.month}</td>
              <td className="col-detail" style={{ fontSize: '9.2pt' }}>{row.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Motivation, Self-PR, Commute Box */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '8px', marginBottom: '4px' }}>
        
        {/* Left: Self-PR & Motivation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div className="pr-motivation-box" style={{ minHeight: '92px' }}>
            <div className="pr-motivation-title">志望の動機 (Reason for Application)</div>
            <div className="pr-motivation-content" style={{ fontSize: '8.5pt', padding: '4px 6px' }}>
              {motivationJapanese || '（志望動機がここに入ります）'}
            </div>
          </div>
          
          <div className="pr-motivation-box" style={{ minHeight: '92px' }}>
            <div className="pr-motivation-title">自己PR (Self-Promotion)</div>
            <div className="pr-motivation-content" style={{ fontSize: '8.5pt', padding: '4px 6px' }}>
              {selfPRJapanese || '（自己PRがここに入ります）'}
            </div>
          </div>
        </div>

        {/* Right: Commute, Dependents, Spouse details */}
        <div style={{ border: '1px solid #000000', display: 'flex', flexDirection: 'column' }}>
          
          {/* Commute Time */}
          <div style={{ borderBottom: '1px solid #000000', padding: '5px 8px', flex: 1 }}>
            <div style={{ fontSize: '7.5pt', fontWeight: 'bold', marginBottom: '2px' }}>通勤時間</div>
            <div style={{ fontSize: '9pt' }}>{commutingTime ? `約 ${commutingTime}` : ''}</div>
          </div>

          {/* Dependents */}
          <div style={{ borderBottom: '1px solid #000000', padding: '5px 8px', flex: 1 }}>
            <div style={{ fontSize: '7.5pt', fontWeight: 'bold', marginBottom: '2px' }}>扶養家族数 (配偶者を除く)</div>
            <div style={{ fontSize: '9pt' }}>{dependentsCount || '0'} 人</div>
          </div>

          {/* Spouse */}
          <div style={{ borderBottom: '1px solid #000000', display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1 }}>
            <div className="border-r border-black padding-box" style={{ padding: '4px 8px' }}>
              <div style={{ fontSize: '7.5pt', fontWeight: 'bold', marginBottom: '2px' }}>配偶者</div>
              <div style={{ fontSize: '8.5pt' }}>{spouse === 'Yes' ? '有' : '無'}</div>
            </div>
            <div className="padding-box" style={{ padding: '4px 8px' }}>
              <div style={{ fontSize: '7.5pt', fontWeight: 'bold', marginBottom: '2px' }}>配偶者の扶養義務</div>
              <div style={{ fontSize: '8.5pt' }}>{spouseSupport === 'Yes' ? '有' : '無'}</div>
            </div>
          </div>

          {/* Request/Remarks */}
          <div style={{ padding: '6px 8px', flex: 2 }}>
            <div style={{ fontSize: '7.5pt', fontWeight: 'bold', marginBottom: '2px' }}>本人希望記入欄</div>
            <div style={{ fontSize: '7.5pt', color: '#71717a', lineHeight: '1.2' }}>
              （特に給与・職種・勤務時間・勤務地等について希望がある場合は記入）
              <br />
              貴社規定に従います。
            </div>
          </div>

        </div>
      </div>

      {/* Signature Footer */}
      <div className="rirekisho-footer">
        <div>KonnichiCV Generated Resume</div>
        <div>Page 1 of 1</div>
      </div>

    </div>
  );
}

export default RirekishoTemplate;
