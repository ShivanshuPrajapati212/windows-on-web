import React, { useState, useRef, useEffect } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { TbMinus, TbSquare } from 'react-icons/tb';
import { 
  FaHome, 
  FaGamepad, 
  FaFilm, 
  FaSearch,
  FaWindows,
  FaCode,
  FaChrome,
  FaFolder,
  FaSpotify,
  FaWhatsapp,
  FaPlay,
  FaYoutube,
  FaPlaystation,
  FaXbox,
  FaDesktop,
  FaMusic
} from 'react-icons/fa';
import msstore from '../images/msstore.png';

const StoreWindow = ({ onClose, isMaximized, onMaximize, onMinimize }) => {
  const [position, setPosition] = useState({ x: 50, y: 25 });
  const [size, setSize] = useState({ 
    width: window.innerWidth > 768 ? 800 : window.innerWidth - 20, 
    height: window.innerHeight > 600 ? 600 : window.innerHeight - 100 
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('home');
  const windowRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls')) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
    
    if (isResizing) {
      handleResize(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeType(null);
  };

  const handleTouchStart = (e, type) => {
    if (e.target.closest('.window-controls')) return;
    
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    
    if (type) {
      setIsResizing(true);
      setResizeType(type);
      setDragOffset({
        x: touch.clientX,
        y: touch.clientY,
        width: size.width,
        height: size.height,
        left: position.x,
        top: position.y
      });
    } else {
      setIsDragging(true);
      setDragOffset({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    
    if (isDragging) {
      const newX = touch.clientX - dragOffset.x;
      const newY = touch.clientY - dragOffset.y;
      
      setPosition({
        x: Math.max(0, Math.min(newX, window.innerWidth - size.width)),
        y: Math.max(0, Math.min(newY, window.innerHeight - size.height))
      });
    }
    
    if (isResizing) {
      handleResize(touch.clientX, touch.clientY);
    }
  };

  const handleResize = (clientX, clientY) => {
    const isMobile = window.innerWidth <= 768;
    const minWidth = isMobile ? 300 : 400;
    const minHeight = isMobile ? 200 : 300;
    const maxWidth = window.innerWidth - 40;
    const maxHeight = window.innerHeight - 100;

    switch (resizeType) {
      case 'se': // southeast
        setSize({
          width: Math.min(maxWidth, Math.max(minWidth, dragOffset.width + (clientX - dragOffset.x))),
          height: Math.min(maxHeight, Math.max(minHeight, dragOffset.height + (clientY - dragOffset.y)))
        });
        break;
      case 'sw': // southwest
        const newWidthSW = Math.max(minWidth, dragOffset.width - (clientX - dragOffset.x));
        setSize(prev => ({
          width: newWidthSW,
          height: Math.max(minHeight, dragOffset.height + (clientY - dragOffset.y))
        }));
        setPosition(prev => ({
          x: dragOffset.left + dragOffset.width - newWidthSW,
          y: prev.y
        }));
        break;
      // ... add other cases from TextViewer component
    }
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing]);

  const featuredApps = [
    {
      name: "Windows 11 Clone",
      developer: "Shivanshu Prajapati",
      icon: <FaWindows className="w-full h-full" />,
      description: "A web-based Windows 11 clone built with React",
      rating: 4.8,
      category: "Productivity"
    },
    {
      name: "VS Code",
      developer: "Microsoft",
      icon: <FaCode className="w-full h-full" />,
      description: "Code editing. Redefined.",
      rating: 4.9,
      category: "Development"
    },
    {
      name: "Chrome",
      developer: "Google LLC",
      icon: <FaChrome className="w-full h-full" />,
      description: "Fast and secure web browser",
      rating: 4.7,
      category: "Web Browser"
    },
    {
      name: "Spotify",
      developer: "Spotify AB",
      icon: <FaSpotify className="w-full h-full" />,
      description: "Music streaming service",
      rating: 4.5,
      category: "Entertainment"
    }
  ];

  const gameApps = [
    {
      name: "Xbox Games",
      developer: "Microsoft",
      icon: <FaXbox className="w-full h-full" />,
      description: "Play Xbox games on PC",
      rating: 4.7,
      category: "Games"
    },
    {
      name: "PlayStation",
      developer: "Sony",
      icon: <FaPlaystation className="w-full h-full" />,
      description: "PlayStation games and apps",
      rating: 4.5,
      category: "Games"
    }
  ];

  const entertainmentApps = [
    {
      name: "YouTube",
      developer: "Google LLC",
      icon: <FaYoutube className="w-full h-full" />,
      description: "Stream videos and music",
      rating: 4.6,
      category: "Entertainment"
    },
    {
      name: "Movies & TV",
      developer: "Microsoft",
      icon: <FaFilm className="w-full h-full" />,
      description: "Watch your favorite content",
      rating: 4.5,
      category: "Entertainment"
    }
  ];

  const handleResizeMouseDown = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeType(type);
    setDragOffset({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      left: position.x,
      top: position.y
    });
  };

  return (
    <div
      ref={windowRef}
      className={`fixed bg-[#1f1f1f] rounded-lg shadow-xl overflow-hidden ${
        isMaximized ? 'w-screen h-[calc(100vh-48px)] top-0 left-0' : ''
      } z-50`}
      style={!isMaximized ? {
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      } : {}}
      onTouchStart={(e) => !e.target.closest('.window-controls') && handleTouchStart(e)}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Title Bar */}
      <div
        className="h-10 bg-[#1f1f1f] flex items-center justify-between select-none cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center px-4">
          <img src={msstore} alt="Store" className="w-4 h-4 mr-2" />
          <span className="text-sm text-gray-200">Microsoft Store</span>
        </div>
        <div className="window-controls flex h-10">
          <button
            onClick={onMinimize}
            className="w-12 h-full flex items-center justify-center hover:bg-gray-700 text-gray-300"
          >
            <TbMinus className="w-4 h-4" />
          </button>
          <button
            onClick={onMaximize}
            className="w-12 h-full flex items-center justify-center hover:bg-gray-700 text-gray-300"
          >
            <TbSquare className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="w-12 h-full flex items-center justify-center hover:bg-red-500 hover:text-white text-gray-300"
          >
            <RxCross2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex h-[calc(100%-2.5rem)]">
        {/* Sidebar */}
        <div className="w-16 bg-[#1f1f1f] flex flex-col items-center py-4 space-y-6">
          <button 
            className={`p-3 rounded-md ${activeTab === 'home' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}
            onClick={() => setActiveTab('home')}
          >
            <FaHome className="w-5 h-5" />
          </button>
          <button 
            className={`p-3 rounded-md ${activeTab === 'games' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}
            onClick={() => setActiveTab('games')}
          >
            <FaGamepad className="w-5 h-5" />
          </button>
          <button 
            className={`p-3 rounded-md ${activeTab === 'entertainment' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}
            onClick={() => setActiveTab('entertainment')}
          >
            <FaFilm className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-[#1f1f1f] overflow-y-auto">
          {/* Search Bar */}
          <div className="p-4 sticky top-0 bg-[#1f1f1f] z-10">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search apps, games, movies and more"
                className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Content based on active tab */}
          <div className="p-4">
            {activeTab === 'home' && (
              <>
                <h2 className="text-xl font-semibold text-white mb-4">Featured</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredApps.map((app, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors">
                      <div className="p-6 flex justify-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 text-blue-400">
                          {app.icon}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-semibold">{app.name}</h3>
                        <p className="text-gray-400 text-sm">{app.developer}</p>
                        <p className="text-gray-300 text-sm mt-2">{app.description}</p>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-gray-400">★ {app.rating}</span>
                          <span className="text-gray-400">{app.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'games' && (
              <>
                <h2 className="text-xl font-semibold text-white mb-4">Games</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gameApps.map((app, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors">
                      <div className="p-6 flex justify-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 text-blue-400">
                          {app.icon}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-semibold">{app.name}</h3>
                        <p className="text-gray-400 text-sm">{app.developer}</p>
                        <p className="text-gray-300 text-sm mt-2">{app.description}</p>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-gray-400">★ {app.rating}</span>
                          <span className="text-gray-400">{app.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'entertainment' && (
              <>
                <h2 className="text-xl font-semibold text-white mb-4">Entertainment</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {entertainmentApps.map((app, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors">
                      <div className="p-6 flex justify-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 text-blue-400">
                          {app.icon}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-semibold">{app.name}</h3>
                        <p className="text-gray-400 text-sm">{app.developer}</p>
                        <p className="text-gray-300 text-sm mt-2">{app.description}</p>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-gray-400">★ {app.rating}</span>
                          <span className="text-gray-400">{app.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Resize handles */}
      {!isMaximized && (
        <>
          {/* Corners */}
          <div className="absolute top-0 left-0 w-6 h-6 cursor-nw-resize hover:bg-blue-500/20"
               onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
               onTouchStart={(e) => handleTouchStart(e, 'nw')} />
          <div className="absolute top-0 right-0 w-6 h-6 cursor-ne-resize hover:bg-blue-500/20"
               onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
               onTouchStart={(e) => handleTouchStart(e, 'ne')} />
          <div className="absolute bottom-0 left-0 w-6 h-6 cursor-sw-resize hover:bg-blue-500/20"
               onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
               onTouchStart={(e) => handleTouchStart(e, 'sw')} />
          <div className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize hover:bg-blue-500/20"
               onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
               onTouchStart={(e) => handleTouchStart(e, 'se')} />
          
          {/* Edges */}
          <div className="absolute top-0 left-6 right-6 h-2 cursor-n-resize hover:bg-blue-500/20"
               onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
               onTouchStart={(e) => handleTouchStart(e, 'n')} />
          <div className="absolute bottom-0 left-6 right-6 h-2 cursor-s-resize hover:bg-blue-500/20"
               onMouseDown={(e) => handleResizeMouseDown(e, 's')}
               onTouchStart={(e) => handleTouchStart(e, 's')} />
          <div className="absolute left-0 top-6 bottom-6 w-2 cursor-w-resize hover:bg-blue-500/20"
               onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
               onTouchStart={(e) => handleTouchStart(e, 'w')} />
          <div className="absolute right-0 top-6 bottom-6 w-2 cursor-e-resize hover:bg-blue-500/20"
               onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
               onTouchStart={(e) => handleTouchStart(e, 'e')} />
        </>
      )}
    </div>
  );
};

export default StoreWindow; 