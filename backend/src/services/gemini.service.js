const axios = require('axios');

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
// gemini-2.5-flash confirmed working with this API key
const GEMINI_MODEL = 'gemini-2.5-flash';


/**
 * Call Gemini API with a prompt
 */
async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');

  const url = `${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const response = await axios.post(
    url,
    {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024,
      },
    },
    { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
  );

  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');
  return text;
}

/**
 * Generate AI explanation for a vulnerability
 */
async function explainVulnerability(vuln) {
  const prompt = `You are a senior application security engineer. Explain the following security vulnerability clearly and concisely for a developer audience.

Vulnerability Details:
- Title: ${vuln.title}
- Severity: ${vuln.severity}
- Scanner: ${vuln.scannerSource}
- Rule ID: ${vuln.ruleId || 'N/A'}
- File: ${vuln.filePath || 'N/A'}${vuln.lineNumber ? ` (line ${vuln.lineNumber})` : ''}
- Description: ${vuln.description}

Please provide:
1. **What it is** (1-2 sentences explaining the vulnerability type)
2. **Why it's dangerous** (1-2 sentences on real-world impact)
3. **How it can be exploited** (1-2 sentences on attack scenario)
4. **CVSS-like risk assessment** (rate: Critical/High/Medium/Low with brief justification)

Keep your response concise, technical, and actionable. Format using markdown.`;

  return await callGemini(prompt);
}

/**
 * Generate AI remediation steps for a vulnerability
 */
async function remediateVulnerability(vuln) {
  const prompt = `You are a senior application security engineer. Provide concrete, actionable remediation steps for this security vulnerability.

Vulnerability Details:
- Title: ${vuln.title}
- Severity: ${vuln.severity}
- Scanner: ${vuln.scannerSource}
- Rule ID: ${vuln.ruleId || 'N/A'}
- File: ${vuln.filePath || 'N/A'}${vuln.lineNumber ? ` (line ${vuln.lineNumber})` : ''}
- Description: ${vuln.description}
- Existing remediation hint: ${vuln.remediation || 'None'}

Please provide:
1. **Immediate fix** (specific code change or configuration step)
2. **Step-by-step remediation** (numbered list, 3-5 steps)
3. **Code example** (before/after snippet if applicable, use code blocks)
4. **Verification** (how to confirm the fix worked)
5. **Prevention** (1-2 practices to avoid this in future)

Be specific to the vulnerability type and programming context. Format using markdown.`;

  return await callGemini(prompt);
}

module.exports = { explainVulnerability, remediateVulnerability };
