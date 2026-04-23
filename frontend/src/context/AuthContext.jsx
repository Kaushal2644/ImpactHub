import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')
        if (token && savedUser) {
          const parsedUser = JSON.parse(savedUser)
          setUser(parsedUser)
          setIsAuthenticated(true)
        }
      } catch (e) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }
    initAuth()
  }, [])

  const login = (token, userData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    setIsAuthenticated(true)
    setLoading(false)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}