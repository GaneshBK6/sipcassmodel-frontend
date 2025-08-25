// LoginPage.jsx
import React, { useState, useContext } from 'react';
import UserContext from '../context/UserContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function LoginPage() {
  const { login } = useContext(UserContext);
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee_id: employeeId, password }),
      });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      if (!data.user || !data.access || !data.refresh) {
        throw new Error('Invalid login response');
      }
      // You can add checks here to validate presence of expected user fields
      login(data.user, data.access, data.refresh);
    } catch {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .login-background {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          width: 100vw;
          background: linear-gradient(-45deg, #0f2027, #203a43, #2c5364, #0f2027);
          background-size: 600% 600%;
          animation: gradientBG 20s ease infinite;
          font-family: 'Poppins', sans-serif;
        }

        .login-card {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
          padding: 40px 48px;
          width: 360px;
          color: white;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .login-card h2 {
          font-weight: 600;
          font-size: 2.2rem;
          letter-spacing: 0.1em;
          text-align: center;
          margin-bottom: 0;
          user-select: none;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .input-group {
          position: relative;
        }

        input {
          font-size: 1rem;
          padding: 16px 12px 16px 12px;
          width: 100%;
          border-radius: 12px;
          border: none;
          background: rgba(255, 255, 255, 0.15);
          color: white;
          outline: none;
          transition: background-color 0.3s ease;
        }

        input:focus {
          background: rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 8px 2px rgba(255, 255, 255, 0.4);
        }

        label {
          position: absolute;
          top: 50%;
          left: 12px;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.7);
          pointer-events: none;
          font-weight: 500;
          transition: all 0.25s ease;
          font-size: 1rem;
          user-select: none;
          background: transparent;
          padding: 0 4px;
        }

        input:focus + label,
        input:not(:placeholder-shown) + label {
          top: -8px;
          font-size: 0.75rem;
          color: #a0e9fd;
          background: rgba(15, 32, 39, 0.8);
          border-radius: 4px;
          font-weight: 600;
        }

        .password-toggle {
          position: absolute;
          top: 50%;
          right: 12px;
          transform: translateY(-50%);
          cursor: pointer;
          color: rgba(255, 255, 255, 0.6);
          user-select: none;
          transition: color 0.3s ease;
          font-size: 1.2rem;
        }

        .password-toggle:hover {
          color: #a0e9fd;
        }

        .error-message {
          color: #ff6b6b;
          font-weight: 600;
          text-align: center;
          animation: fadeIn 0.3s ease forwards;
        }

        .submit-button {
          background: linear-gradient(135deg, #0f2027, #203a43);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          padding: 16px 0;
          cursor: pointer;
          transition: background 0.5s ease, box-shadow 0.3s ease;
          user-select: none;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
        }

        .submit-button:disabled {
          background: rgba(15, 32, 39, 0.5);
          cursor: not-allowed;
          box-shadow: none;
        }

        .submit-button:hover:enabled {
          background: linear-gradient(135deg, #1c3b58, #3179b0);
          box-shadow: 0 6px 12px rgba(50, 120, 200, 0.7);
        }

        .spinner {
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid #a0e9fd;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 0.8s linear infinite;
          box-sizing: border-box;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>

      <div className="login-background" role="main" aria-label="Login form">
        <div className="login-card">
          <h2>SIPCASS</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <input
                id="employeeId"
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder=" "
                required
                aria-required="true"
                aria-describedby="employeeIdLabel"
                autoComplete="username"
              />
              <label htmlFor="employeeId" id="employeeIdLabel">
                Employee ID
              </label>
            </div>

            <div className="input-group" style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                required
                aria-required="true"
                aria-describedby="passwordLabel"
                autoComplete="current-password"
              />
              <label htmlFor="password" id="passwordLabel">
                Password
              </label>
              <span
                role="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={0}
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowPassword(!showPassword); }}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>

            {error && <div className="error-message" role="alert">{error}</div>}

            <button className="submit-button" type="submit" disabled={loading} aria-busy={loading}>
              {loading ? <div className="spinner" aria-hidden="true" /> : 'Log In'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
