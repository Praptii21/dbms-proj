import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Billing from './pages/Billing';
import FloatingWidget from './components/FloatingWidget';
import './App.css';

// Generic Hook to sync state with browser's Local Storage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn("Error reading localStorage", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn("Error setting localStorage", error);
    }
  }, [key, value]);

  return [value, setValue];
}

function App() {
  const [currentPath, setCurrentPath] = useLocalStorage('nova_current_path', '/');
  
  // Destructible App Settings
  const [theme, setTheme] = useLocalStorage('nova_theme', 'light');
  const [lang, setLang] = useLocalStorage('nova_lang', 'en');

  // Persistent Mock Database
  const [patients, setPatients] = useLocalStorage('nova_patients', [
    { id: 'PT-001', name: 'Eleanor Shellstrop', age: 34, gender: 'Female', status: 'Admitted', ward: 'Cardiology' },
    { id: 'PT-002', name: 'Chidi Anagonye', age: 36, gender: 'Male', status: 'Discharged', ward: 'Neurology' },
  ]);

  const [appointments, setAppointments] = useLocalStorage('nova_appointments', [
    { id: 1, date: 'Oct 24, 2024', time: '10:00 AM', doctor: 'Dr. Sarah Jenkins', type: 'Heart Checkup', status: 'Active' },
  ]);

  // Keys updated to `_v2` to force a cache reset for local users so the new Rupee values populate
  const [balance, setBalance] = useLocalStorage('nova_balance_v2', 15200.00);
  
  const [invoices, setInvoices] = useLocalStorage('nova_invoices_v2', [
    { id: 'INV-29001', date: 'Sep 14, 2024', service: 'General Consultation', amount: '₹1200.00', status: 'Paid' },
    { id: 'INV-29084', date: 'Oct 02, 2024', service: 'Blood Work Panel', amount: '₹15200.00', status: 'Pending' },
  ]);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
  }, [theme]);

  const renderPage = () => {
    switch (currentPath) {
      case '/': return <Landing onNavigate={setCurrentPath} lang={lang} />;
      case '/patients': return <Patients patients={patients} setPatients={setPatients} lang={lang} />;
      case '/doctors': return <Doctors lang={lang} appointments={appointments} setAppointments={setAppointments} />;
      case '/appointments': return <Appointments appointments={appointments} setAppointments={setAppointments} lang={lang} />;
      case '/billing': return <Billing balance={balance} setBalance={setBalance} invoices={invoices} setInvoices={setInvoices} lang={lang} />;
      default: return <Landing onNavigate={setCurrentPath} lang={lang} />;
    }
  };

  return (
    <div className="app-container">
      <Navbar currentPath={currentPath} onNavigate={setCurrentPath} theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} />
      <main className="main-content">{renderPage()}</main>
      <FloatingWidget />
    </div>
  );
}

export default App;
