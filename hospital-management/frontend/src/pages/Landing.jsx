import React from 'react';
import { getTranslation } from '../i18n';

const Landing = ({ onNavigate, lang }) => {
  const t = (key) => getTranslation(lang, 'landing', key);

  return (
    <div className="animate-fade-in" style={styles.container}>
      
      <div style={styles.splitLayout}>
        <div style={styles.leftColumn}>
          <div style={styles.badge}>{t('badge')}</div>
          <h1 style={styles.headline} dangerouslySetInnerHTML={{ __html: t('headline') }}></h1>
          <p style={styles.subHeadline}>{t('subHeadline')}</p>
        </div>

        <div style={styles.rightColumn}>
          <h3 style={styles.actionTitle}>{t('actionTitle')}</h3>
          
          <ul style={styles.actionList}>
            <li style={styles.actionItem} onClick={() => onNavigate('/appointments')}>
              <span style={styles.itemNumber}>01</span>
              <span style={styles.itemText}>{t('card1Title')}</span>
              <span style={styles.arrow}>↗</span>
            </li>
            <li style={styles.actionItem} onClick={() => onNavigate('/doctors')}>
              <span style={styles.itemNumber}>02</span>
              <span style={styles.itemText}>{t('card2Title')}</span>
              <span style={styles.arrow}>↗</span>
            </li>
            <li style={styles.actionItem} onClick={() => onNavigate('/billing')}>
              <span style={styles.itemNumber}>03</span>
              <span style={styles.itemText}>{t('card3Title')}</span>
              <span style={styles.arrow}>↗</span>
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
};

const styles = {
  container: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    padding: '0 2rem'
  },
  splitLayout: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: '4rem',
    flexWrap: 'wrap'
  },
  leftColumn: {
    flex: '1.2',
    minWidth: '400px'
  },
  rightColumn: {
    flex: '0.8',
    minWidth: '350px',
    borderLeft: '1px solid var(--border)',
    paddingLeft: '4rem'
  },
  badge: {
    fontSize: '0.8rem',
    fontWeight: '700',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: 'var(--primary)',
    marginBottom: '2rem',
    display: 'inline-block'
  },
  headline: {
    fontSize: '5.5rem',
    fontWeight: '300', 
    color: 'var(--text-main)',
    lineHeight: '1.1',
    letterSpacing: '-3px',
    marginBottom: '2.5rem'
  },
  subHeadline: {
    fontSize: '1.2rem',
    color: 'var(--text-muted)',
    lineHeight: '1.7',
    maxWidth: '500px',
    fontWeight: '400',
    marginBottom: '3rem'
  },
  actionTitle: {
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--text-muted)',
    marginBottom: '2rem'
  },
  actionList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  actionItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '1.5rem 0',
    borderBottom: '1px solid var(--border)',
    cursor: 'pointer',
    color: 'var(--primary-dark)',
  },
  itemNumber: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginRight: '2rem',
    fontWeight: '600'
  },
  itemText: {
    fontSize: '1.8rem',
    fontWeight: '400',
    flex: '1'
  },
  arrow: {
    fontSize: '1.5rem',
    opacity: '0.5'
  }
};

export default Landing;
