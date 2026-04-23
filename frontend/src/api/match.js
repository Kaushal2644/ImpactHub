import API from './axios'

export const getSmartMatches = (params) => API.get('/match', { params })
export const assignNGO = (data) => API.post('/match/assign', data)