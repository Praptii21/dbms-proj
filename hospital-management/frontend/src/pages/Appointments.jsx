import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { getTranslation } from '../i18n';
import api from '../api/axios';

// Helper function to convert browser 24hr "14:30" string to 12hr "02:30 PM"
const formatAMPM = (time24) => {
  if (!time24) return '12:00 PM';
  const [hours, minutes] = time24.split(':');
  let h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12; // Convert 0 to 12 for midnight
  return `${h.toString().padStart(2, '0')}:${minutes} ${ampm}`;
};

const Appointments = ({ appointments, setAppointments, lang, doctors }) => {
  const t = (key) => getTranslation(lang, 'appointments', key);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [tempDateTime, setTempDateTime] = useState({ date: '', time: '' });
  const [newApt, setNewApt] = useState({ date: '', time: '', doctor: '', type: '' });

  const handleCancel = async (id) => {
    try {
      await api.delete(`/api/appointments/${id}`);
      setAppointments(appointments.filter(apt => apt.id !== id));
    } catch (error) {
      console.error("Error canceling appointment:", error);
    }
  };
  
  const openRescheduleModal = (id) => {
    setRescheduleId(id);
    setTempDateTime({ date: '', time: '' });
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!tempDateTime.date || !tempDateTime.time) return alert(t('alert'));
    const formattedDate = new Date(tempDateTime.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Find existing apt to preserve other fields
    const existing = appointments.find(a => a.id === rescheduleId);
    if (!existing) return;

    try {
      const updatedData = { ...existing, date: formattedDate, time: formatAMPM(tempDateTime.time) };
      const response = await api.put(`/api/appointments/${rescheduleId}`, updatedData);
      setAppointments(appointments.map(apt => apt.id === rescheduleId ? response.data : apt));
      setRescheduleId(null);
    } catch (error) {
      console.error("Error rescheduling:", error);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!newApt.date || !newApt.type || !newApt.doctor) return alert(t('alert'));
    const formattedDate = new Date(newApt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    try {
      const payload = { 
        date: formattedDate, 
        time: formatAMPM(newApt.time), 
        doctor: newApt.doctor, 
        type: newApt.type, 
        status: 'Active' 
      };
      const response = await api.post('/api/appointments/', payload);
      setAppointments([...appointments, response.data]);
      setIsModalOpen(false);
      setNewApt({ date: '', time: '', doctor: '', type: '' });
    } catch (error) {
      console.error("Error scheduling:", error);
    }
  };

  return (
    <div className="animate-fade-in" style={{ position: 'relative' }}>
      
      {/* New Appointment Modal */}
      {isModalOpen && createPortal(
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>{t('modalTitle')}</h2>
            <form onSubmit={handleScheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div><label style={styles.label}>{t('modalType')}</label><input type="text" style={styles.input} value={newApt.type} onChange={(e) => setNewApt({...newApt, type: e.target.value})} placeholder="e.g. Heart Checkup" /></div>
              <div><label style={styles.label}>{t('modalDoc')}</label>
                <select style={styles.input} value={newApt.doctor} onChange={(e) => setNewApt({...newApt, doctor: e.target.value})}>
                  <option value="">Select Doctor</option>
                  {doctors.map(doc => <option key={doc.id} value={doc.name}>{doc.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}><label style={styles.label}>{t('modalDate')}</label><input type="date" style={styles.input} value={newApt.date} onChange={(e) => setNewApt({...newApt, date: e.target.value})} /></div>
                <div style={{ flex: 1 }}><label style={styles.label}>{t('modalTime')}</label><input type="time" style={styles.input} value={newApt.time} onChange={(e) => setNewApt({...newApt, time: e.target.value})} /></div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={styles.cancelBtn}>{t('modalCancel')}</button>
                <button type="submit" style={styles.confirmBtn}>{t('modalConfirm')}</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Reschedule Modal */}
      {rescheduleId !== null && createPortal(
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Reschedule Visit</h2>
            <form onSubmit={handleRescheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}><label style={styles.label}>{t('modalDate')}</label><input type="date" style={styles.input} value={tempDateTime.date} onChange={(e) => setTempDateTime({...tempDateTime, date: e.target.value})} /></div>
                <div style={{ flex: 1 }}><label style={styles.label}>{t('modalTime')}</label><input type="time" style={styles.input} value={tempDateTime.time} onChange={(e) => setTempDateTime({...tempDateTime, time: e.target.value})} /></div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setRescheduleId(null)} style={styles.cancelBtn}>{t('modalCancel')}</button>
                <button type="submit" style={styles.confirmBtn}>Confirm New Block</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 className="page-title">{t('title')}</h1><p className="page-subtitle">{t('subtitle')}</p></div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>{t('newBtn')}</button>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '2rem' }}>
          {appointments.length > 0 ? (
            appointments.map((apt) => (
              <div key={apt.id} style={styles.aptRow}>
                <div style={styles.dateBlock}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary-dark)' }}>{apt.date.split(',')[0]}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{apt.time}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.1rem' }}>{apt.type}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{apt.doctor}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => openRescheduleModal(apt.id)} style={styles.actionBtn}>{t('reschedule')}</button>
                  <button onClick={() => handleCancel(apt.id)} style={{...styles.actionBtn, color: 'var(--badge-danger-text)', borderColor: 'var(--border)', backgroundColor: 'var(--badge-danger-bg)'}}>{t('cancel')}</button>
                </div>
              </div>
            ))
          ) : (<div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>{t('empty')}</div>)}
        </div>
      </div>
    </div>
  );
};

const styles = {
  aptRow: { display: 'flex', alignItems: 'center', padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '6px', marginBottom: '1rem' },
  dateBlock: { width: '120px', borderRight: '1px solid var(--border)', paddingRight: '1.5rem', marginRight: '1.5rem' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalContent: { backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '6px', width: '450px', border: '1px solid var(--border)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
  label: { display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' },
  input: { width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' },
  actionBtn: { color: 'var(--primary)', fontSize: '0.9rem', padding: '0.5rem 1rem', border: '1px solid var(--border)', borderRadius: '4px' },
  cancelBtn: { flex: 1, padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-muted)' },
  confirmBtn: { flex: 1, padding: '0.75rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '4px', border: 'none' }
};

export default Appointments;
