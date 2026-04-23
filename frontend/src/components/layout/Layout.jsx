import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import AIChatbot from '../shared/AIChatbot'

const Layout = () => {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: '#f8fafc'
    }}>
      <Sidebar />
      <main style={{
        flex: 1,
        overflow: 'auto',
        height: '100vh'
      }}>
        <Outlet />
      </main>
      <AIChatbot />
    </div>
  )
}

export default Layout