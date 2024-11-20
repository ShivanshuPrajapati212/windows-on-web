import React, { useState, useRef, useEffect } from 'react';
import { FiMinus, FiMaximize2, FiX } from 'react-icons/fi';
import { FaChevronLeft, FaChevronRight, FaLock } from 'react-icons/fa';
import { IoReloadSharp } from 'react-icons/io5';
import chrome from '../images/chrome.png';
import { RxCross2 } from 'react-icons/rx';
import { TbMinus, TbSquare } from 'react-icons/tb';

const ChromeWindow = ({ onClose, isMaximized, onMaximize, onMinimize }) => {
  const [position, setPosition] = useState({ x: 50, y: 25 });
  const [size, setSize] = useState({ 
    width: window.innerWidth > 768 ? 800 : window.innerWidth - 20, 
    height: window.innerHeight > 600 ? 600 : window.innerHeight - 100 
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [url, setUrl] = useState('https://www.google.com');
  const windowRef = useRef(null);

  // Touch event handlers
  const handleTouchStart = (e, type) => {
    if (e.target.closest('.window-controls') || e.target.closest('.browser-controls')) return;
    
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
      
      // Constrain to viewport
      const maxX = window.innerWidth - size.width;
      const maxY = window.innerHeight - size.height;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
    
    if (isResizing) {
      handleResize(touch.clientX, touch.clientY);
    }
  };

  const handleResize = (clientX, clientY) => {
    switch (resizeType) {
      case 'se': // southeast
        setSize({
          width: Math.max(400, dragOffset.width + (clientX - dragOffset.x)),
          height: Math.max(300, dragOffset.height + (clientY - dragOffset.y))
        });
        break;
      case 'sw': // southwest
        const newWidthSW = Math.max(400, dragOffset.width - (clientX - dragOffset.x));
        setSize(prev => ({
          width: newWidthSW,
          height: Math.max(300, dragOffset.height + (clientY - dragOffset.y))
        }));
        setPosition(prev => ({
          x: dragOffset.left + dragOffset.width - newWidthSW,
          y: prev.y
        }));
        break;
      case 'ne': // northeast
        const newHeightNE = Math.max(300, dragOffset.height - (clientY - dragOffset.y));
        setSize({
          width: Math.max(400, dragOffset.width + (clientX - dragOffset.x)),
          height: newHeightNE
        });
        setPosition(prev => ({
          x: prev.x,
          y: dragOffset.top + dragOffset.height - newHeightNE
        }));
        break;
      case 'nw': // northwest
        const newWidthNW = Math.max(400, dragOffset.width - (clientX - dragOffset.x));
        const newHeightNW = Math.max(300, dragOffset.height - (clientY - dragOffset.y));
        setSize({
          width: newWidthNW,
          height: newHeightNW
        });
        setPosition({
          x: dragOffset.left + dragOffset.width - newWidthNW,
          y: dragOffset.top + dragOffset.height - newHeightNW
        });
        break;
      case 'n': // north
        const newHeightN = Math.max(300, dragOffset.height - (clientY - dragOffset.y));
        setSize(prev => ({
          ...prev,
          height: newHeightN
        }));
        setPosition(prev => ({
          ...prev,
          y: dragOffset.top + dragOffset.height - newHeightN
        }));
        break;
      case 's': // south
        setSize(prev => ({
          ...prev,
          height: Math.max(300, dragOffset.height + (clientY - dragOffset.y))
        }));
        break;
      case 'e': // east
        setSize(prev => ({
          ...prev,
          width: Math.max(400, dragOffset.width + (clientX - dragOffset.x))
        }));
        break;
      case 'w': // west
        const newWidth = Math.max(400, dragOffset.width - (clientX - dragOffset.x));
        setSize(prev => ({
          ...prev,
          width: newWidth
        }));
        setPosition(prev => ({
          ...prev,
          x: dragOffset.left + dragOffset.width - newWidth
        }));
        break;
      default:
        break;
    }
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls') || e.target.closest('.browser-controls')) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

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

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
    
    if (isResizing) {
      e.preventDefault();
      
      switch (resizeType) {
        case 'se': // southeast
          setSize({
            width: Math.max(400, dragOffset.width + (e.clientX - dragOffset.x)),
            height: Math.max(300, dragOffset.height + (e.clientY - dragOffset.y))
          });
          break;
        case 'sw': // southwest
          const newWidthSW = Math.max(400, dragOffset.width - (e.clientX - dragOffset.x));
          setSize(prev => ({
            width: newWidthSW,
            height: Math.max(300, dragOffset.height + (e.clientY - dragOffset.y))
          }));
          setPosition(prev => ({
            x: dragOffset.left + dragOffset.width - newWidthSW,
            y: prev.y
          }));
          break;
        case 'ne': // northeast
          const newHeightNE = Math.max(300, dragOffset.height - (e.clientY - dragOffset.y));
          setSize({
            width: Math.max(400, dragOffset.width + (e.clientX - dragOffset.x)),
            height: newHeightNE
          });
          setPosition(prev => ({
            x: prev.x,
            y: dragOffset.top + dragOffset.height - newHeightNE
          }));
          break;
        case 'nw': // northwest
          const newWidthNW = Math.max(400, dragOffset.width - (e.clientX - dragOffset.x));
          const newHeightNW = Math.max(300, dragOffset.height - (e.clientY - dragOffset.y));
          setSize({
            width: newWidthNW,
            height: newHeightNW
          });
          setPosition({
            x: dragOffset.left + dragOffset.width - newWidthNW,
            y: dragOffset.top + dragOffset.height - newHeightNW
          });
          break;
        case 'n': // north
          const newHeightN = Math.max(300, dragOffset.height - (e.clientY - dragOffset.y));
          setSize(prev => ({
            ...prev,
            height: newHeightN
          }));
          setPosition(prev => ({
            ...prev,
            y: dragOffset.top + dragOffset.height - newHeightN
          }));
          break;
        case 's': // south
          setSize(prev => ({
            ...prev,
            height: Math.max(300, dragOffset.height + (e.clientY - dragOffset.y))
          }));
          break;
        case 'e': // east
          setSize(prev => ({
            ...prev,
            width: Math.max(400, dragOffset.width + (e.clientX - dragOffset.x))
          }));
          break;
        case 'w': // west
          const newWidth = Math.max(400, dragOffset.width - (e.clientX - dragOffset.x));
          setSize(prev => ({
            ...prev,
            width: newWidth
          }));
          setPosition(prev => ({
            ...prev,
            x: dragOffset.left + dragOffset.width - newWidth
          }));
          break;
        default:
          break;
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeType(null);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    const newUrl = e.target.url.value;
    if (newUrl && !newUrl.startsWith('http')) {
      setUrl(`https://${newUrl}`);
    } else {
      setUrl(newUrl);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSize({
          width: window.innerWidth - 20,
          height: window.innerHeight - 100
        });
        setPosition({ x: 10, y: 25 });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.body.style.userSelect = 'none';
      document.body.style.cursor = isResizing ? 
        (resizeType === 'se' ? 'se-resize' : 
         resizeType === 's' ? 's-resize' : 
         'e-resize') : 
        'move';
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }
  }, [isDragging, isResizing, resizeType]);

  return (
    <div
      ref={windowRef}
      className={`fixed bg-gray-900 rounded-lg shadow-xl overflow-hidden ${
        isMaximized ? 'w-screen h-[calc(100vh-48px)] top-0 left-0' : ''
      } z-50 max-w-full max-h-full`}
      style={!isMaximized ? {
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        userSelect: isDragging || isResizing ? 'none' : 'auto'
      } : {}}
      onTouchStart={(e) => !e.target.closest('.window-controls') && handleTouchStart(e)}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => {
        setIsDragging(false);
        setIsResizing(false);
        setResizeType(null);
      }}
    >
      {/* Title Bar */}
      <div
        className="h-10 bg-gray-800 flex items-center justify-between select-none cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center px-4">
          <img src={chrome} alt="Chrome" className="w-4 h-4 mr-2" />
          <span className="text-sm text-gray-200">Google Chrome</span>
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

      {/* Browser Controls */}
      <div className="browser-controls h-12 border-b border-gray-700 flex items-center px-4 space-x-4 bg-gray-800">
        <div className="flex space-x-2">
          <button className="p-2 hover:bg-gray-700 rounded-full text-gray-400">
            <FaChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-full text-gray-400">
            <FaChevronRight className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-full text-gray-400">
            <IoReloadSharp className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleUrlSubmit} className="flex-1">
          <div className="flex items-center bg-gray-700 rounded-full px-4 py-1.5">
            <FaLock className="w-3 h-3 text-gray-400 mr-2" />
            <input
              type="text"
              name="url"
              defaultValue={url}
              className="bg-transparent w-full text-sm focus:outline-none text-gray-200 placeholder-gray-400"
            />
          </div>
        </form>
      </div>

      {/* Browser Content */}
      <div className="w-full h-[calc(100%-5.5rem)] bg-gray-900 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <img src={chrome} alt="Chrome" className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Due to security restrictions, we cannot embed Google in an iframe.</p>
          <p>In a real browser, this would load: {url}</p>
        </div>
      </div>

      {/* Resize Handles - Show on both desktop and mobile */}
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

export default ChromeWindow; 