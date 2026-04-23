import React, { useState, useEffect } from 'react'
import { getNeeds, createNeed, updateNeed, deleteNeed } from '../api/needs'
import { MapPin, Users, Plus, Search, X } from 'lucide-react'
import Toast from '../components/shared/Toast'
import Spinner from '../components/shared/Spinner'

const CATEGORIES = ['disaster relief','sanitation','education','food security','elderly care','mental health','healthcare','infrastructure','other']
const URGENCIES = ['critical','high','medium','low']
const STATUSES = ['open','in progress','partially resolved','resolved']
const SOURCES = ['field report','community request','ngo report','government','other']

const NeedModal = ({ need, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: need?.title || '',
    description: need?.description || '',
    category: need?.category || 'other',
    urgency: need?.urgency || 'medium',
    status: need?.status || 'open',
    location: need?.location || '',
    peopleAffected: need?.peopleAffected || '',
    volunteersNeeded: need?.volunteersNeeded || '',
    source: need?.source || 'community request',
    requiredSkills: need?.requiredSkills || [],
    notes: need?.notes || ''
  })
  const [skillInput, setSkillInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const addSkill = () => {
    if (skillInput.trim() && !form.requiredSkills.includes(skillInput.trim())) {
      setForm({ ...form, requiredSkills: [...form.requiredSkills, skillInput.trim()] })
      setSkillInput('')
    }
  }

  const removeSkill = (skill) => {
    setForm({ ...form, requiredSkills: form.requiredSkills.filter(s => s !== skill) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (need?._id) {
        await updateNeed(need._id, form)
      } else {
        await createNeed(form)
      }
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
          <h2>{need?._id ? 'Edit Need' : 'Report Community Need'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input name="title" value={form.title} onChange={handleChange}
              placeholder="Brief title of the need" required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Describe the community need..." rows={3} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Urgency *</label>
              <select name="urgency" value={form.urgency} onChange={handleChange}>
                {URGENCIES.map(u => (
                  <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Location *</label>
            <input name="location" value={form.location} onChange={handleChange}
              placeholder="Neighborhood or area" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>People Affected</label>
              <input type="number" name="peopleAffected" value={form.peopleAffected}
                onChange={handleChange} placeholder="Estimate" />
            </div>
            <div className="form-group">
              <label>Volunteers Needed</label>
              <input type="number" name="volunteersNeeded" value={form.volunteersNeeded}
                onChange={handleChange} placeholder="Count" />
            </div>
          </div>
          <div className="form-group">
            <label>Source</label>
            <select name="source" value={form.source} onChange={handleChange}>
              {SOURCES.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Required Skills</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                placeholder="e.g. Medical, Teaching"
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                style={{ flex: 1, padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
              />
              <button type="button" onClick={addSkill} className="btn-secondary">Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {form.requiredSkills.map(skill => (
                <span key={skill} className="tag">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)}>×</button>
                </span>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange}
              placeholder="Additional context..." rows={2} />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : need?._id ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const NeedCard = ({ need, onEdit }) => {
  const progress = need.volunteersNeeded > 0
    ? Math.round((need.volunteersAssigned / need.volunteersNeeded) * 100)
    : 0

  const getUrgencyBadge = (urgency) => {
    const map = {
      critical: 'badge badge-critical',
      high: 'badge badge-high',
      medium: 'badge badge-medium',
      low: 'badge badge-low'
    }
    return map[urgency] || 'badge'
  }

  const getStatusBadge = (status) => {
    const map = {
      'open': 'badge badge-open',
      'in progress': 'badge badge-progress',
      'partially resolved': 'badge badge-high',
      'resolved': 'badge badge-resolved'
    }
    return map[status] || 'badge badge-open'
  }

  const getStatusLabel = (status) => {
    const map = {
      'open': 'Open',
      'in progress': 'In Progress',
      'partially resolved': 'Partially Resolved',
      'resolved': 'Resolved'
    }
    return map[status] || status
  }

  return (
    <div className="card cursor-pointer" onClick={() => onEdit(need)}>
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold text-slate-800 flex-1 pr-2">{need.title}</h3>
        <span className={getUrgencyBadge(need.urgency)}>
          {need.urgency.charAt(0).toUpperCase() + need.urgency.slice(1)}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-500 mb-3 line-clamp-2"
        style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {need.description}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-1">
          <MapPin size={11} className="text-slate-400" />
          <span className="text-xs text-slate-500">{need.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={11} className="text-slate-400" />
          <span className="text-xs text-slate-500">{need.peopleAffected} affected</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {need.category.charAt(0).toUpperCase() + need.category.slice(1)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className={getStatusBadge(need.status)}>
          {getStatusLabel(need.status)}
        </span>
        {need.volunteersNeeded > 0 && (
          <div className="flex items-center gap-2 flex-1 ml-3">
            <div className="progress-bar flex-1">
              <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
            <span className="text-xs text-slate-400">
              {need.volunteersAssigned}/{need.volunteersNeeded}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

const CommunityNeeds = () => {
  const [needs, setNeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [urgencyFilter, setUrgencyFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editNeed, setEditNeed] = useState(null)
  const [toast, setToast] = useState('')

  const fetchNeeds = async () => {
    try {
      const params = {}
      if (urgencyFilter !== 'all') params.urgency = urgencyFilter
      if (statusFilter !== 'all') params.status = statusFilter
      const res = await getNeeds(params)
      setNeeds(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNeeds()
  }, [urgencyFilter, statusFilter])

  const handleSave = () => {
    setShowModal(false)
    setEditNeed(null)
    setToast(editNeed ? 'Need updated successfully!' : 'Need created successfully!')
    fetchNeeds()
  }

  const handleEdit = (need) => {
    setEditNeed(need)
    setShowModal(true)
  }

  const handleNewNeed = () => {
    setEditNeed(null)
    setShowModal(true)
  }

  const filteredNeeds = needs.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.location.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <Spinner />

  return (
    <div className="page-container">

      {/* Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Community Needs</h1>
            <p>Track, prioritize, and manage identified community needs</p>
          </div>
          <button className="btn-primary" onClick={handleNewNeed}>
            <Plus size={16} />
            Report Need
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input" style={{ maxWidth: '400px' }}>
          <Search size={16} className="text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search needs..."
          />
          {search && (
            <button onClick={() => setSearch('')}>
              <X size={14} className="text-slate-400" />
            </button>
          )}
        </div>
        <select
          className="filter-select"
          value={urgencyFilter}
          onChange={e => setUrgencyFilter(e.target.value)}
        >
          <option value="all">All Urgency</option>
          {URGENCIES.map(u => (
            <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>
          ))}
        </select>
        <select
          className="filter-select"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          {STATUSES.map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Needs Grid */}
      {filteredNeeds.length > 0 ? (
        <div className="grid-3">
          {filteredNeeds.map(need => (
            <NeedCard key={need._id} need={need} onEdit={handleEdit} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Heart size={48} className="mb-4 opacity-30" />
          <p className="text-lg font-medium text-slate-500">No needs found</p>
          <p className="text-sm mt-1">Try adjusting your filters or add a new need</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <NeedModal
          need={editNeed}
          onClose={() => { setShowModal(false); setEditNeed(null) }}
          onSave={handleSave}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

export default CommunityNeeds