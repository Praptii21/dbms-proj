import React from 'react';

const Table = ({ data, onEdit, onDelete }) => {
  if (!data || data.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No data available.</div>;
  }

  const columns = Object.keys(data[0]);

  // Hooking straight into our new dynamic CSS variables mapped securely in index.css
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'admitted': return { bg: 'var(--badge-success-bg)', text: 'var(--badge-success-text)' };
      case 'paid': return { bg: 'var(--badge-success-bg)', text: 'var(--badge-success-text)' };
      
      case 'discharged': return { bg: 'var(--badge-neutral-bg)', text: 'var(--badge-neutral-text)' };
      case 'voided': return { bg: 'var(--badge-neutral-bg)', text: 'var(--badge-neutral-text)' };
      
      case 'observation': return { bg: 'var(--badge-warning-bg)', text: 'var(--badge-warning-text)' };
      
      case 'triage': return { bg: 'var(--badge-danger-bg)', text: 'var(--badge-danger-text)' };
      
      case 'pending': return { bg: 'var(--badge-info-bg)', text: 'var(--badge-info-text)' };
      
      default: return { bg: 'var(--badge-neutral-bg)', text: 'var(--badge-neutral-text)' };
    }
  };

  return (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} style={styles.th}>
                {col.toUpperCase()}
              </th>
            ))}
            {(onEdit || onDelete) && <th style={styles.th}>ACTIONS</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} style={styles.tr}>
              {columns.map((col) => (
                <td key={col} style={styles.td}>
                  {col === 'status' ? (
                    <span style={{
                      ...styles.statusBadge, 
                      backgroundColor: getStatusColor(row[col]).bg,
                      color: getStatusColor(row[col]).text
                    }}>
                      {row[col]}
                    </span>
                  ) : (
                    row[col]
                  )}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {onEdit && (
                      <button onClick={() => onEdit(row)} style={styles.actionBtn}>Edit</button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(row)} style={styles.deleteBtn}>Delete</button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  tableWrapper: { width: '100%', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '1rem 1.5rem', backgroundColor: 'var(--bg-main)', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.8rem', letterSpacing: '0.5px' },
  tr: { borderTop: '1px solid var(--border)' },
  td: { padding: '1rem 1.5rem', color: 'var(--text-main)', fontSize: '0.9rem' },
  statusBadge: { padding: '0.35rem 0.65rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', display: 'inline-block', letterSpacing: '0.5px', textTransform: 'uppercase' },
  actionBtn: { color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', background: 'none', border: 'none' },
  deleteBtn: { color: 'var(--badge-danger-bg)', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', background: 'none', border: 'none' }
};

export default Table;
