import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { registerUser } from '../api/auth'
import { Zap, Eye, EyeOff } from 'lucide-react'

const Register = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'volunteer'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      })
      login(res.data.token, res.data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google'
  }

  const inputClass = "w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all border border-white/12 focus:border-indigo-500"
  const inputStyle = { background: 'rgba(255,255,255,0.07)' }
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-5">

      <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Zap size={22} color="white" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white">ImpactHub</div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">Volunteer Platform</div>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-9 border border-white/10"
          style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}>

          <h2 className="text-2xl font-bold text-white mb-1">Create account</h2>
          <p className="text-slate-400 text-sm mb-7">Join ImpactHub and start making a difference</p>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-5 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 rounded-xl border border-white/15 text-white text-sm font-medium flex items-center justify-center gap-3 mb-6 transition-all hover:bg-white/10"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-500 text-sm">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className={labelClass}>Full name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className={inputClass}
                style={inputStyle}
              />
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                className={inputClass}
                style={inputStyle}
              />
            </div>

            {/* Role */}
            <div>
              <label className={labelClass}>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={inputClass + ' cursor-pointer'}
                style={inputStyle}
              >
                <option value="volunteer" style={{ background: '#1e293b' }}>Volunteer</option>
                <option value="admin" style={{ background: '#1e293b' }}>Admin</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  required
                  className={inputClass + ' pr-11'}
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className={labelClass}>Confirm password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className={inputClass}
                style={inputStyle}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-opacity disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-slate-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register