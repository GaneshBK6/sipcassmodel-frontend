import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const PIE_COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#f72585',
  '#5a189a',
  '#9b5de5',
  '#4ccf90',
  '#ffb347',
];

export default function SummaryDashboard({
  summary = {},
  uniqueRegions = [],
  selectedRegion,
  setSelectedRegion,
  pieChartData = [],
  onViewDetails,
}) {
  return (
    <div className="dashboard-view">
      {/* Region filter and button */}
      <div className="dashboard-controls">
        <div className="region-filter-container">
          <label htmlFor="region-select" className="filter-label">Region:</label>
          <select
            id="region-select"
            className="glass-input"
            value={selectedRegion}
            onChange={e => setSelectedRegion(e.target.value)}
          >
            {uniqueRegions.map(region => (
              <option key={region} value={region}>
                {region === 'all' ? 'All Regions' : region}
              </option>
            ))}
          </select>
        </div>
        <button className="glass-button" onClick={onViewDetails}>View Details</button>
      </div>

      {/* Summary cards */}
      <div className="metric-cards">
        <div className="metric-card">
          <h3>Total SIP Payout</h3>
          <p>${summary.totalSipPayout?.toLocaleString() || '0'}</p>
        </div>
        <div className="metric-card">
          <h3>Pending Approvals</h3>
          <p>{summary.pendingApprovals || '0'}</p>
        </div>
        <div className="metric-card">
          <h3>Payment Completion</h3>
          <p>{summary.paymentRate || summary.paymentCompletion || summary.paymentSuccess || summary.paymentSuccessRate || '0'}%</p>
        </div>
      </div>

      {/* Pie chart */}
      <div className="chart-container">
        <h3>SIP Payout by Region</h3>
        {pieChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={value => `$${value.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>No payout data available</p>
        )}
      </div>
    </div>
  );
}
