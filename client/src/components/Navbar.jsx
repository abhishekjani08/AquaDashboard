import React from 'react';
import logo from '../images/logo.png';
import '../css/Navbar.css';

export default function Navbar() {
  return (
    <div>
      <nav className="navbar">
        <img src={logo} alt="Logo" className="w-[15%] h-auto" /> {/* Add the logo image here */}
        <span className="navbar-toggle" id="js-navbar-toggle">
          <i className="fas fa-bars"></i>
        </span>
      </nav>
    </div>
  );
}
