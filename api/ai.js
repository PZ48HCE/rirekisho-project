// Vercel Serverless Function to securely proxy Gemini API requests
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not configured on the Vercel dashboard. Please set it in your environment variables.'
    });
  }

  const { action, text, sectionType } = req.body || {};

  if (!action) {
    return res.status(400).json({ error: 'Missing action parameter' });
  }

  try {
    if (action === 'translate') {
      const prompt = `You are a professional Japanese career consultant.
Translate the following English ${sectionType || 'Self-PR'} statement from a candidate's CV into natural, polished business Japanese (Rirekisho/Shokumukeirekisho standard).
Follow these guidelines:
- Use formal Japanese honorifics (敬語 - Keigo, especially 謙譲語 - Kenjougo to express modesty about achievements, e.g., using "努めました" or "貢献いたしました").
- Avoid translating word-for-word; instead, adapt the tone to sound like a native professional writing a resume.
- Ensure the character flow matches standard Japanese resumes (written in standard professional blocks).
- Do NOT add comments, explanations, markdown formatting (like "**"), or intro/outro text. Return ONLY the translated Japanese text.

English Text:
"${text}"`;

      const result = await callGeminiAPI(apiKey, prompt, false);
      return res.status(200).json({ result });
    } 
    
    else if (action === 'parse') {
      const jsonSchema = {
        personalInfo: {
          fullName: "Full name",
          fullNameKana: "Full name in Katakana (e.g. ジョン スミス) - guess if not present",
          birthDate: "YYYY-MM-DD format (extract or guess if not clear)",
          gender: "Male / Female / Other",
          phone: "Phone number",
          email: "Email address",
          address: "Mailing address",
          addressKana: "Optional: Mailing address in Katakana - guess phonetics if possible"
        },
        education: [
          { year: "YYYY", month: "MM", detail: "School Name, Major/Degree, Admission/Graduation (Admission or Graduation should be specified)" }
        ],
        workExperience: [
          { year: "YYYY", month: "MM", detail: "Company Name, Role Name (Joined or Resigned should be specified)" }
        ],
        certifications: [
          { year: "YYYY", month: "MM", detail: "License or Certification Name" }
        ],
        selfPR: "Extracted Self-PR or summary of qualifications in English",
        motivation: "Extracted career motivation or objective in English"
      };

      const prompt = `You are an AI resume parser. Parse the following raw CV text and extract the details into the JSON schema specified below.
Ensure you follow these rules:
- Format all dates in year/month fields as separate fields (year as YYYY, month as MM, e.g. year: "2018", month: "06").
- For education, list entries for BOTH Admission (入学) and Graduation (卒業) if possible, using details like "University Name, Computer Science (Admission)" and "University Name, Computer Science (Graduation)".
- For work experience, list entries for BOTH Joining (入社) and Resigning (退社) if possible.
- If a section is missing in the CV text, return an empty array for that list.
- Return ONLY the raw JSON string matching this schema. Do not include markdown codeblocks (like \`\`\`json).

JSON Schema:
${JSON.stringify(jsonSchema, null, 2)}

Raw CV Text:
${text}`;

      const jsonResultText = await callGeminiAPI(apiKey, prompt, true);
      let cleanedJson = jsonResultText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
      
      try {
        const parsed = JSON.parse(cleanedJson);
        return res.status(200).json(parsed);
      } catch (err) {
        return res.status(500).json({ error: 'Failed to parse AI response as valid JSON schema.' });
      }
    } 
    
    else {
      return res.status(400).json({ error: 'Invalid action parameter' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message || 'An error occurred during API processing.' });
  }
}

async function callGeminiAPI(apiKey, prompt, jsonMode = false) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }]
  };
  if (jsonMode) {
    requestBody.generationConfig = { responseMimeType: "application/json" };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API Error: ${errText}`);
  }

  const data = await response.json();
  const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!outputText) {
    throw new Error("No response content from Gemini.");
  }
  return outputText.trim();
}
