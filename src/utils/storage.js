const STORAGE_KEY = 'konnichicv_resume_data';
const API_KEY_KEY = 'konnichicv_gemini_key';

export const defaultResumeData = {
  personalInfo: {
    fullName: "John Smith",
    fullNameKana: "ジョン スミス",
    birthDate: "1996-05-15",
    gender: "Male",
    phone: "+81 80-1234-5678",
    email: "john.smith@example.com",
    address: "2-chome-1-1 Nihonbashi, Chuo City, Tokyo",
    addressKana: "トウキョウト チュウオウク ニホンバシ ニチョウメ イチノイチ",
    photoUrl: ""
  },
  education: [
    { id: "edu-1", year: "2014", month: "09", detail: "Stanford University, Computer Science Major (Admission)" },
    { id: "edu-2", year: "2018", month: "06", detail: "Stanford University, Computer Science Major (Graduation)" }
  ],
  workExperience: [
    { id: "work-1", year: "2018", month: "08", detail: "Apex Global Technology Inc. - Frontend Developer (Joined)" },
    { id: "work-2", year: "2021", month: "12", detail: "Apex Global Technology Inc. - Frontend Developer (Resigned)" },
    { id: "work-3", year: "2022", month: "01", detail: "NextGen Software K.K. - Senior Full Stack Engineer (Joined)" }
  ],
  certifications: [
    { id: "cert-1", year: "2018", month: "12", detail: "Japanese Language Proficiency Test (JLPT) N2 Pass" },
    { id: "cert-2", year: "2020", month: "05", detail: "AWS Certified Solutions Architect - Associate" }
  ],
  selfPR: "I am a frontend developer with over 6 years of experience in React and UI/UX engineering. I enjoy solving complex scalability challenges. In my previous role at Apex Global Technology, I led the redesign of the client dashboard which improved user engagement by 25%. I am bilingual in English and conversational Japanese (N2), and I look forward to contributing my technical skills and international perspective to software projects in Japan.",
  selfPRJapanese: "私はReactおよびUI/UXエンジニアリング分野で6年以上の経験を持つフロントエンドデベロッパーです。スケーラビリティの課題解決に情熱を持って取り組んでいます。前職のApex Global Technologyでは、クライアントダッシュボードの再設計を主導し、ユーザーエンゲージメントを25％向上させました。英語と日本語（日常会話レベル・JLPT N2）のバイリンガルであり、技術スキルと国際的な視野を活かして日本のソフトウェアプロジェクトに貢献したいと考えています。",
  motivation: "I have always admired Japan's craftsmanship culture and its rapid growth in the modern startup scene. Joining a Tokyo-based global tech company allows me to bridge communication gaps, work alongside world-class developers, and accelerate local engineering standards.",
  motivationJapanese: "日本の「ものづくり」精神と、現代のスタートアップシーンの急速な成長に以前から深い感銘を受けてまいりました。東京を拠点とするグローバル企業に参画することで、開発チームとの懸け橋となり、世界水準のエンジニアと共に地域の技術水準の向上に貢献したいと考え、志望いたしました。",
  commutingTime: "40 mins",
  dependentsCount: "0",
  spouse: "No",
  spouseSupport: "No"
};

export const loadResumeData = () => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized === null) {
      return defaultResumeData;
    }
    return JSON.parse(serialized);
  } catch (err) {
    console.error("Could not load resume data", err);
    return defaultResumeData;
  }
};

export const saveResumeData = (data) => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.error("Could not save resume data", err);
  }
};

export const loadGeminiKey = () => {
  try {
    return localStorage.getItem(API_KEY_KEY) || '';
  } catch (err) {
    return '';
  }
};

export const saveGeminiKey = (key) => {
  try {
    localStorage.setItem(API_KEY_KEY, key);
  } catch (err) {
    console.error("Could not save API Key", err);
  }
};

export const exportToJsonFile = (data) => {
  const fileData = JSON.stringify(data, null, 2);
  const blob = new Blob([fileData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = `japanese_resume_${new Date().toISOString().slice(0, 10)}.json`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};
