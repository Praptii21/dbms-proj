import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Table from '../components/Table';
import { getTranslation } from '../i18n';
import api from '../api/axios';

const Patients = ({ patients, setPatients, lang }) => {
  const t = (key) => getTranslation(lang, 'patients', key);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: 'Female', status: 'Triage', ward: 'General' });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.age) return alert("Please fill out all fields.");
    
    // Exact Alphabet Regex Validation for User Requirement
    if (!/^[A-Za-z\s]+$/.test(newPatient.name)) {
      return alert("Invalid Entry: Patient 'Name' must only contain alphabets (no numbers or special characters).");
    }

    try {
      const response = await api.post('/api/patients/', newPatient);
      setPatients([response.data, ...patients]);
      setIsModalOpen(false);
      setNewPatient({ name: '', age: '', gender: 'Female', status: 'Triage', ward: 'General' });
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("Failed to add patient to database.");
    }
  };

  const handleDeletePatient = async (patient) => {
    if (!window.confirm(`Are you sure you want to delete patient ${patient.name}?`)) return;

    try {
      await api.delete(`/api/patients/${patient.id}`);
      setPatients(patients.filter(p => p.id !== patient.id));
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert("Failed to delete patient from database.");
    }
  };

  return (
    <div className="animate-fade-in" style={{ position: 'relative' }}>
      
      {/* Add New Patient Modal (Portaled) */}
      {isModalOpen && createPortal(
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Add Patient Profile</h2>
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={styles.label}>Patient Name</label>
                <input type="text" style={styles.input} value={newPatient.name} onChange={(e) => setNewPatient({...newPatient, name: e.target.value})} placeholder="Full legal name (Alphabets only)" />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Age</label>
                  <input type="number" style={styles.input} value={newPatient.age} onChange={(e) => setNewPatient({...newPatient, age: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Gender</label>
                  <select style={styles.input} value={newPatient.gender} onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})}>
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Admission Status</label>
                  <select style={styles.input} value={newPatient.status} onChange={(e) => setNewPatient({...newPatient, status: e.target.value})}>
                    <option>Triage</option>
                    <option>Admitted</option>
                    <option>Observation</option>
                    <option>Pending</option>
                    <option>Discharged</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Assigned Ward</label>
                  <select style={styles.input} value={newPatient.ward} onChange={(e) => setNewPatient({...newPatient, ward: e.target.value})}>
                    <option>General</option>
                    <option>Cardiology</option>
                    <option>Neurology</option>
                    <option>Orthopedics</option>
                    <option>Oncology</option>
                    <option>Intensive Care (ICU)</option>
                    <option>Pediatrics</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={styles.cancelBtn}>Cancel</button>
                <button type="submit" style={styles.confirmBtn}>Create Profile</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 className="page-title">{t('title')}</h1><p className="page-subtitle">{t('subtitle')}</p></div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>{t('addBtn')}</button>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <Table data={patients} onDelete={handleDeletePatient} />
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalContent: { backgroundColor: 'var(--bg-card)', padding: '2.5rem', borderRadius: '4px', width: '500px', border: '1px solid var(--border)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
  label: { display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' },
  input: { width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' },
  cancelBtn: { flex: 1, padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-muted)' },
  confirmBtn: { flex: 1, padding: '0.75rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '4px', border: 'none' }
};

export default Patients;
