import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, Tag, Calendar, BarChart3, SlidersHorizontal } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/animales', label: 'Animales', icon: Tag },
  { to: '/eventos', label: 'Centro de Eventos', icon: Calendar },
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
