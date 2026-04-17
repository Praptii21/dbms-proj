import React, { useState, useRef, useEffect } from 'react';

const FloatingWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hi there! I'm Nova. How can I help you navigate the portal today?" }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userInput = inputVal;
    
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: userInput }]);
    setInputVal('');

    // Simulate basic NLP Intent Recognition
    setTimeout(() => {
      const normalizedQuery = userInput.toLowerCase();
      let botReply = "I'm not quite sure I understand. Could you please specify if you need assistance with Appointments, Billing, or finding a Doctor?";
      
      if (normalizedQuery.match(/hi|hello|hey|greetings/)) {
        botReply = "Hello! I am Nova, your healthcare assistant. How can I assist you with your health records today?";
      } 
      else if (normalizedQuery.match(/appoint|schedule|book|visit|reschedule/)) {
        botReply = "You can manage your schedule directly in the 'Appointments' tab. Click the '+ New Appointment' button there to book a slot with a doctor.";
      } 
      else if (normalizedQuery.match(/doctor|specialist|physician|who/)) {
        botReply = "Looking for a specialist? Head over to our 'Doctors' directory to view available cardiologists, neurologists, and request an appointment.";
      } 
      else if (normalizedQuery.match(/bill|pay|cost|invoice|statement/)) {
        botReply = "I can help with finances! Proceed to the 'Billing' tab to view your recent invoices, current pending balance, and make secure payments.";
      } 
      else if (normalizedQuery.match(/patient|admit|ward|triage/)) {
        botReply = "Are you medical staff? You can manage triage and admission records securely via the 'Patients' directory dashboard.";
      } 
      else if (normalizedQuery.match(/cancel|remove|delete/)) {
        botReply = "If you need to cancel an appointment, please check the 'Appointments' tab and click action 'Cancel'. Alternatively, call our front desk.";
      }
      else if (normalizedQuery.match(/thank|thanks|ok|okay/)) {
        botReply = "You're very welcome! Let me know if you need anything else.";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 600);
  };

  return (
    <div style={styles.container}>
      {isOpen && (
        <div style={styles.chatWindow} className="animate-fade-in">
          <div style={styles.chatHeader}>
            <h4 style={{ color: 'white', fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 8, height: 8, backgroundColor: '#4ade80', borderRadius: '50%' }}></div>
              NovaCare Assistant
            </h4>
            <button onClick={() => setIsOpen(false)} style={{ color: 'white', fontWeight: 'bold' }}>✕</button>
          </div>
          
          <div style={styles.chatBody}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                ...styles.messageBubble,
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? 'var(--primary)' : 'var(--bg-card)',
                color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
                borderBottomRightRadius: msg.sender === 'user' ? '0' : '8px',
                borderBottomLeftRadius: msg.sender === 'bot' ? '0' : '8px',
              }}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form style={styles.chatInput} onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Type a message..." 
              style={styles.input} 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <button type="submit" style={styles.sendBtn}>Send</button>
          </form>
        </div>
      )}

      <button 
        style={styles.floatingBtn} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '↓' : '💬'}
      </button>
    </div>
  );
};

const styles = {
  container: { position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' },
  floatingBtn: { width: '60px', height: '60px', borderRadius: '30px', backgroundColor: 'var(--primary)', color: 'white', fontSize: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', transition: 'transform 0.2s', border: '1px solid rgba(255,255,255,0.1)' },
  chatWindow: { width: '320px', height: '420px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid var(--border)' },
  chatHeader: { padding: '1rem', backgroundColor: 'var(--primary-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  chatBody: { padding: '1rem', flex: 1, overflowY: 'auto', backgroundColor: 'var(--bg-main)', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  messageBubble: { padding: '0.75rem 1rem', borderRadius: '8px', boxShadow: 'none', fontSize: '0.85rem', maxWidth: '85%', lineHeight: '1.4', border: '1px solid var(--border)' },
  chatInput: { padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-card)' },
  input: { flex: 1, padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: '4px', outline: 'none', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' },
  sendBtn: { color: 'var(--primary)', fontWeight: '600', padding: '0 0.5rem' }
};

export default FloatingWidget;
