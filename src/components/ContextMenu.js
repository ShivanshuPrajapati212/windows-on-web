import React from 'react';
import { FiRefreshCw, FiCopy, FiTrash2, FiEdit } from 'react-icons/fi';
import { BsGrid, BsSortDown, BsViewList } from 'react-icons/bs';
import { FaAngleRight } from "react-icons/fa";

const ContextMenu = ({ x, y, onClose, isDesktop }) => {
  const handleClick = (action) => {
    console.log('Action:', action);
    onClose();
  };

  const menuItems = isDesktop ? [
    { icon: <BsViewList />, label: 'View', hasSubmenu: true },
    { icon: <BsSortDown />, label: 'Sort by', hasSubmenu: true },
    { icon: <FiRefreshCw />, label: 'Refresh' },
    { type: 'separator' },
    { icon: <FiEdit />, label: 'New', hasSubmenu: true },
    { type: 'separator' },
    { icon: <FiCopy />, label: 'Paste' },
    { type: 'separator' },
    { icon: <BsGrid />, label: 'Display settings' },
    { icon: <FiEdit />, label: 'Personalize' },
  ] : [
    { icon: <FiEdit />, label: 'Open' },
    { icon: <FiCopy />, label: 'Copy' },
    { icon: <FiEdit />, label: 'Create shortcut' },
    { type: 'separator' },
    { icon: <FiTrash2 />, label: 'Delete' },
    { icon: <FiEdit />, label: 'Rename' },
    { type: 'separator' },
    { icon: <FiEdit />, label: 'Properties' },
  ];

  return (
    <>
      <div 
        className="fixed inset-0 z-50"
        onClick={onClose}
      />
      <div
        className="fixed z-50 w-64 start-menu backdrop-blur-xl shadow-lg rounded-md py-2"
        style={{
          left: `${x}px`,
          top: `${y}px`,
        }}
      >
        {menuItems.map((item, index) => (
          item.type === 'separator' ? (
            <div key={index} className="my-1 border-t border-gray-700" />
          ) : (
            <button
              key={index}
              className="w-full px-4 py-2 flex items-center text-sm text-white hover:bg-blue-500/80 focus:outline-none focus:bg-blue-600/80"
              onClick={() => handleClick(item.label)}
            >
              <span className="w-5 h-5 mr-3 flex items-center justify-center text-gray-400">
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.hasSubmenu && (
                <span className="ml-auto text-gray-400"><FaAngleRight /></span>
              )}
            </button>
          )
        ))}
      </div>
    </>
  );
};

export default ContextMenu; 