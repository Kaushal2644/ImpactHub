const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Helper to call Gemini
const callGemini = async (prompt) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash"
  });

  const result = await model.generateContent(prompt);

  return result.response.text();
};

// Helper to parse JSON from response
const parseJSON = (text) => {
  try {
    const clean = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    return JSON.parse(clean);
  } catch (err) {
    console.error("JSON Parse Error:", text);
    throw err;
  }
};

// Analyze field report
const analyzeFieldReport = async (reportData) => {
  const prompt = `
You are an expert community needs analyst. Analyze this field report and provide structured insights.

Field Report:
Title: ${reportData.title}
Location: ${reportData.location}
Summary: ${reportData.summary}
Type: ${reportData.type}

Respond ONLY in this exact JSON format (no markdown, no extra text):
{
  "suggestedUrgency": "critical",
  "suggestedCategory": "disaster relief",
  "cleanSummary": "A clean 2-3 sentence professional summary",
  "keyFindings": ["finding 1", "finding 2", "finding 3"],
  "recommendedActions": ["action 1", "action 2", "action 3"],
  "estimatedPriority": "8",
  "reasoning": "Brief explanation of urgency assessment"
}

Valid urgency values: critical, high, medium, low
Valid category values: disaster relief, sanitation, education, food security, elderly care, mental health, healthcare, infrastructure, other
`
  const text = await callGemini(prompt)
  return parseJSON(text)
}

// Generate need description
const generateNeedDescription = async (needData) => {
  const prompt = `
You are a community welfare expert. Generate a compelling community need description.

Need Details:
Title: ${needData.title}
Category: ${needData.category}
Location: ${needData.location}
People Affected: ${needData.peopleAffected}
Urgency: ${needData.urgency}

Respond ONLY in this exact JSON format (no markdown, no extra text):
{
  "description": "A compelling 3-4 sentence description of the community need",
  "requiredSkills": ["skill1", "skill2", "skill3"],
  "suggestedVolunteers": 5,
  "keyPoints": ["point1", "point2", "point3"]
}
`
  const text = await callGemini(prompt)
  return parseJSON(text)
}

// Explain match
const explainMatch = async (ngo, need) => {
  const prompt = `
You are a volunteer coordination expert. Explain why this NGO is a good match for this community need.

NGO:
Name: ${ngo.name}
Specializations: ${ngo.specializations.join(', ')}
Location: ${ngo.operatingLocation}
Efficiency Score: ${ngo.efficiencyScore}%
Service Radius: ${ngo.serviceRadius}

Community Need:
Title: ${need.title}
Category: ${need.category}
Location: ${need.location}
Urgency: ${need.urgency}
Description: ${need.description}

Respond ONLY in this exact JSON format (no markdown, no extra text):
{
  "matchExplanation": "2-3 sentence explanation of why this is a good match",
  "strengths": ["strength1", "strength2", "strength3"],
  "considerations": ["consideration1", "consideration2"],
  "confidenceLevel": "high",
  "recommendation": "A one sentence final recommendation"
}

Valid confidenceLevel values: high, medium, low
`
  const text = await callGemini(prompt)
  return parseJSON(text)
}

// Community insights
const getCommunityInsights = async (needs, ngos, reports) => {
  const prompt = `
You are a community development expert. Analyze this community data and provide actionable insights.

Community Needs:
${needs.map(n => `- ${n.title} (${n.urgency}, ${n.location}, ${n.category})`).join('\n')}

Available NGOs:
${ngos.map(n => `- ${n.name} (${n.specializations.join(', ')}, ${n.efficiencyScore}% efficiency)`).join('\n')}

Recent Field Reports:
${reports.map(r => `- ${r.title} (${r.urgencyObserved}, ${r.location})`).join('\n')}

Respond ONLY in this exact JSON format (no markdown, no extra text):
{
  "overallSituation": "2-3 sentence overview of the community situation",
  "criticalAreas": ["area1", "area2", "area3"],
  "topPriorities": [
    {"priority": "priority title", "reason": "why this is urgent"},
    {"priority": "priority title", "reason": "why this is urgent"},
    {"priority": "priority title", "reason": "why this is urgent"}
  ],
  "resourceGaps": ["gap1", "gap2"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "positiveHighlights": ["highlight1", "highlight2"]
}
`
  const text = await callGemini(prompt)
  return parseJSON(text)
}

// AI Chatbot
const chatWithAI = async (message, context) => {
  const prompt = `
You are ImpactHub AI Assistant, a helpful assistant for a community volunteer platform.
You help coordinators understand community needs, match volunteers, and prioritize resources.

Current Platform Data:

STATISTICS:
- Total Open Needs: ${context.totalNeeds}
- Critical Needs: ${context.criticalNeeds}
- Active NGOs: ${context.totalNGOs}

ACTIVE NGOs:
${context.ngos?.map(n => `
- Name: ${n.name}
  Location: ${n.operatingLocation}
  Specializations: ${n.specializations.join(', ')}
  Efficiency: ${n.efficiencyScore}%
  Capacity: ${n.currentAssignments}/${n.assignmentCapacity} assignments
  Coverage: ${n.serviceRadius}
`).join('') || 'No NGOs available'}

OPEN COMMUNITY NEEDS:
${context.openNeeds?.map(n => `
- Title: ${n.title}
  Category: ${n.category}
  Urgency: ${n.urgency}
  Location: ${n.location}
  People Affected: ${n.peopleAffected}
  Status: ${n.status}
  Volunteers: ${n.volunteersAssigned}/${n.volunteersNeeded}
`).join('') || 'No open needs'}

RECENT FIELD REPORTS:
${context.reports?.map(r => `
- Title: ${r.title}
  Location: ${r.location}
  Urgency: ${r.urgencyObserved}
  Category: ${r.category}
  Converted: ${r.isConverted ? 'Yes' : 'No'}
`).join('') || 'No recent reports'}

User Question: ${message}

Instructions:
- Answer based on the real data provided above
- Be specific — mention actual NGO names, need titles, locations
- Be concise — keep response under 200 words
- Be helpful and professional
- If asked about a specific NGO or need, give detailed information from the data
- Do not use markdown formatting
- Do not make up data that is not provided above
`
  const text = await callGemini(prompt)
  return text
}

module.exports = {
  analyzeFieldReport,
  generateNeedDescription,
  explainMatch,
  getCommunityInsights,
  chatWithAI
}