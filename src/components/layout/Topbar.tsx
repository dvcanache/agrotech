import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Bluetooth, Wifi, WifiOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { HardwareSyncModal } from './HardwareSyncModal';
import { offlineSyncService } from '../../services/offlineSyncService';
import { AgroGanLogo } from '../common/AgroGanLogo';

export const Topbar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    isProfileOpen,
    setIsProfileOpen,
    toggleProfile,
    config
  } = useApp();

  const [isHardwareOpen, setIsHardwareOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(offlineSyncService.isOnline());
  const [pendingCount, setPendingCount] = useState(offlineSyncService.getPendientesCount());

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = offlineSyncService.subscribe((items, online) => {
      setIsOnline(online);
      setPendingCount(items.filter(i => i.estado === 'pendiente' || i.estado === 'error').length);
    });
    return unsub;
  }, []);

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
        <Link to="/dashboard" className="logo-container" style={{ textDecoration: 'none' }}>
          <AgroGanLogo size={36} />
          <span className="logo-text">AGROGAN</span>
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
      <div className="topbar-right" ref={dropdownRef} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Hardware & Offline Sync Pill Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsHardwareOpen(prev => !prev);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 20,
            background: isOnline ? '#e8f5e9' : '#fee2e2',
            border: `1px solid ${isOnline ? '#a7f3d0' : '#fca5a5'}`,
            color: isOnline ? '#166534' : '#991b1b',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title="Gestor de Hardware IoT (RFID/Básculas) y Cola Offline"
        >
          <Bluetooth size={14} color="#0284c7" />
          {isOnline ? <Wifi size={14} color="#16a34a" /> : <WifiOff size={14} color="#dc2626" />}
          <span>{isOnline ? 'Online' : 'Offline'}</span>
          {pendingCount > 0 && (
            <span style={{
              background: '#ea580c',
              color: '#fff',
              borderRadius: 10,
              padding: '1px 5px',
              fontSize: 10,
              fontWeight: 700
            }}>
              {pendingCount}
            </span>
          )}
        </button>

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

      {/* Hardware & Offline Sync Modal */}
      <HardwareSyncModal
        isOpen={isHardwareOpen}
        onClose={() => setIsHardwareOpen(false)}
      />
    </header>
  );
};
