import React, { useState } from 'react';

const tableStyle = {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: 0,
  borderRadius: '12px',
  fontFamily: "'Poppins', sans-serif",
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
};

const headerActualsStyle = {
  padding: '10px 16px',
  fontWeight: '600',
  fontSize: '1rem',
  color: 'white',
  userSelect: 'none',
  textAlign: 'center',
  backgroundColor: '#4a5568', // muted blue-gray for static columns
  borderBottom: '2px solid #2d3748',
};

const headerUserInputStyle = {
  padding: '10px 16px',
  fontWeight: '600',
  fontSize: '1rem',
  color: '#2f855a',
  userSelect: 'none',
  textAlign: 'center',
  backgroundColor: '#e6f4ea', // soft pale green background for editable columns
  borderBottom: '2px solid #bbe5b7',
};

const editableInputStyle = {
  width: '100%',
  padding: '8px 12px',
  boxSizing: 'border-box',
  borderRadius: '8px',
  border: '1.5px solid #a7d3a9', // subtle green border
  fontSize: '0.95rem',
  fontWeight: 500,
  color: '#276749',
  backgroundColor: 'white',
  transition: 'border-color 0.3s ease',
};

const cellStaticStyle = {
  padding: '12px 16px',
  textAlign: 'center',
  verticalAlign: 'middle',
  fontSize: '1rem',
  color: '#2c5282', // blue-gray text
  backgroundColor: '#edf2f7', // very light gray-blue background
  borderBottom: '1px solid #e2e8f0',
  userSelect: 'none',
};

const cellEditableStyle = {
  padding: '12px 16px',
  textAlign: 'center',
  verticalAlign: 'middle',
  fontSize: '1rem',
  color: '#276749', // deep green text
  backgroundColor: '#f4fbf5', // very pale green background
  borderBottom: '1px solid #cce7cc',
};

const actionCellStyle = {
  padding: '12px 16px',
  textAlign: 'center',
  verticalAlign: 'middle',
  backgroundColor: '#d9edda', // soft green background for action cell
  borderBottom: '1px solid #bbe5b7',
};

const buttonStyle = {
  padding: '6px 12px',
  borderRadius: '10px',
  border: 'none',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: '0.9rem',
  userSelect: 'none',
  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  boxShadow: '0 2px 8px rgba(72, 187, 120, 0.3)',
};

const primaryButtonStyle = {
  backgroundColor: '#2f855a',
  color: 'white',
};

const secondaryButtonStyle = {
  backgroundColor: '#8f9e8f',
  color: 'white',
};

