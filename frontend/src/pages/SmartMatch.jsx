import React, { useState, useEffect } from 'react'
import { getSmartMatches, assignNGO } from '../api/match'
import { explainMatch } from '../api/ai'
import { Zap, MapPin, RefreshCw, Users, Heart, CheckCircle, X } from 'lucide-react'
import Toast from '../components/shared/Toast'
import Spinner from '../components/shared/Spinner'

const URGENCIES = ['all', 'critical', 'high', 'medium', 'low']

const ScoreBar = ({ label, value, color }) => (
  <div className="flex flex-col items-center">
    <span className="text-xs font-semibold" style={{ color }}>{value}%</span>
    <div className="w-full h-1.5 rounded-full mt-1" style={{ background: '#e2e8f0' }}>
      <div className="h-1.5 rounded-full transition-all"
        style={{ width: `${value}%`, background: color }} />
    </div>
    <span className="text-xs text-slate-400 mt-1">{label}</span>
  </div>
)

const getUrgencyBadgeStyle = (urgency) => {
  const map = {
    critical: { background: '#fee2e2', color: '#dc2626' },
    high: { background: '#fef3c7', color: '#d97706' },
    medium: { background: '#dbeafe', color: '#2563eb' },
    low: { background: '#dcfce7', color: '#16a34a' }
  }
  return map[urgency] || map.low
}

const getMatchColor = (score) => {
  if (score >= 90) return '#16a34a'
  if (score >= 75) return '#d97706'
  return '#6366f1'
}

