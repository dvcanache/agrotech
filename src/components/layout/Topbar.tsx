import React, { useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';

export const Topbar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    isProfileOpen,
    setIsProfileOpen,
    toggleProfile,
    config
  } = useApp();

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsProfileOpen]);

  return (
    <header className="topbar">
      {/* Left Logo & Herd Name */}
      <div className="topbar-left">
        <Link to="/dashboard" className="logo-container" style={{ textDecoration: 'none', color: 'inherit' }}>
          {/* Customized Cow Head Logo */}
          <svg viewBox="0 0 100 100" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 30C20 18 32 10 50 18C68 10 80 18 80 30C80 42 75 52 70 58C65 62 60 78 50 78C40 78 35 62 30 58C25 52 20 42 20 30Z"
              stroke="#52b788"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 35C15 35 12 40 15 45C18 50 24 45 25 43"
              stroke="#52b788"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M78 35C85 35 88 40 85 45C82 50 76 45 75 43"
              stroke="#52b788"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M30 20C28 12 20 8 18 8"
              stroke="#52b788"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M70 20C72 12 80 8 82 8"
              stroke="#52b788"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="40" cy="64" r="3" fill="#2d6a4f" />
            <circle cx="60" cy="64" r="3" fill="#2d6a4f" />
          </svg>
          <span className="logo-text">AgroTech</span>
        </Link>
        <div className="topbar-divider"></div>
        <span className="scope-text">{config.nombre || 'Rebaño de Prueba'}</span>
      </div>

      {/* Center Search Bar */}
      <div className="topbar-center">
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar animales..."
          />
          <Search className="search-icon" size={18} strokeWidth={2} />
        </div>
      </div>

      {/* Right Profile Avatar and Dropdown */}
      <div className="topbar-right" ref={dropdownRef}>
        <div
          className={`profile-container ${isProfileOpen ? 'active' : ''}`}
          id="profile-container"
          onClick={toggleProfile}
        >
          <img
            className="avatar"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
            alt="Usuario"
          />
          <ChevronDown className="chevron-icon" size={16} strokeWidth={2} />
        </div>

        {/* Dropdown Menu */}
        {isProfileOpen && (
          <div className="profile-dropdown">
            <Link to="/ajustes" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
              Mi Perfil
            </Link>
            <Link to="/ajustes" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
              Configuración
            </Link>
            <div style={{ borderTop: '1px solid var(--border-gray)', margin: '4px 0' }}></div>
            <button
              type="button"
              className="dropdown-item"
              style={{ color: '#ef4444', width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => {
                alert('Sesión cerrada.');
                setIsProfileOpen(false);
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