export default function AOPTargetsTable({ data, onRowSave }) {
  const [editRows, setEditRows] = useState({}); // keyed by row id

  const startEditRow = (id, rowData) => {
    setEditRows((prev) => ({
      ...prev,
      [id]: { ...rowData },
    }));
  };

  const cancelEditRow = (id) => {
    setEditRows((prev) => {
      const newEdits = { ...prev };
      delete newEdits[id];
      return newEdits;
    });
  };

  const handleInputChange = (id, field, value) => {
    setEditRows((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const saveRow = (id) => {
    if (editRows[id]) {
      const updatedData = {
        growth_percent: parseFloat(editRows[id].growth_percent) || 0,
        seller1: editRows[id].seller1 || '',
        seller2: editRows[id].seller2 || '',
        seller3: editRows[id].seller3 || '',
        seller4: editRows[id].seller4 || '',
        comments: editRows[id].comments || '',
      };
      if (onRowSave) {
        onRowSave(id, updatedData);
      }
      cancelEditRow(id);
    }
  };

  const calcTarget = (pyActuals, growthPercent) => {
    const py = parseFloat(pyActuals) || 0;
    const growth = parseFloat(growthPercent) || 0;
    return (py * (1 + growth / 100)).toFixed(2);
  };

  return (
    <table style={tableStyle} aria-label="AOP Targets Table">
      <thead>
        <tr>
          <th colSpan={2} style={{ ...headerActualsStyle, borderTopLeftRadius: '12px' }}>
            Actuals
          </th>
          <th colSpan={7} style={{ ...headerUserInputStyle }}>
            User Input
          </th>
          <th style={{ ...headerUserInputStyle, borderTopRightRadius: '12px' }}>Action</th>
        </tr>
        <tr>
          <th style={headerActualsStyle}>ShipTo</th>
          <th style={headerActualsStyle}>PY Actuals</th>
          <th style={headerUserInputStyle}>Growth %</th>
          <th style={headerUserInputStyle}>Target</th>
          <th style={headerUserInputStyle}>Seller 1</th>
          <th style={headerUserInputStyle}>Seller 2</th>
          <th style={headerUserInputStyle}>Seller 3</th>
          <th style={headerUserInputStyle}>Seller 4</th>
          <th style={headerUserInputStyle}>Comments</th>
          <th style={headerUserInputStyle}></th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => {
          const isEditing = !!editRows[row.id];
          const editRow = editRows[row.id] || {};
          return (
            <tr
              key={row.id}
              style={{
                backgroundColor: isEditing ? 'rgba(56, 161, 105, 0.1)' : 'white',
                transition: 'background-color 0.3s ease',
              }}
            >
              {/* Actuals static style */}
              <td style={cellStaticStyle}>{row.ship_to}</td>
              <td style={{ ...cellStaticStyle, textAlign: 'right' }}>
                {row.py_actuals?.toLocaleString() || 0}
              </td>

              {/* User Input style */}
              <td style={cellEditableStyle}>
                {isEditing ? (
                  <input
                    type="number"
                    value={editRow.growth_percent}
                    onChange={(e) =>
                      handleInputChange(row.id, 'growth_percent', e.target.value)
                    }
                    style={editableInputStyle}
                    aria-label={`Edit growth percent for ${row.ship_to}`}
                  />
                ) : (
                  row.growth_percent?.toFixed(2)
                )}
              </td>
              <td style={{ ...cellEditableStyle, textAlign: 'right' }}>
                {isEditing
                  ? calcTarget(row.py_actuals, editRow.growth_percent)
                  : calcTarget(row.py_actuals, row.growth_percent)}
              </td>
              {['seller1', 'seller2', 'seller3', 'seller4'].map((sellerKey) => (
                <td key={sellerKey} style={cellEditableStyle}>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editRow[sellerKey] || ''}
                      onChange={(e) =>
                        handleInputChange(row.id, sellerKey, e.target.value)
                      }
                      style={editableInputStyle}
                      aria-label={`Edit ${sellerKey} for ${row.ship_to}`}
                    />
                  ) : (
                    row[sellerKey] || ''
                  )}
                </td>
              ))}
              <td style={cellEditableStyle}>
                {isEditing ? (
                  <input
                    type="text"
                    value={editRow.comments || ''}
                    onChange={(e) =>
                      handleInputChange(row.id, 'comments', e.target.value)
                    }
                    style={editableInputStyle}
                    aria-label={`Edit comments for ${row.ship_to}`}
                  />
                ) : (
                  row.comments || ''
                )}
              </td>

              {/* Action cell */}
              <td style={actionCellStyle}>
                {isEditing ? (
                  <>
                    <button
                      style={{ ...buttonStyle, ...primaryButtonStyle, marginRight: '0.5rem' }}
                      onClick={() => saveRow(row.id)}
                      aria-label={`Save changes for ${row.ship_to}`}
                    >
                      Save
                    </button>
                    <button
                      style={{ ...buttonStyle, ...secondaryButtonStyle }}
                      onClick={() => cancelEditRow(row.id)}
                      aria-label={`Cancel editing for ${row.ship_to}`}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    style={{ ...buttonStyle, ...secondaryButtonStyle }}
                    onClick={() => startEditRow(row.id, row)}
                    aria-label={`Edit ${row.ship_to}`}
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
