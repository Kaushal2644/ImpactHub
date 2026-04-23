import React, { useState, useEffect } from 'react'
import { getReports, createReport, deleteReport, convertToNeed } from '../api/reports'
import { analyzeReport } from '../api/ai'
import { FileText, Plus, Search, X, MapPin, Trash2, RefreshCw, Zap } from 'lucide-react'
import Toast from '../components/shared/Toast'
import Spinner from '../components/shared/Spinner'

const REPORT_TYPES = ['observation','survey','assessment','interview','other']
const CATEGORIES = ['disaster relief','sanitation','education','food security','elderly care','mental health','healthcare','infrastructure','other']
const URGENCIES = ['critical','high','medium','low']

const ReportModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    title: '',
    type: 'observation',
    category: 'other',
    location: '',
    summary: '',
    urgencyObserved: 'medium',
    peopleAffected: '',
    submittedBy: ''
  })
  const [loading, setLoading] = useState(false)

  // AI States
  const [analyzing, setAnalyzing] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // AI Analyze Handler
  const handleAnalyze = async () => {
    if (!form.title || !form.summary) return
    setAnalyzing(true)
    try {
      const res = await analyzeReport({
        title: form.title,
        location: form.location,
        summary: form.summary,
        type: form.type
      })
      setAiSuggestion(res.data.data)
      // Auto fill urgency and category from AI
      setForm(prev => ({
        ...prev,
        urgencyObserved: res.data.data.suggestedUrgency || prev.urgencyObserved,
        category: res.data.data.suggestedCategory || prev.category
      }))
    } catch (err) {
      console.error('AI analysis error:', err)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createReport(form)
      onSave()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Submit Field Report</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>

          {/* Title */}
          <div className="form-group">
            <label>Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Report title"
              required
            />
          </div>

          {/* Type + Category */}
          <div className="form-row">
            <div className="form-group">
              <label>Type *</label>
              <select name="type" value={form.type} onChange={handleChange}>
                {REPORT_TYPES.map(t => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="form-group">
            <label>Location *</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Area or neighborhood"
              required
            />
          </div>

          {/* Summary */}
          <div className="form-group">
            <label>Summary *</label>
            <textarea
              name="summary"
              value={form.summary}
              onChange={handleChange}
              placeholder="Describe your findings..."
              rows={4}
              required
            />
          </div>

          {/* AI Analyze Button — shows only when title + summary filled */}
          {form.title && form.summary && (
            <div style={{ marginBottom: '16px' }}>
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={analyzing}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  background: analyzing
                    ? '#ede9fe'
                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none',
                  borderRadius: '8px',
                  color: analyzing ? '#6366f1' : 'white',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: analyzing ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Zap size={14} />
                {analyzing ? 'Analyzing with AI...' : '✨ AI Analyze Report'}
              </button>
            </div>
          )}

          {/* AI Suggestions Panel */}
          {aiSuggestion && (
            <div style={{
              background: '#f5f3ff',
              border: '1px solid #e0e7ff',
              borderRadius: '10px',
              padding: '14px',
              marginBottom: '16px'
            }}>
              {/* AI Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '10px'
              }}>
                <Zap size={14} color="#6366f1" />
                <p style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#6366f1'
                }}>
                  AI Analysis Result
                </p>
                <span style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  background: '#ede9fe',
                  color: '#6366f1',
                  borderRadius: '20px'
                }}>
                  Gemini
                </span>
              </div>

              {/* Reasoning */}
              <p style={{
                fontSize: '12px',
                color: '#475569',
                marginBottom: '10px',
                lineHeight: 1.5,
                padding: '8px 10px',
                background: 'white',
                borderRadius: '6px',
                border: '1px solid #e0e7ff'
              }}>
                {aiSuggestion.reasoning}
              </p>

              {/* Suggested Values */}
              <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '10px',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  fontSize: '11px',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  background: '#fee2e2',
                  color: '#dc2626',
                  fontWeight: '600'
                }}>
                  Urgency: {aiSuggestion.suggestedUrgency}
                </div>
                <div style={{
                  fontSize: '11px',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  background: '#dbeafe',
                  color: '#2563eb',
                  fontWeight: '600'
                }}>
                  Category: {aiSuggestion.suggestedCategory}
                </div>
                <div style={{
                  fontSize: '11px',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  background: '#dcfce7',
                  color: '#16a34a',
                  fontWeight: '600'
                }}>
                  Priority: {aiSuggestion.estimatedPriority}/10
                </div>
              </div>

              {/* Key Findings */}
              {aiSuggestion.keyFindings?.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                  <p style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#475569',
                    marginBottom: '6px'
                  }}>
                    Key Findings:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {aiSuggestion.keyFindings.map((f, i) => (
                      <span key={i} style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        background: '#ede9fe',
                        color: '#6366f1',
                        borderRadius: '20px'
                      }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Actions */}
              {aiSuggestion.recommendedActions?.length > 0 && (
                <div>
                  <p style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#475569',
                    marginBottom: '6px'
                  }}>
                    Recommended Actions:
                  </p>
                  {aiSuggestion.recommendedActions.map((a, i) => (
                    <p key={i} style={{
                      fontSize: '11px',
                      color: '#475569',
                      padding: '4px 0',
                      borderBottom: i < aiSuggestion.recommendedActions.length - 1
                        ? '1px solid #e0e7ff' : 'none'
                    }}>
                      → {a}
                    </p>
                  ))}
                </div>
              )}

              {/* Auto-filled notice */}
              <p style={{
                fontSize: '11px',
                color: '#6366f1',
                marginTop: '10px',
                fontStyle: 'italic'
              }}>
                ✓ Urgency and Category have been auto-filled based on AI analysis
              </p>
            </div>
          )}

          {/* Urgency + People Affected */}
          <div className="form-row">
            <div className="form-group">
              <label>Urgency Observed</label>
              <select
                name="urgencyObserved"
                value={form.urgencyObserved}
                onChange={handleChange}
              >
                {URGENCIES.map(u => (
                  <option key={u} value={u}>
                    {u.charAt(0).toUpperCase() + u.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>People Affected</label>
              <input
                type="number"
                name="peopleAffected"
                value={form.peopleAffected}
                onChange={handleChange}
                placeholder="Estimate"
              />
            </div>
          </div>

          {/* Submitted By */}
          <div className="form-group">
            <label>Submitted By</label>
            <input
              name="submittedBy"
              value={form.submittedBy}
              onChange={handleChange}
              placeholder="Your name or field agent ID"
            />
          </div>

          {/* Attach File */}
          <div className="form-group">
            <label>Attach File</label>
            <div style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#94a3b8',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              <FileText size={16} />
              <span>Choose file...</span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const getUrgencyStyle = (urgency) => {
  const map = {
    critical: { background: '#fee2e2', color: '#dc2626' },
    high: { background: '#fef3c7', color: '#d97706' },
    medium: { background: '#dbeafe', color: '#2563eb' },
    low: { background: '#dcfce7', color: '#16a34a' }
  }
  return map[urgency] || map.medium
}

const ReportRow = ({ report, onConvert, onDelete, converting, deleting }) => {
  const urgencyStyle = getUrgencyStyle(report.urgencyObserved)
  const date = new Date(report.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })

  return (
    <div
      style={{
        padding: '20px 24px',
        borderBottom: '1px solid #f1f5f9',
        transition: 'background 0.2s ease'
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* Title Row */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3 flex-1">
          <h3 className="text-sm font-semibold text-slate-800">
            {report.title}
          </h3>
          {/* Urgency Badge */}
          <span
            className="badge text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
            style={urgencyStyle}
          >
            {report.urgencyObserved.charAt(0).toUpperCase() + report.urgencyObserved.slice(1)}
          </span>
          {/* Converted Badge */}
          {report.isConverted && (
            <span className="badge badge-converted flex-shrink-0">
              Converted
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-4">
          {!report.isConverted && (
            <button
              onClick={() => onConvert(report._id)}
              disabled={converting}
              style={{
                fontSize: '12px',
                padding: '6px 12px',
                background: '#ede9fe',
                color: '#6366f1',
                border: 'none',
                borderRadius: '8px',
                cursor: converting ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                opacity: converting ? 0.7 : 1,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                if (!converting) e.currentTarget.style.background = '#6366f1'
                if (!converting) e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#ede9fe'
                e.currentTarget.style.color = '#6366f1'
              }}
            >
              {converting ? 'Converting...' : '→ Convert to Need'}
            </button>
          )}
          <button
            onClick={() => onDelete(report._id)}
            disabled={deleting}
            style={{
              padding: '6px',
              background: 'transparent',
              border: 'none',
              cursor: deleting ? 'not-allowed' : 'pointer',
              color: '#94a3b8',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#fee2e2'
              e.currentTarget.style.color = '#dc2626'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#94a3b8'
            }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Summary */}
      <p
        className="text-xs text-slate-500 mb-3"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {report.summary}
      </p>

      {/* Meta Tags */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1">
          <MapPin size={11} className="text-slate-400" />
          <span className="text-xs text-slate-500">{report.location}</span>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: '#f1f5f9', color: '#475569' }}
        >
          {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
        </span>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: '#f1f5f9', color: '#475569' }}
        >
          {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
        </span>
        {report.submittedBy && (
          <span className="text-xs text-slate-400">
            by {report.submittedBy}
          </span>
        )}
        <span className="text-xs text-slate-400 ml-auto">{date}</span>
      </div>
    </div>
  )
}

const FieldReports = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState('')
  const [convertingId, setConvertingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const fetchReports = async () => {
    try {
      const res = await getReports()
      setReports(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const handleSave = () => {
    setShowModal(false)
    setToast('Field report submitted successfully!')
    fetchReports()
  }

  const handleConvert = async (id) => {
    setConvertingId(id)
    try {
      await convertToNeed(id)
      setToast('Report converted to community need!')
      fetchReports()
    } catch (err) {
      setToast(err.response?.data?.message || 'Conversion failed.')
    } finally {
      setConvertingId(null)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this report?')) return
    setDeletingId(id)
    try {
      await deleteReport(id)
      setToast('Report deleted successfully!')
      fetchReports()
    } catch (err) {
      setToast('Delete failed. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const filteredReports = reports.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.location.toLowerCase().includes(search.toLowerCase()) ||
    r.summary.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <Spinner />

  return (
    <div className="page-container">

      {/* Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Field Reports</h1>
            <p>Submit and review field observations, surveys, and assessments</p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            New Report
          </button>
        </div>
      </div>

      {/* Search + Refresh */}
      <div className="filter-bar">
        <div className="search-input" style={{ maxWidth: '400px' }}>
          <Search size={16} className="text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search reports..."
          />
          {search && (
            <button onClick={() => setSearch('')}>
              <X size={14} className="text-slate-400" />
            </button>
          )}
        </div>
        <button
          className="btn-secondary"
          onClick={fetchReports}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Reports List */}
      {filteredReports.length > 0 ? (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {filteredReports.map(report => (
            <ReportRow
              key={report._id}
              report={report}
              onConvert={handleConvert}
              onDelete={handleDelete}
              converting={convertingId === report._id}
              deleting={deletingId === report._id}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <FileText size={48} className="mb-4 opacity-30" />
          <p className="text-lg font-medium text-slate-500">No reports found</p>
          <p className="text-sm mt-1">Submit a new field report to get started</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ReportModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

export default FieldReports