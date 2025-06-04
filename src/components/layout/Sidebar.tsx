import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Music, ListMusic, User } from 'lucide-react';

const navItems = [
  { path: '/', icon: <Home />, label: 'Dashboard' },
  { path: '/tracks', icon: <Music />, label: 'Tracks' },
  { path: '/sets', icon: <ListMusic />, label: 'Sets' },
  { path: '/profile', icon: <User />, label: 'Profile' },
];

const Sidebar: React.FC = () => {
  return (
    <>
      {/* Sidebar lateral para md+ */}
      <aside className="hidden md:flex flex-col h-full bg-dark-900 border-r border-dark-700 w-64 transition-all duration-300">
        <nav className="flex-1 mt-8">
          <ul className="space-y-2 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center py-3 px-4 rounded-md transition-colors space-x-3 ${isActive
                      ? 'bg-primary-900/30 text-primary-400'
                      : 'text-dark-300 hover:bg-dark-800 hover:text-white'
                    }`
                  }
                >
                  <span className="h-5 w-5">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Barra inferior para mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden justify-around bg-dark-900 border-t border-dark-700 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center px-2 py-1 rounded-md transition-colors ${isActive
                ? 'text-primary-400'
                : 'text-dark-300 hover:text-white'
              }`
            }
          >
            <span className="h-6 w-6">{item.icon}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;