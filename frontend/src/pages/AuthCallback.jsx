import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AuthCallback = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [status, setStatus] = useState('Processing...')

  useEffect(() => {
    const handleCallback = () => {
      try {
        const params = new URLSearchParams(window.location.search)
        const token = params.get('token')
        const name = params.get('name')
        const email = params.get('email')
        const role = params.get('role')
        const avatar = params.get('avatar')
        const error = params.get('error')

        if (error) {
          setStatus('Login failed. Redirecting...')
          setTimeout(() => navigate('/login?error=google_failed'), 2000)
          return
        }

        if (!token) {
          setStatus('No token found. Redirecting...')
          setTimeout(() => navigate('/login'), 2000)
          return
        }

        // Store token and user data
        login(token, {
          name: decodeURIComponent(name || ''),
          email: decodeURIComponent(email || ''),
          role: role || 'volunteer',
          avatar: decodeURIComponent(avatar || '')
        })

        setStatus('Login successful! Redirecting...')

        // Small delay to ensure state is set
        setTimeout(() => {
          navigate('/', { replace: true })
        }, 500)

      } catch (err) {
        console.error('Auth callback error:', err)
        setStatus('Something went wrong. Redirecting...')
        setTimeout(() => navigate('/login'), 2000)
      }
    }

    handleCallback()
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
    }}>
      <div style={{
        width: '44px',
        height: '44px',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      </div>
      <div className="spinner" style={{ marginBottom: '16px' }} />
      <p style={{ color: '#94a3b8', fontSize: '14px' }}>{status}</p>
    </div>
  )
}

export default AuthCallback