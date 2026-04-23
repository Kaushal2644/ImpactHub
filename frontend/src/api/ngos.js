import API from './axios'

export const getNGOs = (params) => API.get('/ngos', { params })
export const createNGO = (data) => API.post('/ngos', data)
export const updateNGO = (id, data) => API.put(`/ngos/${id}`, data)
export const deleteNGO = (id) => API.delete(`/ngos/${id}`)