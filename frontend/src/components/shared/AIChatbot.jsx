import React, { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '../../api/ai'
import { MessageCircle, X, Send, Zap } from 'lucide-react'

const AIChatbot = () => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'Hi! I am ImpactHub AI Assistant. Ask me anything about community needs, NGOs, or volunteer coordination!'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setLoading(true)
    try {
      const res = await sendChatMessage(userMessage)
      setMessages(prev => [...prev, { role: 'ai', text: res.data.data.response }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'Sorry, I encountered an error. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '24px',
          width: '360px',
          height: '480px',
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 9998,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Zap size={16} color="white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">ImpactHub AI</p>
                <p className="text-white/70 text-xs">Powered by Gemini</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? '#6366f1' : '#f1f5f9',
                  color: msg.role === 'user' ? 'white' : '#1e293b',
                  fontSize: '13px',
                  lineHeight: '1.5'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '16px 16px 16px 4px',
                  background: '#f1f5f9',
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center'
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#94a3b8',
                      animation: 'bounce 1s infinite',
                      animationDelay: `${i * 0.2}s`
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              style={{
                flex: 1,
                padding: '10px 14px',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '13px',
                outline: 'none',
                color: '#1e293b'
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: input.trim() ? '#6366f1' : '#e2e8f0',
                border: 'none',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
            >
              <Send size={15} color={input.trim() ? 'white' : '#94a3b8'} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
          zIndex: 9999,
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {open
          ? <X size={22} color="white" />
          : <MessageCircle size={22} color="white" />
        }
      </button>
    </>
  )
}

export default AIChatbot