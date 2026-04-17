import React from 'react';
import { getTranslation } from '../i18n';

const Navbar = ({ currentPath, onNavigate, theme, setTheme, lang, setLang }) => {
  const t = (key) => getTranslation(lang, 'nav', key);

  return (
    <nav className="navbar animate-fade-in" style={{ backgroundColor: 'var(--bg-main)' }}>
      <button 
        onClick={() => onNavigate('/')} 
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary-dark)' }}
      >
        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
        NovaCare
      </button>
      
      <div className="nav-links">
        <button onClick={() => onNavigate('/')} className={`nav-link ${currentPath === '/' ? 'active' : ''}`}>{t('dashboard')}</button>
        <button onClick={() => onNavigate('/patients')} className={`nav-link ${currentPath === '/patients' ? 'active' : ''}`}>{t('patients')}</button>
        <button onClick={() => onNavigate('/doctors')} className={`nav-link ${currentPath === '/doctors' ? 'active' : ''}`}>{t('doctors')}</button>
        <button onClick={() => onNavigate('/appointments')} className={`nav-link ${currentPath === '/appointments' ? 'active' : ''}`}>{t('appointments')}</button>
        <button onClick={() => onNavigate('/billing')} className={`nav-link ${currentPath === '/billing' ? 'active' : ''}`}>{t('billing')}</button>
        
        {/* Sleek Aesthetic Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: '1rem' }}>
          
          {/* Custom Select Dropdown */}
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            style={{
              appearance: 'none',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="ta">தமிழ் (Tamil)</option>
          </select>
          
          {/* Custom Pill Toggle Switch */}
          <div 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            style={{
              width: '50px',
              height: '26px',
              borderRadius: '13px',
              backgroundColor: theme === 'dark' ? 'var(--primary)' : '#e2e8f0',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: 'white',
              position: 'absolute',
              top: '3px',
              left: theme === 'dark' ? '27px' : '3px',
              transition: 'left 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}></div>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
