import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { getTranslation } from '../i18n';

const Doctors = ({ lang, appointments, setAppointments }) => {
  const t = (key) => getTranslation(lang, 'doctors', key);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  const [newApt, setNewApt] = useState({ date: '', time: '', type: '' });

  const directory = [
    { name: 'Dr. Sarah Jenkins', spec: 'Cardiology', exp: '15 Years', status: 'Available' },
    { name: 'Dr. Marcus Webb', spec: 'Neurology', exp: '11 Years', status: 'Booked' },
    { name: 'Dr. Alyssa Chen', spec: 'Pediatrics', exp: '8 Years', status: 'Available' },
    { name: 'Dr. Robert Frost', spec: 'Orthopedics', exp: '22 Years', status: 'Available' },
    { name: 'Dr. Emily Carter', spec: 'Dermatology', exp: '12 Years', status: 'Booked' },
    { name: 'Dr. James Mitchell', spec: 'General Surgery', exp: '19 Years', status: 'Available' },
    { name: 'Dr. Priya Sharma', spec: 'Oncology', exp: '14 Years', status: 'Booked' },
    { name: 'Dr. David Kim', spec: 'Psychiatry', exp: '9 Years', status: 'Available' }
  ];

  const handleOpenBooking = (docName) => {
    setSelectedDoctor(docName);
    setIsModalOpen(true);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!newApt.date || !newApt.time || !newApt.type) return alert("Please fill out all scheduling details.");
    
    const formattedDate = new Date(newApt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    setAppointments([...appointments, {
      id: Date.now(),
      date: formattedDate,
      time: newApt.time,
      doctor: selectedDoctor,
      type: newApt.type,
      status: 'Active'
    }]);

    alert(`Successfully booked a visit with ${selectedDoctor} for ${formattedDate}! Check your Appointments tab.`);
    setIsModalOpen(false);
    setNewApt({ date: '', time: '', type: '' });
  };

  return (
    <div className="animate-fade-in" style={{ position: 'relative' }}>
      
      {/* Booking Modal (Portaled) */}
      {isModalOpen && createPortal(
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Book Slot with {selectedDoctor}</h2>
            <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={styles.label}>Consultation Type</label>
                <input type="text" style={styles.input} value={newApt.type} onChange={(e) => setNewApt({...newApt, type: e.target.value})} placeholder="e.g. Heart Checkup" />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Date</label>
                  <input type="date" style={styles.input} value={newApt.date} onChange={(e) => setNewApt({...newApt, date: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Time</label>
                  <input type="time" style={styles.input} value={newApt.time} onChange={(e) => setNewApt({...newApt, time: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={styles.cancelBtn}>Cancel</button>
                <button type="submit" style={styles.confirmBtn}>Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 className="page-title">{t('title')}</h1><p className="page-subtitle">{t('subtitle')}</p></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {directory.map((doc, i) => (
          <div key={i} className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: 'var(--primary-dark)', borderRadius: '50%', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-main)', fontWeight: 'bold' }}>
              {doc.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', marginBottom: '0.25rem' }}>{doc.name}</h3>
            <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.85rem', marginBottom: '1rem' }}>{doc.spec} • {doc.exp}</p>
            
            <button 
              onClick={() => handleOpenBooking(doc.name)}
              className="btn-primary" 
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', backgroundColor: doc.status === 'Available' ? 'var(--primary)' : 'var(--bg-main)', color: doc.status === 'Available' ? 'white' : 'var(--text-muted)', border: doc.status === 'Available' ? 'none' : '1px solid var(--border)' }}
              disabled={doc.status !== 'Available'}
            >
              {doc.status === 'Available' ? t('reqBtn') : t('unavailBtn')}
            </button>
          </div>
        ))}
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

export default Doctors;
