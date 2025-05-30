import React, { useState, useEffect, useMemo } from 'react';

import FileUpload from './components/FileUpload';

import DataTable from './components/DataTable';

import { getRawData, getSummary } from './services/api';

import './App.css';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';



export default function App() {

  const [tableData, setTableData] = useState([]);

  const [allTableData, setAllTableData] = useState([]);

  const [totals, setTotals] = useState({});

  const [summary, setSummary] = useState({

    totalSipPayout: 0,

    pendingApprovals: 0,

    paymentSuccessRate: 0

  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard');

  const [selectedRegion, setSelectedRegion] = useState('all');

  const [sidebarOpen, setSidebarOpen] = useState(false);



  const PIE_CHART_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#f72585', '#5A189A', '#9B5DE5', '#4cc9f0', '#ffb347'];



  const uniqueRegions = useMemo(() => {

    const regions = new Set(['all']);

    allTableData.forEach(row => {

      if (row.Region) regions.add(row.Region);

    });

    return Array.from(regions).sort();

  }, [allTableData]);



  const pieChartData = useMemo(() => {

    if (!allTableData.length) return [];

   

    const regionalPayouts = allTableData.reduce((acc, row) => {

      const region = row.Region || 'Unknown';

      const amount = parseFloat(String(row['SIP Payout Amount']).replace(/[^0-9.-]/g, '')) || 0;

      acc[region] = (acc[region] || 0) + amount;

      return acc;

    }, {});



    return Object.entries(regionalPayouts)

      .map(([name, value]) => ({ name, value }))

      .sort((a, b) => b.value - a.value);

  }, [allTableData]);



  const detailsTableData = useMemo(() => {

    return tableData.map(({ Approval, 'SIP Paid': _sipPaid, ...rest }) => rest);

  }, [tableData]);



const fetchAllData = async () => {
  try {
    setLoading(true);
    setError('');

    // First get all data regardless of tab
    const allDataResponse = await getRawData('all');
    const allData = allDataResponse.data?.data || [];
    const allTotals = allDataResponse.data?.totals || {};
    setAllTableData(allData);

    if (activeTab === 'statements') {
      // For statements tab, use all data
      setTableData(allData);
      setTotals(allTotals);
    } else {
      // For other tabs (dashboard/details), get region-filtered data
      const filteredDataResponse = await getRawData(selectedRegion);
      const filteredData = filteredDataResponse.data?.data || [];
      const filteredTotals = filteredDataResponse.data?.totals || {};
      
      setTableData(filteredData);
      setTotals(filteredTotals);

      // Only fetch summary for dashboard
      if (activeTab === 'dashboard') {
        const summaryResponse = await getSummary(selectedRegion);
        setSummary({
          totalSipPayout: summaryResponse.data?.paid_total || 0,
          pendingApprovals: summaryResponse.data?.pending_approvals || 0,
          paymentSuccessRate: summaryResponse.data?.success_rate || 0
        });
      }
    }
  } catch (err) {
    setError(err.response?.data?.error || 'Failed to load data');
    console.error('API Error:', err);
  } finally {
    setLoading(false);
  }
};



  const handleUploadSuccess = async () => {

    console.log('Refreshing data after upload...');

    await fetchAllData();

  };



  useEffect(() => {

    fetchAllData();

  }, [selectedRegion, activeTab]);



  const toggleSidebar = () => {

    setSidebarOpen(!sidebarOpen);

  };



  return (

    <div className={`app-container ${sidebarOpen ? 'sidebar-open' : ''}`}>

      <nav className="glass-nav modern-background">

        <div className="nav-brand">

          <h1>SIP <span className="gradient-text">CASS</span></h1>

           <p className="tagline">                Your one-stop for all SIP-related analytics</p>

        </div>

      </nav>



      <div className="app-grid">

        <aside className="glass-sidebar modern-background">

          <div className="sidebar-tabs">

            <button

              className={`sidebar-tab ${activeTab === 'dashboard' ? 'active' : ''}`}

              onClick={() => {

                setActiveTab('dashboard');

                setSidebarOpen(false);

              }}

            >

              <span className="tab-icon">

                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">

                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />

                  <polyline points="9 22 9 12 15 12 15 22" />

                </svg>

              </span>

              <span className="tab-label">Dashboard</span>

              {activeTab === 'dashboard' && <div className="active-indicator" />}

            </button>

           

            <button

              className={`sidebar-tab ${activeTab === 'statements' ? 'active' : ''}`}

              onClick={() => {

                setActiveTab('statements');

                setSidebarOpen(false);

              }}

            >

              <span className="tab-icon">

                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">

                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />

                  <polyline points="14 2 14 8 20 8" />

                  <line x1="16" y1="13" x2="8" y2="13" />

                  <line x1="16" y1="17" x2="12" y2="17" />

                  <polyline points="10 9 9 9 8 9" />

                </svg>

              </span>

              <span className="tab-label">Statements</span>

              {activeTab === 'statements' && <div className="active-indicator" />}

            </button>

           

            <button

              className={`sidebar-tab ${activeTab === 'details' ? 'active' : ''}`}

              onClick={() => {

                setActiveTab('details');

                setSidebarOpen(false);

              }}

            >

              <span className="tab-icon">

                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">

                  <path d="M12 20h9" />

                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />

                </svg>

              </span>

              <span className="tab-label">Details</span>

              {activeTab === 'details' && <div className="active-indicator" />}

            </button>

           

            <button

              className={`sidebar-tab ${activeTab === 'upload' ? 'active' : ''}`}

              onClick={() => {

                setActiveTab('upload');

                setSidebarOpen(false);

              }}

            >

              <span className="tab-icon">

                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">

                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />

                  <polyline points="17 8 12 3 7 8" />

                  <line x1="12" y1="3" x2="12" y2="15" />

                </svg>

              </span>

              <span className="tab-label">Upload</span>

              {activeTab === 'upload' && <div className="active-indicator" />}

            </button>

          </div>

        </aside>



        <main className="glass-main">

          {loading && (

            <div className="loading-overlay">

              <div className="neo-spinner"><div className="spinner-inner"></div></div>

              <p className="loading-text">Crunching Numbers...</p>

            </div>

          )}



          {error && (

            <div className="error-glass">

              <span className="error-icon">

                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">

                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />

                  <line x1="12" y1="9" x2="12" y2="13" />

                  <line x1="12" y1="17" x2="12" y2="17" />

                </svg>

              </span>

              <p>{error}</p>

              <button onClick={() => setError('')} className="glass-button small close-button">

                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">

                  <line x1="18" y1="6" x2="6" y2="18" />

                  <line x1="6" y1="6" x2="18" y2="18" />

                </svg>

              </button>

            </div>

          )}



          {!loading && !error && (

            <>

              {activeTab === 'dashboard' && (

                <div className="dashboard-view">

                  <div className="dashboard-controls">

                    <div className="region-filter-container">

                      <label htmlFor="region-select" className="filter-label">Region:</label>

                      <select

                        id="region-select"

                        className="region-select glass-input"

                        value={selectedRegion}

                        onChange={(e) => setSelectedRegion(e.target.value)}

                      >

                        {uniqueRegions.map(region => (

                          <option key={region} value={region}>

                            {region === 'all' ? 'All Regions' : region}

                          </option>

                        ))}

                      </select>

                    </div>

                    <button

                      className="glass-button primary"

                      onClick={() => setActiveTab('details')}

                    >

                      <span className="button-icon">

                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">

                          <path d="M12 20h9" />

                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />

                        </svg>

                      </span>

                      View Details

                    </button>

                  </div>



                  <div className="metric-cards">

                    <div className="luxury-card">

                      <div className="card-header">

                        <h3>Total SIP Payout</h3>

                        <div className="card-badge positive">

                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">

                            <polyline points="22 7 12 17 2 7" />

                          </svg>

                          <span>This Quarter</span>

                        </div>

                      </div>

                      <p className="metric-value">${summary.totalSipPayout?.toLocaleString() || '0'}</p>

                    </div>



                    <div className="luxury-card">

                      <div className="card-header">

                        <h3>Pending Approvals</h3>

                        <div className="card-badge warning">

                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">

                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />

                            <line x1="12" y1="9" x2="12" y2="13" />

                            <line x1="12" y1="17" x2="12" y2="17" />

                          </svg>

                          <span>Requires Action</span>

                        </div>

                      </div>

                      <p className="metric-value">{summary.pendingApprovals || '0'}</p>

                    </div>



                    <div className="luxury-card">

                      <div className="card-header">

                        <h3>SIP Payout Completion</h3>

                        <div className="card-badge success">

                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">

                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />

                            <polyline points="22 4 12 14.01 9 11.01" />

                          </svg>

                          <span>This Quarter</span>

                        </div>

                      </div>

                      <p className="metric-value">{summary.paymentSuccessRate || '0'}%</p>

                    </div>

                  </div>



                  <div className="chart-section luxury-card">

                    <h3 className="chart-title">Total SIP Payout by Region</h3>

                    {pieChartData.length > 0 ? (

                      <ResponsiveContainer width="100%" height={500}>

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

                              <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />

                            ))}

                          </Pie>

                          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />

                          <Legend />

                        </PieChart>

                      </ResponsiveContainer>

                    ) : (

                      <p className="no-chart-data">No regional payout data available for the chart.</p>

                    )}

                  </div>

                </div>

              )}



              {activeTab === 'statements' && (

                <div className="statements-view">

                  <div className="details-header-controls">

                    <h2>Statements</h2>

                    <div className="search-control"> {/* New wrapper div */}
                    <button className="glass-button primary">

                      <span className="button-icon">

                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">

                          <circle cx="11" cy="11" r="8" />

                          <line x1="21" y1="21" x2="16.65" y2="16.65" />

                        </svg>

                      </span>

                      Search

                    </button>

                  </div>
                  </div>

                  <DataTable data={tableData} totals={totals} />

                </div>

              )}



              {activeTab === 'details' && (

                <div className="details-view">

                  <div className="details-header-controls">

                    <h2>Details Overview</h2>

                    <button className="glass-button primary">

                      <span className="button-icon">

                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">

                          <circle cx="11" cy="11" r="8" />

                          <line x1="21" y1="21" x2="16.65" y2="16.65" />

                        </svg>

                      </span>

                      Search

                    </button>

                  </div>

                  <DataTable data={detailsTableData} totals={totals} />

                </div>

              )}



              {activeTab === 'upload' && (

                <div className="upload-view">

                  <h2 className="upload-section-title">Upload your SIP Payout Calculation file here</h2>

                  <FileUpload onUploadSuccess={handleUploadSuccess} />

                </div>

              )}

            </>

          )}

        </main>

      </div>

    </div>

  );

}