import { useState, useEffect } from 'react';
import { downloadPDF } from '../services/api';

const DataTable = ({ data = [], totals = {} }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key] || '';
    const bValue = b[sortConfig.key] || '';
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const requestSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDownload = async (empId) => {
    try {
      const response = await downloadPDF(empId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sip_slip_${empId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  // Get all column keys from the first data item
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} onClick={() => requestSort(column)}>
                {column}
                {sortConfig.key === column && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <tr key={row['Emp ID']}>
              {columns.map((column) => (
                <td key={`${row['Emp ID']}-${column}`}>
                  {column === 'SIP Payout Amount' ? `$${row[column]}` : row[column]}
                </td>
              ))}
              <td>
                <button 
                  onClick={() => handleDownload(row['Emp ID'])}
                  className="download-btn"
                >
                  Download PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        {totals && (
          <tfoot>
            <tr>
              <td colSpan={3}>TOTALS:</td>
              <td>${totals.Revenue?.toLocaleString()}</td>
              <td>${totals.GP?.toLocaleString()}</td>
              <td>${totals['SIP Payout Amount']?.toLocaleString()}</td>
              <td colSpan={columns.length - 5}></td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default DataTable;