import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Hospital Management</h1>
      <div className="links">
        <a href="/">Patients</a>
        <a href="/doctors">Doctors</a>
        <a href="/appointments">Appointments</a>
        <a href="/billing">Billing</a>
      </div>
    </nav>
  );
};

export default Navbar;
