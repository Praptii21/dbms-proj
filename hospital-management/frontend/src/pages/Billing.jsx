import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Table from '../components/Table';
import { getTranslation } from '../i18n';

const Billing = ({ balance, setBalance, invoices, setInvoices, lang }) => {
  const t = (key) => getTranslation(lang, 'billing', key);
  const [editInvoice, setEditInvoice] = useState(null);

  const handlePayment = () => {
    if (balance > 0) {
      setBalance(0);
      setInvoices(invoices.map(inv => ({...inv, status: 'Paid'})));
      alert(t('payAlertSuccess'));
    } else {
      alert(t('payAlertFail'));
    }
  };

  const handleDownload = () => {
    const content = `NOVACARE SECURE STATEMENT\n=========================\nDate: ${new Date().toLocaleDateString()}\nPending Balance: ₹${balance.toFixed(2)}\n\nRecent Invoices:\n${invoices.map(i => `${i.id} | ${i.date} | ${i.service} | ${i.amount} | ${i.status}`).join('\n')}\n\nThank you for choosing NovaCare.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NovaCare_Statement_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setInvoices(invoices.map(inv => inv.id === editInvoice.id ? editInvoice : inv));
    // Updated to strip the INR explicitly for math calculation instead of dollar
    const newBalance = invoices.map(i => i.id === editInvoice.id ? editInvoice : i)
                               .filter(i => i.status !== 'Paid')
                               .reduce((sum, item) => sum + parseFloat(item.amount.replace('₹', '')), 0);
    setBalance(newBalance);
    setEditInvoice(null);
  };

  return (
    <div className="animate-fade-in" style={{ position: 'relative' }}>
      
      {/* Invoice Edit Modal */}
      {editInvoice !== null && createPortal(
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Edit Invoice {editInvoice.id}</h2>
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={styles.label}>Service Provided</label>
                <input type="text" style={styles.input} value={editInvoice.service} onChange={(e) => setEditInvoice({...editInvoice, service: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Amount Format (e.g. ₹150.00)</label>
                  <input type="text" style={styles.input} value={editInvoice.amount} onChange={(e) => setEditInvoice({...editInvoice, amount: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Status</label>
                  <select style={styles.input} value={editInvoice.status} onChange={(e) => setEditInvoice({...editInvoice, status: e.target.value})}>
                    <option>Pending</option>
                    <option>Paid</option>
                    <option>Voided</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setEditInvoice(null)} style={styles.cancelBtn}>Cancel</button>
                <button type="submit" style={styles.confirmBtn}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      <div className="page-header">
        <h1 className="page-title">{t('title')}</h1>
        <p className="page-subtitle">{t('subtitle')}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-main)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--primary-dark)' }}>{t('recent')}</h3>
          </div>
          <Table data={invoices} onEdit={(row) => setEditInvoice(row)} />
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: 'fit-content' }}>
          <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>{t('balanceTitle')}</h3>
          <div style={{ fontSize: '4rem', fontWeight: '300', color: 'var(--primary-dark)', margin: '0.5rem 0' }}>
            ₹{balance.toFixed(2)}
          </div>
          <p style={{ color: balance > 0 ? '#ef4444' : 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2.5rem', fontWeight: 'bold' }}>
            {balance > 0 ? t('due') : t('caughtUp')}
          </p>
          <button onClick={handlePayment} className="btn-primary" style={{ width: '100%', marginBottom: '1rem', opacity: balance === 0 ? 0.5 : 1 }} disabled={balance === 0}>
            {t('payBtn')}
          </button>
          <button onClick={handleDownload} style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'underline', width: '100%', textAlign: 'center', padding: '0.5rem' }}>
            {t('downloadBtn')}
          </button>
        </div>

      </div>
    </div>
  );
};

const styles = {
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalContent: { backgroundColor: 'var(--bg-card)', padding: '2.5rem', borderRadius: '4px', width: '450px', border: '1px solid var(--border)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
  label: { display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' },
  input: { width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' },
  cancelBtn: { flex: 1, padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-muted)' },
  confirmBtn: { flex: 1, padding: '0.75rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '4px', border: 'none' }
};

export default Billing;
