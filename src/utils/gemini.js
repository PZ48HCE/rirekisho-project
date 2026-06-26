// API caller for client-side Gemini requests

const getGeminiUrl = (model = 'gemini-1.5-flash', key) => {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
};

/**
 * Call Gemini to generate text or json.
 */
async function callGemini(apiKey, prompt, jsonMode = false) {
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please set it in Settings.");
  }

  const model = "gemini-1.5-flash";
  const url = getGeminiUrl(model, apiKey);

  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ]
  };

  if (jsonMode) {
    requestBody.generationConfig = {
      responseMimeType: "application/json"
    };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errText = await response.text();
    let errMessage = `API Error (${response.status})`;
    try {
      const errJson = JSON.parse(errText);
      errMessage = errJson.error?.message || errMessage;
    } catch (_) {}
    throw new Error(errMessage);
  }

  const data = await response.json();
  const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!outputText) {
    throw new Error("No response content received from AI.");
  }

  return outputText.trim();
}

/**
 * Translates and localizes Self-PR / Motivation sections into professional Japanese (Keigo/Kenjougo).
 */
export async function translateToJapaneseBusiness(apiKey, englishText, sectionType = "Self-PR") {
  const prompt = `You are a professional Japanese career consultant.
Translate the following English ${sectionType} statement from a candidate's CV into natural, polished business Japanese (Rirekisho/Shokumukeirekisho standard).
Follow these guidelines:
- Use formal Japanese honorifics (敬語 - Keigo, especially 謙譲語 - Kenjougo to express modesty about achievements, e.g., using "努めました" or "貢献いたしました").
- Avoid translating word-for-word; instead, adapt the tone to sound like a native professional writing a resume.
- Ensure the character flow matches standard Japanese resumes (written in standard professional blocks).
- Do NOT add comments, explanations, markdown formatting (like "**"), or intro/outro text. Return ONLY the translated Japanese text.

English Text:
"${englishText}"`;

  return await callGemini(apiKey, prompt, false);
}

/**
 * Parses raw pasted CV text into the structured resume JSON schema.
 */
export async function parseCvText(apiKey, rawCvText) {
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
${rawCvText}`;

  const jsonResultText = await callGemini(apiKey, prompt, true);
  
  // Clean up code block backticks if the model ignored the instructions
  let cleanedJson = jsonResultText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
  
  try {
    return JSON.parse(cleanedJson);
  } catch (err) {
    console.error("Gemini failed to output parsable JSON. Cleaned output was:", cleanedJson);
    throw new Error("Failed to parse the AI response as valid resume data. Please try copy-pasting smaller sections or verify the text layout.");
  }
}