const MatchCard = ({ match, onAssign, assigning }) => {
  const { need, ngo, matchScore, efficiencyScore, locationScore, specializationScore } = match
  const matchColor = getMatchColor(matchScore)
  const urgencyStyle = getUrgencyBadgeStyle(need.urgency)

  // AI Explain States
  const [explaining, setExplaining] = useState(false)
  const [explanation, setExplanation] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const handleExplain = async () => {
    if (explanation) {
      setShowExplanation(!showExplanation)
      return
    }
    setExplaining(true)
    try {
      const res = await explainMatch({
        ngoId: ngo._id,
        needId: need._id
      })
      setExplanation(res.data.data)
      setShowExplanation(true)
    } catch (err) {
      console.error('Explain match error:', err)
    } finally {
      setExplaining(false)
    }
  }

  return (
    <div className="card mb-4">

      {/* Match Score Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap size={16} style={{ color: matchColor }} />
          <span className="text-sm font-bold" style={{ color: matchColor }}>
            {matchScore}% match
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* AI Explain Button */}
          <button
            onClick={handleExplain}
            disabled={explaining}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '7px 12px',
              background: showExplanation ? '#6366f1' : 'transparent',
              border: '1px solid #6366f1',
              borderRadius: '8px',
              color: showExplanation ? 'white' : '#6366f1',
              fontSize: '12px',
              fontWeight: '500',
              cursor: explaining ? 'not-allowed' : 'pointer',
              opacity: explaining ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            <Zap size={12} />
            {explaining ? 'Analyzing...' : showExplanation ? 'Hide AI' : '✨ Explain'}
          </button>

          {/* Assign Button */}
          <button
            onClick={() => onAssign(match)}
            disabled={assigning}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            {assigning ? 'Assigning...' : (
              <>
                <CheckCircle size={14} />
                Assign
              </>
            )}
          </button>
        </div>
      </div>

      {/* Score Breakdown */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <ScoreBar label="Efficiency" value={efficiencyScore} color="#6366f1" />
        <ScoreBar label="Location" value={locationScore} color="#10b981" />
        <ScoreBar label="Specialization" value={specializationScore} color="#f59e0b" />
      </div>

      {/* NGO + Need Side by Side */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
      }}>
        {/* NGO Side */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '10px',
          padding: '14px'
        }}>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            NGO
          </p>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: '#ede9fe' }}>
              <Users size={13} color="#6366f1" />
            </div>
            <p className="text-sm font-semibold text-slate-800">{ngo.name}</p>
          </div>
          <div className="flex items-center gap-1 mb-2">
            <MapPin size={11} className="text-slate-400" />
            <span className="text-xs text-slate-500">{ngo.operatingLocation}</span>
          </div>
          <div className="flex items-center gap-1 mb-3">
            <Zap size={11} style={{ color: '#16a34a' }} />
            <span className="text-xs font-medium" style={{ color: '#16a34a' }}>
              {ngo.efficiencyScore}% efficient
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="progress-bar flex-1">
              <div className="progress-fill"
                style={{
                  width: `${Math.round((ngo.currentAssignments / ngo.assignmentCapacity) * 100)}%`
                }} />
            </div>
            <span className="text-xs text-slate-400">
              {ngo.currentAssignments}/{ngo.assignmentCapacity}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {ngo.specializations.slice(0, 3).map(spec => (
              <span key={spec} className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: '#e0e7ff', color: '#4338ca' }}>
                {spec}
              </span>
            ))}
          </div>
          <div className="mt-2">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: '#dbeafe', color: '#2563eb' }}>
              {ngo.serviceRadius.charAt(0).toUpperCase() + ngo.serviceRadius.slice(1)} Coverage
            </span>
          </div>
        </div>

        {/* Need Side */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '10px',
          padding: '14px'
        }}>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            NEED
          </p>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: '#fce7f3' }}>
              <Heart size={13} color="#db2777" />
            </div>
            <p className="text-sm font-semibold text-slate-800">{need.title}</p>
          </div>
          <div className="flex items-center gap-1 mb-2">
            <MapPin size={11} className="text-slate-400" />
            <span className="text-xs text-slate-500">{need.location}</span>
          </div>
          <div className="mb-3">
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={urgencyStyle}>
              {need.urgency.charAt(0).toUpperCase() + need.urgency.slice(1)}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {need.requiredSkills?.slice(0, 3).map(skill => (
              <span key={skill} className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: '#fef3c7', color: '#92400e' }}>
                {skill}
              </span>
            ))}
            {need.category && (
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: '#f1f5f9', color: '#475569' }}>
                {need.category.charAt(0).toUpperCase() + need.category.slice(1)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* AI Explanation Panel */}
      {showExplanation && explanation && (
        <div style={{
          marginTop: '16px',
          background: 'linear-gradient(135deg, #f5f3ff, #eff6ff)',
          border: '1px solid #e0e7ff',
          borderRadius: '12px',
          padding: '16px'
        }}>
          {/* AI Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} color="#6366f1" />
              <p style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#6366f1'
              }}>
                AI Match Explanation
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
              {/* Confidence Badge */}
              <span style={{
                fontSize: '10px',
                padding: '2px 6px',
                background: explanation.confidenceLevel === 'high'
                  ? '#dcfce7' : explanation.confidenceLevel === 'medium'
                  ? '#fef3c7' : '#fee2e2',
                color: explanation.confidenceLevel === 'high'
                  ? '#16a34a' : explanation.confidenceLevel === 'medium'
                  ? '#d97706' : '#dc2626',
                borderRadius: '20px',
                fontWeight: '600',
                textTransform: 'capitalize'
              }}>
                {explanation.confidenceLevel} confidence
              </span>
            </div>
            <button
              onClick={() => setShowExplanation(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Match Explanation */}
          <p style={{
            fontSize: '13px',
            color: '#475569',
            lineHeight: 1.6,
            marginBottom: '12px',
            padding: '10px 12px',
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #e0e7ff'
          }}>
            {explanation.matchExplanation}
          </p>

          {/* Strengths + Considerations */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '12px'
          }}>
            {/* Strengths */}
            <div>
              <p style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#16a34a',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                ✓ Strengths
              </p>
              {explanation.strengths?.map((s, i) => (
                <div key={i} style={{
                  fontSize: '11px',
                  padding: '5px 8px',
                  background: '#dcfce7',
                  color: '#166534',
                  borderRadius: '6px',
                  marginBottom: '4px'
                }}>
                  {s}
                </div>
              ))}
            </div>

            {/* Considerations */}
            <div>
              <p style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#d97706',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                ⚠ Considerations
              </p>
              {explanation.considerations?.map((c, i) => (
                <div key={i} style={{
                  fontSize: '11px',
                  padding: '5px 8px',
                  background: '#fef3c7',
                  color: '#92400e',
                  borderRadius: '6px',
                  marginBottom: '4px'
                }}>
                  {c}
                </div>
              ))}
            </div>
          </div>

          {/* Final Recommendation */}
          <div style={{
            padding: '10px 12px',
            background: '#ede9fe',
            borderRadius: '8px',
            border: '1px solid #c4b5fd'
          }}>
            <p style={{
              fontSize: '12px',
              color: '#6366f1',
              fontWeight: '600',
              fontStyle: 'italic'
            }}>
              💡 {explanation.recommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

const SmartMatch = () => {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [urgencyFilter, setUrgencyFilter] = useState('all')
  const [assigningId, setAssigningId] = useState(null)
  const [toast, setToast] = useState('')
  const [stats, setStats] = useState({
    totalNeeds: 0,
    totalNGOs: 0,
    totalMatches: 0
  })

  const fetchMatches = async () => {
    setLoading(true)
    try {
      const params = {}
      if (urgencyFilter !== 'all') params.urgency = urgencyFilter
      const res = await getSmartMatches(params)
      setMatches(res.data.data.matches || [])
      setStats({
        totalNeeds: res.data.data.totalNeeds || 0,
        totalNGOs: res.data.data.totalNGOs || 0,
        totalMatches: res.data.data.totalMatches || 0
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMatches()
  }, [urgencyFilter])

  const handleAssign = async (match) => {
    const key = `${match.need._id}-${match.ngo._id}`
    setAssigningId(key)
    try {
      await assignNGO({
        needId: match.need._id,
        ngoId: match.ngo._id,
        matchScore: match.matchScore,
        efficiencyScore: match.efficiencyScore,
        locationScore: match.locationScore,
        specializationScore: match.specializationScore
      })
      setToast(`${match.ngo.name} assigned to ${match.need.title}!`)
      fetchMatches()
    } catch (err) {
      setToast('Assignment failed. Please try again.')
    } finally {
      setAssigningId(null)
    }
  }

  return (
    <div className="page-container">

      {/* Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Smart Match</h1>
            <p>Assigns NGOs to community needs ranked by efficiency, proximity, and specialization</p>
          </div>
          <button className="btn-secondary" onClick={fetchMatches}>
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div className="card text-center">
          <p className="text-2xl font-bold text-slate-800">{stats.totalNeeds}</p>
          <p className="text-sm text-slate-500 mt-1">Open Needs</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold" style={{ color: '#6366f1' }}>
            {stats.totalNGOs}
          </p>
          <p className="text-sm text-slate-500 mt-1">Available NGOs</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold" style={{ color: '#f59e0b' }}>
            {stats.totalMatches}
          </p>
          <p className="text-sm text-slate-500 mt-1">Suggested Matches</p>
        </div>
      </div>

      {/* Score Formula Info */}
      <div className="mb-6 px-4 py-3 rounded-xl text-sm"
        style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          color: '#1e40af',
          marginBottom: '24px'
        }}>
        <span className="font-semibold">Match score = </span>
        <span style={{ color: '#6366f1' }}>Efficiency (40 pts)</span> based on NGO performance &amp; spare capacity ·{' '}
        <span style={{ color: '#10b981' }}>Location (35 pts)</span> based on proximity to need area ·{' '}
        <span style={{ color: '#f59e0b' }}>Specialization (25 pts)</span> based on category &amp; skill alignment
      </div>

      {/* Urgency Filter */}
      <div className="filter-bar" style={{ marginBottom: '24px' }}>
        <span className="text-sm text-slate-500 font-medium">Filter by urgency:</span>
        <div className="flex gap-2 flex-wrap">
          {URGENCIES.map(u => (
            <button
              key={u}
              onClick={() => setUrgencyFilter(u)}
              style={{
                fontSize: '13px',
                padding: '7px 16px',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                background: urgencyFilter === u ? '#6366f1' : 'white',
                color: urgencyFilter === u ? 'white' : '#64748b',
                border: `1px solid ${urgencyFilter === u ? '#6366f1' : '#e2e8f0'}`,
                cursor: 'pointer'
              }}
            >
              {u.charAt(0).toUpperCase() + u.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Matches Grid */}
      {loading ? (
        <Spinner />
      ) : matches.length > 0 ? (
        <div className="grid-2">
          {matches.map((match, index) => (
            <MatchCard
              key={`${match.need._id}-${match.ngo._id}-${index}`}
              match={match}
              onAssign={handleAssign}
              assigning={assigningId === `${match.need._id}-${match.ngo._id}`}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Zap size={48} className="mb-4 opacity-30" />
          <p className="text-lg font-medium text-slate-500">No matches found</p>
          <p className="text-sm mt-1">
            Try changing the urgency filter or add more NGOs
          </p>
        </div>
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

export default SmartMatch