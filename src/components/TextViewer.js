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
      case 'se':
        setSize({
          width: Math.min(maxWidth, Math.max(minWidth, dragOffset.width + (clientX - dragOffset.x))),
          height: Math.min(maxHeight, Math.max(minHeight, dragOffset.height + (clientY - dragOffset.y)))
        });
        break;
      // Add other resize cases similar to FileExplorerWindow
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

      {/* Add resize handles */}
      {!isMaximized && (
        <>
          <div 
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize hover:bg-blue-500/20"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizing(true);
              setResizeType('se');
              setDragOffset({
                x: e.clientX,
                y: e.clientY,
                width: size.width,
                height: size.height
              });
            }}
          />
          {/* Add other resize handles as needed */}
        </>
      )}
    </div>
  );
};

export default TextViewer; 