import React, { useState, useEffect } from 'react';
import api from './api/axios';
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

  // Real Database State
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [balance, setBalance] = useState(0);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [patientsRes, doctorsRes, appointmentsRes, billingRes, balanceRes] = await Promise.all([
          api.get('/api/patients/'),
          api.get('/api/doctors/'),
          api.get('/api/appointments/'),
          api.get('/api/billing/'),
          api.get('/api/billing/balance')
        ]);

        setPatients(patientsRes.data);
        setDoctors(doctorsRes.data);
        setAppointments(appointmentsRes.data);
        setInvoices(billingRes.data);
        setBalance(balanceRes.data.balance);
      } catch (error) {
        console.error("Error fetching data from backend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
  }, [theme]);

  const renderPage = () => {
    if (loading) return <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'80vh'}}>Loading Database...</div>;

    switch (currentPath) {
      case '/': return <Landing onNavigate={setCurrentPath} lang={lang} />;
      case '/patients': return <Patients patients={patients} setPatients={setPatients} lang={lang} />;
      case '/doctors': return <Doctors doctors={doctors} setDoctors={setDoctors} lang={lang} appointments={appointments} setAppointments={setAppointments} />;
      case '/appointments': return <Appointments appointments={appointments} setAppointments={setAppointments} lang={lang} doctors={doctors} />;
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
