import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, Map, Tag, Trees, Calendar, Tractor, BarChart3, SlidersHorizontal } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/mapas', label: 'Mapas GIS', icon: Map },
  { to: '/animales', label: 'Animales', icon: Tag },
  { to: '/potreros', label: 'Potreros', icon: Trees },
  { to: '/eventos', label: 'Centro de Eventos', icon: Calendar },
  { to: '/equipment', label: 'Maquinaria & Equipos', icon: Tractor },
  { to: '/reportes', label: 'Centro de Reportes', icon: BarChart3 },
  { to: '/ajustes', label: 'Configuración', icon: SlidersHorizontal }
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              data-tooltip={item.label}
            >
              <Icon size={24} strokeWidth={1.8} />
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};
