import API from './axios'

export const analyzeReport = (data) => API.post('/ai/analyze-report', data)
export const generateDescription = (data) => API.post('/ai/generate-description', data)
export const explainMatch = (data) => API.post('/ai/explain-match', data)
export const getInsights = () => API.get('/ai/insights')
export const sendChatMessage = (message) => API.post('/ai/chat', { message })