import React, { useContext } from 'react';
import UserContext from '../context/UserContext';

export default function LogoutButton() {
  const { logout } = useContext(UserContext);

  return (
    <>
      <style>{`
        .logout-button {
          background: linear-gradient(135deg, #0f2027, #203a43);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          padding: 16px 24px;
          cursor: pointer;
          transition: background 0.5s ease, box-shadow 0.3s ease;
          user-select: none;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          max-width: none;
	  box-sizing: border-box;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-family: 'Poppins', sans-serif;
        }

        .logout-button:hover {
          background: linear-gradient(135deg, #1c3b58, #3179b0);
          box-shadow: 0 6px 12px rgba(50, 120, 200, 0.7);
        }

        .logout-button:focus {
          outline: 3px solid #a0e9fd;
          outline-offset: 3px;
        }

        .logout-icon {
          width: 20px;
          height: 20px;
          fill: white;
          filter: drop-shadow(0 0 2px rgba(160, 233, 253, 0.7));
          transition: filter 0.3s ease;
          flex-shrink: 0;
        }

        .logout-button:hover .logout-icon {
          filter: drop-shadow(0 0 5px rgba(160, 233, 253, 1));
        }
      `}</style>

      <button className="logout-button" onClick={logout} aria-label="Logout">
        <svg
          className="logout-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a0e9fd" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1c3b58" stopOpacity="0.9" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB" >
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#a0e9fd" floodOpacity="0.7"/>
            </filter>
          </defs>
          <rect
            x="6"
            y="10"
            width="12"
            height="8"
            rx="2"
            ry="2"
            fill="url(#glassGradient)"
            filter="url(#glow)"
            stroke="white"
            strokeWidth="1"
          />
          <path
            d="M9 10V7a3 3 0 1 1 6 0v3"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="18" cy="14" r="1" fill="white"/>
        </svg>
        Logout
      </button>
    </>
  );
}
