import API from './axios'

export const getNeeds = (params) => API.get('/needs', { params })
export const createNeed = (data) => API.post('/needs', data)
export const updateNeed = (id, data) => API.put(`/needs/${id}`, data)
export const deleteNeed = (id) => API.delete(`/needs/${id}`)
export const getDashboardStats = () => API.get('/needs/stats')