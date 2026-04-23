import API from './axios'

export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)
export const getMe = () => API.get('/auth/me')
export const logoutUser = () => API.post('/auth/logout')
export const updatePassword = (data) => API.put('/auth/updatepassword', data)