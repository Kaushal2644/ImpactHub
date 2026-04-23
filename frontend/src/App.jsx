import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/shared/ProtectedRoute'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import CommunityNeeds from './pages/CommunityNeeds'
import NGOs from './pages/NGOs'
import SmartMatch from './pages/SmartMatch'
import FieldReports from './pages/FieldReports'
import Login from './pages/Login'
import Register from './pages/Register'
import AuthCallback from './pages/AuthCallback'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="needs" element={<CommunityNeeds />} />
            <Route path="ngos" element={<NGOs />} />
            <Route path="smart-match" element={<SmartMatch />} />
            <Route path="reports" element={<FieldReports />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App