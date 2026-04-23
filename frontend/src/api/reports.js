import API from './axios'

export const getReports = () => API.get('/reports')
export const createReport = (data) => API.post('/reports', data)
export const deleteReport = (id) => API.delete(`/reports/${id}`)
export const convertToNeed = (id) => API.post(`/reports/${id}/convert`)