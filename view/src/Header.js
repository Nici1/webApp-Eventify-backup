import './header.css'; // Import your CSS file
import { useState } from 'react';
import './app.css'
import { Link } from 'react-router-dom';


export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="header">
      <header>
        <div></div> {/* Empty div for spacing */}
        <div className="oval-container" onClick={toggleDropdown}>
          <svg
            className='svg'
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          <svg
            className='svg'
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className={`dropdown-content ${isDropdownOpen ? 'show' : ''}`}>

        <div><Link to="/login" className='custom-link' id="loginBtn">Log in</Link></div>
      <div><Link to="/register" className='custom-link' id="signupBtn">Sign Up</Link></div>

        </div>
      </header>
    </div>
  );
}
