import { useState, useRef, useEffect } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { TbMinus, TbSquare } from 'react-icons/tb';

const TextViewer = ({ onClose, isMaximized, onMaximize, onMinimize, file }) => {
  const [position, setPosition] = useState({ x: window.innerWidth/4, y: window.innerHeight/4 });
  const [size, setSize] = useState({ 
    width: window.innerWidth > 768 ? 500 : 300,
    height: window.innerWidth > 768 ? 400 : 250
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls')) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
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
      case 'ne': // northeast
        const newHeightNE = Math.max(minHeight, dragOffset.height - (clientY - dragOffset.y));
        setSize({
          width: Math.min(maxWidth, Math.max(minWidth, dragOffset.width + (clientX - dragOffset.x))),
          height: newHeightNE
        });
        setPosition(prev => ({
          x: prev.x,
          y: dragOffset.top + dragOffset.height - newHeightNE
        }));
        break;
      case 'nw': // northwest
        const newWidthNW = Math.max(minWidth, dragOffset.width - (clientX - dragOffset.x));
        const newHeightNW = Math.max(minHeight, dragOffset.height - (clientY - dragOffset.y));
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
        const newHeightN = Math.max(minHeight, dragOffset.height - (clientY - dragOffset.y));
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
          height: Math.max(minHeight, dragOffset.height + (clientY - dragOffset.y))
        }));
        break;
      case 'e': // east
        setSize(prev => ({
          ...prev,
          width: Math.min(maxWidth, Math.max(minWidth, dragOffset.width + (clientX - dragOffset.x)))
        }));
        break;
      case 'w': // west
        const newWidth = Math.max(minWidth, dragOffset.width - (clientX - dragOffset.x));
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

  return (
    <div
      ref={windowRef}
      className={`fixed bg-gray-900 rounded-lg shadow-xl overflow-hidden ${
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
      <div 
        className="h-10 bg-gray-800 flex items-center justify-between select-none cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center px-4">
          <span className="text-sm text-gray-200">{file.name}</span>
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

      <div className="p-4 h-[calc(100%-2.5rem)] overflow-y-auto">
        <pre className="text-gray-300 font-mono whitespace-pre-wrap">
          {file.content}
        </pre>
      </div>

      {/* Resize handles */}
      {!isMaximized && (
        <>
          {/* Corners */}
          <div className="absolute top-0 left-0 w-6 h-6 cursor-nw-resize hover:bg-blue-500/20"
               onMouseDown={(e) => {
                 e.preventDefault();
                 setIsResizing(true);
                 setResizeType('nw');
                 setDragOffset({
                   x: e.clientX,
                   y: e.clientY,
                   width: size.width,
                   height: size.height,
                   left: position.x,
                   top: position.y
                 });
               }}
               onTouchStart={(e) => handleTouchStart(e, 'nw')} />
          <div className="absolute top-0 right-0 w-6 h-6 cursor-ne-resize hover:bg-blue-500/20"
               onMouseDown={(e) => {
                 e.preventDefault();
                 setIsResizing(true);
                 setResizeType('ne');
                 setDragOffset({
                   x: e.clientX,
                   y: e.clientY,
                   width: size.width,
                   height: size.height,
                   left: position.x,
                   top: position.y
                 });
               }}
               onTouchStart={(e) => handleTouchStart(e, 'ne')} />
          <div className="absolute bottom-0 left-0 w-6 h-6 cursor-sw-resize hover:bg-blue-500/20"
               onMouseDown={(e) => {
                 e.preventDefault();
                 setIsResizing(true);
                 setResizeType('sw');
                 setDragOffset({
                   x: e.clientX,
                   y: e.clientY,
                   width: size.width,
                   height: size.height,
                   left: position.x,
                   top: position.y
                 });
               }}
               onTouchStart={(e) => handleTouchStart(e, 'sw')} />
          <div className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize hover:bg-blue-500/20"
               onMouseDown={(e) => {
                 e.preventDefault();
                 setIsResizing(true);
                 setResizeType('se');
                 setDragOffset({
                   x: e.clientX,
                   y: e.clientY,
                   width: size.width,
                   height: size.height,
                   left: position.x,
                   top: position.y
                 });
               }}
               onTouchStart={(e) => handleTouchStart(e, 'se')} />
          
          {/* Edges */}
          <div className="absolute top-0 left-6 right-6 h-2 cursor-n-resize hover:bg-blue-500/20"
               onMouseDown={(e) => {
                 e.preventDefault();
                 setIsResizing(true);
                 setResizeType('n');
                 setDragOffset({
                   x: e.clientX,
                   y: e.clientY,
                   width: size.width,
                   height: size.height,
                   left: position.x,
                   top: position.y
                 });
               }}
               onTouchStart={(e) => handleTouchStart(e, 'n')} />
          <div className="absolute bottom-0 left-6 right-6 h-2 cursor-s-resize hover:bg-blue-500/20"
               onMouseDown={(e) => {
                 e.preventDefault();
                 setIsResizing(true);
                 setResizeType('s');
                 setDragOffset({
                   x: e.clientX,
                   y: e.clientY,
                   width: size.width,
                   height: size.height,
                   left: position.x,
                   top: position.y
                 });
               }}
               onTouchStart={(e) => handleTouchStart(e, 's')} />
          <div className="absolute left-0 top-6 bottom-6 w-2 cursor-w-resize hover:bg-blue-500/20"
               onMouseDown={(e) => {
                 e.preventDefault();
                 setIsResizing(true);
                 setResizeType('w');
                 setDragOffset({
                   x: e.clientX,
                   y: e.clientY,
                   width: size.width,
                   height: size.height,
                   left: position.x,
                   top: position.y
                 });
               }}
               onTouchStart={(e) => handleTouchStart(e, 'w')} />
          <div className="absolute right-0 top-6 bottom-6 w-2 cursor-e-resize hover:bg-blue-500/20"
               onMouseDown={(e) => {
                 e.preventDefault();
                 setIsResizing(true);
                 setResizeType('e');
                 setDragOffset({
                   x: e.clientX,
                   y: e.clientY,
                   width: size.width,
                   height: size.height,
                   left: position.x,
                   top: position.y
                 });
               }}
               onTouchStart={(e) => handleTouchStart(e, 'e')} />
        </>
      )}
    </div>
  );
};

export default TextViewer; 