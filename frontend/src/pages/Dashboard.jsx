import React, { useState, useEffect } from 'react'
import { getDashboardStats } from '../api/needs'
import { getNGOs } from '../api/ngos'
import { getSmartMatches } from '../api/match'
import { getInsights } from '../api/ai'
import Spinner from '../components/shared/Spinner'
import {
  Heart,
  Users,
  Link,
  AlertTriangle,
  MapPin,
  FileText,
  Zap,
  X
} from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
)

const StatCard = ({ title, value, subtitle, icon: Icon, iconBg, iconColor }) => {
  return (
    <div className="card flex justify-between items-start">
      <div>
        <p className="text-sm text-slate-500 mb-2">{title}</p>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        )}
      </div>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: iconBg }}>
        <Icon size={18} style={{ color: iconColor }} />
      </div>
    </div>
  )
}

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [ngos, setNGOs] = useState([])
  const [matches, setMatches] = useState(null)
  const [loading, setLoading] = useState(true)

  // AI Insights State
  const [insights, setInsights] = useState(null)
  const [loadingInsights, setLoadingInsights] = useState(false)
  const [showInsights, setShowInsights] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ngosRes, matchRes] = await Promise.all([
          getDashboardStats(),
          getNGOs(),
          getSmartMatches()
        ])
        setStats(statsRes.data.data)
        setNGOs(ngosRes.data.data)
        setMatches(matchRes.data.data)
      } catch (error) {
        console.error('Dashboard error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Fetch AI Insights
  const fetchInsights = async () => {
    setLoadingInsights(true)
    try {
      const res = await getInsights()
      setInsights(res.data.data)
      setShowInsights(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingInsights(false)
    }
  }

  if (loading) return <Spinner />

  // Chart Data — Needs by Category
  const categoryLabels = stats?.needsByCategory?.map(c =>
    c._id.charAt(0).toUpperCase() + c._id.slice(1)
  ) || []

  const categoryColors = [
    '#6366f1', '#f59e0b', '#10b981',
    '#ec4899', '#3b82f6', '#8b5cf6',
    '#ef4444', '#14b8a6', '#f97316'
  ]

  const barData = {
    labels: categoryLabels,
    datasets: [{
      label: 'Needs',
      data: stats?.needsByCategory?.map(c => c.count) || [],
      backgroundColor: categoryColors.slice(0, categoryLabels.length),
      borderRadius: 6,
      borderSkipped: false
    }]
  }

  const barOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { color: '#f1f5f9' },
        ticks: { color: '#94a3b8', font: { size: 11 } }
      },
      y: {
        grid: { display: false },
        ticks: { color: '#475569', font: { size: 12 } }
      }
    }
  }

  // Chart Data — Urgency Breakdown
  const urgencyData = stats?.urgencyBreakdown || []
  const urgencyOrder = ['critical', 'high', 'medium', 'low']
  const urgencyColors = {
    critical: '#ef4444',
    high: '#f59e0b',
    medium: '#3b82f6',
    low: '#10b981'
  }

  const sortedUrgency = urgencyOrder
    .map(u => urgencyData.find(d => d._id === u))
    .filter(Boolean)

  const doughnutData = {
    labels: sortedUrgency.map(u =>
      u._id.charAt(0).toUpperCase() + u._id.slice(1)
    ),
    datasets: [{
      data: sortedUrgency.map(u => u.count),
      backgroundColor: sortedUrgency.map(u => urgencyColors[u._id]),
      borderWidth: 0,
      hoverOffset: 4
    }]
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    cutout: '70%'
  }

  const getBadgeClass = (urgency) => {
    const map = {
      critical: 'badge badge-critical',
      high: 'badge badge-high',
      medium: 'badge badge-medium',
      low: 'badge badge-low'
    }
    return map[urgency] || 'badge badge-low'
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getSourceIcon = (source) => {
    if (source === 'field report') return <FileText size={16} className="text-slate-400" />
    return <Heart size={16} className="text-slate-400" />
  }

  return (
    <div className="page-container">

      {/* Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Dashboard</h1>
            <p>Overview of community needs, NGO capacity, and active assignments</p>
          </div>
          {/* AI Insights Button */}
          <button
            onClick={fetchInsights}
            disabled={loadingInsights}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loadingInsights ? 'not-allowed' : 'pointer',
              opacity: loadingInsights ? 0.8 : 1
            }}
          >
            <Zap size={16} />
            {loadingInsights ? 'Generating...' : '✨ AI Insights'}
          </button>
        </div>
      </div>

      {/* AI Insights Panel */}
      {showInsights && insights && (
        <div style={{
          background: 'linear-gradient(135deg, #f5f3ff, #eff6ff)',
          border: '1px solid #e0e7ff',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          {/* Insights Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="#6366f1" />
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
                AI Community Insights
              </h3>
              <span style={{
                fontSize: '11px',
                padding: '2px 8px',
                background: '#ede9fe',
                color: '#6366f1',
                borderRadius: '20px',
                fontWeight: '600'
              }}>
                Powered by Gemini
              </span>
            </div>
            <button
              onClick={() => setShowInsights(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Overall Situation */}
          <p style={{
            fontSize: '14px',
            color: '#475569',
            marginBottom: '20px',
            lineHeight: 1.6,
            padding: '12px 16px',
            background: 'white',
            borderRadius: '10px',
            border: '1px solid #e0e7ff'
          }}>
            {insights.overallSituation}
          </p>

          {/* Two Column Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '16px'
          }}>
            {/* Top Priorities */}
            <div>
              <p style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#dc2626',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                🔴 Top Priorities
              </p>
              {insights.topPriorities?.map((p, i) => (
                <div key={i} style={{
                  background: 'white',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  marginBottom: '8px',
                  border: '1px solid #fee2e2'
                }}>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#1e293b',
                    marginBottom: '2px'
                  }}>
                    {p.priority}
                  </p>
                  <p style={{ fontSize: '11px', color: '#64748b' }}>
                    {p.reason}
                  </p>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div>
              <p style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#16a34a',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                ✅ Recommendations
              </p>
              {insights.recommendations?.map((r, i) => (
                <div key={i} style={{
                  background: 'white',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  marginBottom: '8px',
                  border: '1px solid #dcfce7',
                  fontSize: '12px',
                  color: '#475569',
                  lineHeight: 1.5
                }}>
                  ✓ {r}
                </div>
              ))}
            </div>
          </div>

          {/* Resource Gaps */}
          {insights.resourceGaps?.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#d97706',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                ⚠️ Resource Gaps
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {insights.resourceGaps.map((g, i) => (
                  <span key={i} style={{
                    fontSize: '12px',
                    padding: '4px 12px',
                    background: '#fef3c7',
                    color: '#92400e',
                    borderRadius: '20px',
                    fontWeight: '500'
                  }}>
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Positive Highlights */}
          {insights.positiveHighlights?.length > 0 && (
            <div>
              <p style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#6366f1',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                🌟 Positive Highlights
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {insights.positiveHighlights.map((h, i) => (
                  <span key={i} style={{
                    fontSize: '12px',
                    padding: '4px 12px',
                    background: '#ede9fe',
                    color: '#6366f1',
                    borderRadius: '20px',
                    fontWeight: '500'
                  }}>
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        gap: '20px',
        marginBottom: '24px'
      }}>
        <StatCard
          title="Open Needs"
          value={stats?.totalNeeds || 0}
          subtitle={`${stats?.criticalNeeds || 0} critical`}
          icon={Heart}
          iconBg="#ede9fe"
          iconColor="#6366f1"
        />
        <StatCard
          title="Active NGOs"
          value={ngos?.length || 0}
          subtitle={`${ngos?.length || 0} total`}
          icon={Users}
          iconBg="#dcfce7"
          iconColor="#16a34a"
        />
        <StatCard
          title="Active Assignments"
          value={matches?.matches?.filter(m => m.status === 'active')?.length || 0}
          icon={Link}
          iconBg="#fef3c7"
          iconColor="#d97706"
        />
        <StatCard
          title="Critical Alerts"
          value={stats?.criticalNeeds || 0}
          icon={AlertTriangle}
          iconBg="#fee2e2"
          iconColor="#dc2626"
        />
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>

        {/* Bar Chart */}
        <div className="card">
          <h3 className="text-base font-semibold text-slate-700 mb-4">
            Needs by Category
          </h3>
          <div style={{ height: '260px' }}>
            {categoryLabels.length > 0 ? (
              <Bar data={barData} options={barOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="card">
          <h3 className="text-base font-semibold text-slate-700 mb-4">
            Urgency Breakdown
          </h3>
          <div className="flex items-center gap-8">
            <div style={{ height: '200px', width: '200px', flexShrink: 0 }}>
              {sortedUrgency.length > 0 ? (
                <Doughnut data={doughnutData} options={doughnutOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                  No data
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3">
              {sortedUrgency.map(u => (
                <div key={u._id} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: urgencyColors[u._id] }} />
                  <span className="text-sm text-slate-600 capitalize">{u._id}</span>
                  <span className="text-sm font-semibold text-slate-800 ml-1">{u.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-base font-semibold text-slate-700 mb-4">
          Recent Activity
        </h3>
        <div>
          {stats?.recentActivity?.length > 0 ? (
            stats.recentActivity.map((item, index) => (
              <div
                key={item._id}
                className="flex items-center justify-between py-3"
                style={{
                  borderBottom: index < stats.recentActivity.length - 1
                    ? '1px solid #f1f5f9' : 'none'
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    {getSourceIcon(item.source)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={11} className="text-slate-400" />
                      <span className="text-xs text-slate-400">{item.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={getBadgeClass(item.urgency)}>
                    {item.urgency.charAt(0).toUpperCase() + item.urgency.slice(1)}
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-slate-400 text-sm py-8">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard