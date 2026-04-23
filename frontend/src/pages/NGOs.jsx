import React, { useState, useEffect } from 'react'
import { getNGOs, createNGO, updateNGO, deleteNGO } from '../api/ngos'
import { MapPin, Plus, Search, X, Zap } from 'lucide-react'
import Toast from '../components/shared/Toast'
import Spinner from '../components/shared/Spinner'

const SPECIALIZATIONS = ['Medical','Healthcare','Education','Tutoring','Food Security','Logistics','Sanitation','Water Testing','Infrastructure','Construction','Mental Health','Counseling','Elderly Care','Child Welfare','Community Outreach','First Aid','Nursing','Driving','Distribution','Heavy Machinery','Active Listening','Companionship']
const SERVICE_RADIUS = ['local','district','regional']
const STATUSES = ['active','assigned','unavailable']

const NGOModal = ({ ngo, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: ngo?.name || '',
    contactEmail: ngo?.contactEmail || '',
    phone: ngo?.phone || '',
    primaryContact: ngo?.primaryContact || '',
    operatingLocation: ngo?.operatingLocation || '',
    serviceRadius: ngo?.serviceRadius || 'district',
    assignmentCapacity: ngo?.assignmentCapacity || 5,
    efficiencyScore: ngo?.efficiencyScore || 80,
    specializations: ngo?.specializations || [],
    status: ngo?.status || 'active',
    notes: ngo?.notes || ''
  })
  const [specInput, setSpecInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const addSpec = () => {
    if (specInput.trim() && !form.specializations.includes(specInput.trim())) {
      setForm({ ...form, specializations: [...form.specializations, specInput.trim()] })
      setSpecInput('')
    }
  }

  const removeSpec = (spec) => {
    setForm({ ...form, specializations: form.specializations.filter(s => s !== spec) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (ngo?._id) {
        await updateNGO(ngo._id, form)
      } else {
        await createNGO(form)
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
          <h2>{ngo?._id ? 'Edit NGO' : 'Register NGO'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label>Organization Name *</label>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="NGO full name" required />
          </div>

          {/* Email + Phone */}
          <div className="form-row">
            <div className="form-group">
              <label>Contact Email *</label>
              <input type="email" name="contactEmail" value={form.contactEmail}
                onChange={handleChange} placeholder="email@ngo.org" required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                placeholder="Phone number" />
            </div>
          </div>

          {/* Primary Contact */}
          <div className="form-group">
            <label>Primary Contact Person</label>
            <input name="primaryContact" value={form.primaryContact}
              onChange={handleChange} placeholder="Name of main contact" />
          </div>

          {/* Location */}
          <div className="form-group">
            <label>Operating Location *</label>
            <input name="operatingLocation" value={form.operatingLocation}
              onChange={handleChange} placeholder="Primary base / area served" required />
          </div>

          {/* Service Radius + Capacity */}
          <div className="form-row">
            <div className="form-group">
              <label>Service Radius</label>
              <select name="serviceRadius" value={form.serviceRadius} onChange={handleChange}>
                {SERVICE_RADIUS.map(r => (
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Assignment Capacity</label>
              <input type="number" name="assignmentCapacity" value={form.assignmentCapacity}
                onChange={handleChange} placeholder="Max simultaneous" />
            </div>
          </div>

          {/* Efficiency Score */}
          <div className="form-group">
            <label>Efficiency Score (0-100)</label>
            <input type="number" name="efficiencyScore" value={form.efficiencyScore}
              onChange={handleChange} min="0" max="100" />
            <p className="text-xs text-slate-400 mt-1">Based on past performance and completion rate</p>
          </div>

          {/* Status */}
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              {STATUSES.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Specializations */}
          <div className="form-group">
            <label>Specializations</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                value={specInput}
                onChange={e => setSpecInput(e.target.value)}
                placeholder="e.g. Medical, Education"
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSpec())}
                style={{ flex: 1, padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                list="spec-suggestions"
              />
              <datalist id="spec-suggestions">
                {SPECIALIZATIONS.map(s => <option key={s} value={s} />)}
              </datalist>
              <button type="button" onClick={addSpec} className="btn-secondary">Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {form.specializations.map(spec => (
                <span key={spec} className="tag">
                  {spec}
                  <button type="button" onClick={() => removeSpec(spec)}>×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange}
              placeholder="Additional details..." rows={2} />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : ngo?._id ? 'Update' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const getRadiusBadgeStyle = (radius) => {
  const map = {
    local: { background: '#dcfce7', color: '#16a34a' },
    district: { background: '#dbeafe', color: '#2563eb' },
    regional: { background: '#fef3c7', color: '#d97706' }
  }
  return map[radius] || map.local
}

const getEfficiencyColor = (score) => {
  if (score >= 90) return '#16a34a'
  if (score >= 75) return '#d97706'
  return '#dc2626'
}

const NGOCard = ({ ngo, onEdit }) => {
  const capacityPercent = ngo.assignmentCapacity > 0
    ? Math.round((ngo.currentAssignments / ngo.assignmentCapacity) * 100)
    : 0

  const radiusStyle = getRadiusBadgeStyle(ngo.serviceRadius)
  const effColor = getEfficiencyColor(ngo.efficiencyScore)

  return (
    <div className="card cursor-pointer" onClick={() => onEdit(ngo)}>

      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#ede9fe' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">{ngo.name}</h3>
            <p className="text-xs text-slate-400">Contact: {ngo.primaryContact}</p>
          </div>
        </div>
        <span className="badge badge-active">Active</span>
      </div>

      {/* Location + Radius */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1">
          <MapPin size={11} className="text-slate-400" />
          <span className="text-xs text-slate-500">{ngo.operatingLocation}</span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={radiusStyle}>
          {ngo.serviceRadius.charAt(0).toUpperCase() + ngo.serviceRadius.slice(1)} Coverage
        </span>
      </div>

      {/* Specializations */}
      <div className="flex flex-wrap gap-1 mb-3">
        {ngo.specializations.slice(0, 4).map(spec => (
          <span key={spec} className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: '#f1f5f9', color: '#475569' }}>
            {spec}
          </span>
        ))}
        {ngo.specializations.length > 4 && (
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: '#f1f5f9', color: '#475569' }}>
            +{ngo.specializations.length - 4}
          </span>
        )}
      </div>

      {/* Efficiency + Capacity */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Zap size={13} style={{ color: effColor }} />
          <span className="text-xs font-semibold" style={{ color: effColor }}>
            {ngo.efficiencyScore}% efficiency
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="progress-bar" style={{ width: '80px' }}>
            <div className="progress-fill"
              style={{ width: `${Math.min(capacityPercent, 100)}%`, background: effColor }} />
          </div>
          <span className="text-xs text-slate-400">
            {ngo.currentAssignments}/{ngo.assignmentCapacity}
          </span>
        </div>
      </div>
    </div>
  )
}

const NGOs = () => {
  const [ngos, setNGOs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editNGO, setEditNGO] = useState(null)
  const [toast, setToast] = useState('')

  const fetchNGOs = async () => {
    try {
      const params = {}
      if (statusFilter !== 'all') params.status = statusFilter
      const res = await getNGOs(params)
      setNGOs(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNGOs()
  }, [statusFilter])

  const handleSave = () => {
    setShowModal(false)
    setEditNGO(null)
    setToast(editNGO ? 'NGO updated successfully!' : 'NGO registered successfully!')
    fetchNGOs()
  }

  const handleEdit = (ngo) => {
    setEditNGO(ngo)
    setShowModal(true)
  }

  const handleNew = () => {
    setEditNGO(null)
    setShowModal(true)
  }

  const filteredNGOs = ngos.filter(n =>
    n.name.toLowerCase().includes(search.toLowerCase()) ||
    n.operatingLocation.toLowerCase().includes(search.toLowerCase()) ||
    n.specializations.some(s => s.toLowerCase().includes(search.toLowerCase()))
  )

  if (loading) return <Spinner />

  return (
    <div className="page-container">

      {/* Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>NGOs</h1>
            <p>Register and manage partner NGOs, their specializations, capacity, and efficiency</p>
          </div>
          <button className="btn-primary" onClick={handleNew}>
            <Plus size={16} />
            Register NGO
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
            placeholder="Search by name, location, or specialization..."
          />
          {search && (
            <button onClick={() => setSearch('')}>
              <X size={14} className="text-slate-400" />
            </button>
          )}
        </div>
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

      {/* NGOs Grid */}
      {filteredNGOs.length > 0 ? (
        <div className="grid-3">
          {filteredNGOs.map(ngo => (
            <NGOCard key={ngo._id} ngo={ngo} onEdit={handleEdit} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Users size={48} className="mb-4 opacity-30" />
          <p className="text-lg font-medium text-slate-500">No NGOs found</p>
          <p className="text-sm mt-1">Try adjusting filters or register a new NGO</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <NGOModal
          ngo={editNGO}
          onClose={() => { setShowModal(false); setEditNGO(null) }}
          onSave={handleSave}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

export default NGOs