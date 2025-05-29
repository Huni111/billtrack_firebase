import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFileInvoiceDollar,
  FaCog,
  FaDatabase
} from 'react-icons/fa';
import './SideBar.css';

/**
 * Sidebar component that displays three icons with Romanian titles revealed on hover
 */
const SideBar = () => {
  const [hoveredItem, setHoveredItem] = useState(null);

  // Exactly three menu items as specified
  const menuItems = [
    {
      id: 'data',
      title: 'Date',
      icon: <FaDatabase size={24} />,
      path: '/'
    },
    {
      id: 'bills',
      title: 'Facturi',
      icon: <FaFileInvoiceDollar size={24} />,
      path: '/bills'
    },
    {
      id: 'settings',
      title: 'Setări',
      icon: <FaCog size={24} />,
      path: '/settings'
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-container">
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li 
                key={item.id}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className="sidebar-menu-item"
              >
                <Link to={item.path} className="sidebar-link">
                  <div className="sidebar-icon">
                    {item.icon}
                  </div>
                  <span 
                    className={`sidebar-title ${hoveredItem === item.id ? 'visible' : ''}`}
                  >
                    {item.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SideBar;
