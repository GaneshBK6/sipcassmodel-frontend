export function SummaryDashboard({ summary = {} }) {
  // Debugging - remove in production
  console.log('SummaryDashboard received:', summary);

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <h3>Total SIP Payout</h3>
        <p>${summary.totalSipPayout?.toLocaleString() || '0'}</p>
      </div>
      <div className="dashboard-card">
        <h3>Pending Approvals</h3>
        <p>{summary.pendingApprovals || '0'}</p>
      </div>
      <div className="dashboard-card">
        <h3>SIP Payout Completion</h3>
        <p>{summary.paymentSuccessRate || '0'}%</p>
      </div>
    </div>
  );
}