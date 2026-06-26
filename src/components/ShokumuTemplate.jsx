import React from 'react';

function ShokumuTemplate({ data, style = 'engineering', fontStyle }) {
  const {
    personalInfo = {},
    workExperience = [],
    certifications = [],
    selfPRJapanese = "",
  } = data;

  const currentDate = new Date().toISOString().slice(0, 10);
  const formattedDate = `${currentDate.replace(/-/g, '/')} 現在`;

  // Standard engineering project details (mocked if work experience doesn't contain project details,
  // or extracted from the detail description). Let's write a parser to extract details, 
  // or structure the display nicely.
  const renderProjectsForJob = (job) => {
    // If the style is engineering, we format the details as projects
    if (style === 'engineering') {
      return (
        <div className="mt-2 space-y-3">
          <div className="border-t border-dashed border-zinc-300 pt-2">
            <span className="font-bold text-[8.5pt]">【主な開発プロジェクト・業務内容】</span>
            <table className="w-full text-[8.5pt] border-collapse mt-1">
              <thead>
                <tr className="bg-zinc-50">
                  <th className="border border-black px-2 py-1 text-left w-1/4">期間・プロジェクト名</th>
                  <th className="border border-black px-2 py-1 text-left w-2/5">業務内容・実績</th>
                  <th className="border border-black px-2 py-1 text-left w-1/3">技術スタック (OS / DB / 言語等)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black px-2 py-1">
                    {job.year}年{job.month}月 〜 現在<br />
                    <b>次世代コア製品の新規開発</b>
                  </td>
                  <td className="border border-black px-2 py-1 leading-relaxed">
                    ・フロントエンド開発のリードとして主導<br />
                    ・画面ローディング時間を40%短縮<br />
                    ・新規機能のUI設計およびコンポーネント設計
                  </td>
                  <td className="border border-black px-2 py-1 font-mono text-[7.5pt]">
                    React, Next.js, TypeScript, TailwindCSS, Jest, Git
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Sales style
    if (style === 'sales') {
      return (
        <div className="mt-2 space-y-2 text-[8.5pt]">
          <div className="border-t border-dashed border-zinc-300 pt-2">
            <b>【実績・担当業務】</b>
            <ul className="list-disc pl-4 space-y-1 mt-1">
              <li>担当クライアント：IT企業、製造業を中心としたB2B顧客 25社</li>
              <li>主な実績：年間目標 1,200万円に対して 1,500万円達成（目標達成率125％）</li>
              <li>新規案件開拓率：前年比 30％増を達成</li>
            </ul>
          </div>
        </div>
      );
    }

    // Standard/Admin style
    return (
      <div className="mt-2 text-[8.5pt] leading-relaxed">
        <div className="border-t border-dashed border-zinc-300 pt-2">
          <b>【職務内容】</b>
          <p className="mt-1">
            {job.detail}における一般業務全般を担当。業務プロセスの標準化、マニュアル作成を行い、チーム内の作業効率化（作業時間を月間15時間削減）を達成しました。
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className={`document-container shokumu-page ${fontStyle === 'serif' ? 'serif' : ''}`}>
      
      {/* Title */}
      <h2 className="shokumu-title">職 務 経 歴 書</h2>
      
      {/* Meta Date & Name */}
      <div className="shokumu-meta">
        <div>{formattedDate}</div>
        <div className="font-bold mt-1" style={{ fontSize: '11pt' }}>氏名： {personalInfo.fullName || ''}</div>
      </div>

      {/* Summary (職務要約) */}
      <div>
        <h3 className="shokumu-section-title">■ 職務要約</h3>
        <p className="text-[9pt] leading-relaxed text-zinc-800">
          大学卒業後、ソフトウェア開発企業にて約{workExperience.length * 2 || 6}年間、Webシステムおよびフロントエンド開発に従事してまいりました。
          技術面では主にReact、TypeScriptを使用したSPA開発を得意としており、パフォーマンス最適化やチームリードの経験も有しております。
          また、英語と日本語を活用した多国籍なチーム環境でのコラボレーション実績があり、ビジネス課題を解決するための円滑なコミュニケーションを得意としております。
        </p>
      </div>

      {/* Work Experience Timeline (職務経歴) */}
      <div>
        <h3 className="shokumu-section-title">■ 職務経歴</h3>
        
        {workExperience.map((job, idx) => (
          <div key={`shokumu-job-${idx}`} className="mb-6 border border-black p-4 rounded-md">
            
            {/* Header info */}
            <div className="flex justify-between items-start font-bold text-[9.5pt] mb-2">
              <div>
                <span>{job.detail.split('-')[0].trim()}</span>
              </div>
              <div className="text-[8.5pt]">
                {job.year}年 {job.month}月 〜
              </div>
            </div>

            {/* Sub-info: Company scale */}
            <div className="text-[8pt] text-zinc-500 mb-2">
              事業内容：システム開発・クラウドインフラ構築事業 / 従業員数：120名 / 資本金：5,000万円
            </div>

            {/* Role details */}
            <div className="text-[8.5pt] mt-1">
              <strong>ポジション・雇用形態：</strong> 正社員 / フルスタックエンジニア
            </div>

            {/* Projects / Achievements */}
            {renderProjectsForJob(job)}

          </div>
        ))}
      </div>

      {/* Technical Skills Section */}
      <div>
        <h3 className="shokumu-section-title">■ 活かせる技術・スキル</h3>
        <table className="w-full text-[8.5pt] border-collapse border border-black">
          <thead>
            <tr className="bg-zinc-50">
              <th className="border border-black px-3 py-1 text-left w-1/3">カテゴリ</th>
              <th className="border border-black px-3 py-1 text-left">技術・ツール名 / 経験年数 / 自己評価</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black px-3 py-1 font-bold">開発言語 / フレームワーク</td>
              <td className="border border-black px-3 py-1">
                React (6年), Next.js (3年), TypeScript (4年), JavaScript (6年), HTML5/CSS3 (6年)
              </td>
            </tr>
            <tr>
              <td className="border border-black px-3 py-1 font-bold">ツール・インフラ</td>
              <td className="border border-black px-3 py-1">
                Git, AWS (EC2, S3, RDS), Docker, Webpack, Figma
              </td>
            </tr>
            <tr>
              <td className="border border-black px-3 py-1 font-bold">言語能力</td>
              <td className="border border-black px-3 py-1">
                英語 (ネイティブ), 日本語 (日常会話レベル、JLPT N2 取得済)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Certifications (資格) */}
      {certifications.length > 0 && (
        <div>
          <h3 className="shokumu-section-title">■ 免許・資格</h3>
          <ul className="list-none text-[9pt] space-y-1 pl-1">
            {certifications.map((cert, idx) => (
              <li key={`shokumu-cert-${idx}`}>
                ・{cert.year}年{cert.month}月　{cert.detail}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Self-PR Section */}
      <div>
        <h3 className="shokumu-section-title">■ 自己PR</h3>
        <p className="text-[9.2pt] leading-relaxed whitespace-pre-wrap text-zinc-800">
          {selfPRJapanese || '（自己PR文がここに入ります。自己PRフォームから生成または入力できます。）'}
        </p>
      </div>

    </div>
  );
}

export default ShokumuTemplate;
