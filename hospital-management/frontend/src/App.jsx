import React from 'react';
import Navbar from './components/Navbar';
import Patients from './pages/Patients';
// Add other imports as needed

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Patients />
      </main>
    </div>
  );
}

export default App;
