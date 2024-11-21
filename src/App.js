import './App.css';
import { useState, useEffect, useRef } from 'react';
import StartMenu from './components/StartMenu';
import TaskBar from './components/TaskBar';
import AccessibilityMenu from './components/AccessibilityMenu';
import DesktopIcon from './components/DesktopIcon';
import file_explorer from './images/file_explorer.png';
import chrome from './images/chrome.png';
import vscode from './images/vs_code.png';
import msstore from './images/msstore.png';
import ContextMenu from './components/ContextMenu';
import ChromeWindow from './components/ChromeWindow';
import FileExplorerWindow from './components/FileExplorerWindow';
import VSCodeWindow from './components/VSCodeWindow';
import StoreWindow from './components/StoreWindow';

function App() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isAccessibilityMenuOpen, setIsAccessibilityMenuOpen] = useState(false);
  const [iconPositions, setIconPositions] = useState([
    { x: 0, y: 0 },
    { x: 0, y: 100 },
    { x: 0, y: 200 },
    { x: 0, y: 300 },
  ]);
  const [selectionBox, setSelectionBox] = useState(null);
  const [selectedIcons, setSelectedIcons] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const startPointRef = useRef({ x: 0, y: 0 });
  const desktopRef = useRef(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [isChromeOpen, setIsChromeOpen] = useState(false);
  const [isChromeMaximized, setIsChromeMaximized] = useState(false);
  const [isFileExplorerOpen, setIsFileExplorerOpen] = useState(false);
  const [isFileExplorerMaximized, setIsFileExplorerMaximized] = useState(false);
  const [isVSCodeOpen, setIsVSCodeOpen] = useState(false);
  const [isVSCodeMaximized, setIsVSCodeMaximized] = useState(false);
  const [activeWindows, setActiveWindows] = useState([]);
  const [focusedWindow, setFocusedWindow] = useState(null);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isStoreMaximized, setIsStoreMaximized] = useState(false);

  const handleMouseDown = (e) => {
    // Only start selection if clicking on the desktop background
    if (e.target === desktopRef.current) {
      setIsDragging(true);
      const rect = desktopRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      startPointRef.current = { x, y };
      setSelectionBox({ x, y, width: 0, height: 0 });
      setSelectedIcons([]);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const rect = desktopRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const width = currentX - startPointRef.current.x;
    const height = currentY - startPointRef.current.y;

    const selectionRect = {
      x: width > 0 ? startPointRef.current.x : currentX,
      y: height > 0 ? startPointRef.current.y : currentY,
      width: Math.abs(width),
      height: Math.abs(height)
    };

    setSelectionBox(selectionRect);

    // Check which icons are within the selection box
    const selectedIndices = iconPositions.reduce((acc, pos, index) => {
      if (isIconInSelectionBox(pos, selectionRect)) {
        acc.push(index);
      }
      return acc;
    }, []);

    setSelectedIcons(selectedIndices);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setSelectionBox(null);
  };

  const isIconInSelectionBox = (iconPos, selection) => {
    const iconSize = window.innerWidth <= 768 ? 100 : 100; // Match your GRID_SIZE
    return (
      iconPos.x < selection.x + selection.width &&
      iconPos.x + iconSize > selection.x &&
      iconPos.y < selection.y + selection.height &&
      iconPos.y + iconSize > selection.y
    );
  };

  const toggleStartMenu = () => {
    setIsStartMenuOpen(!isStartMenuOpen);
  };

  const toggleAccessibilityMenu = () => {
    setIsAccessibilityMenuOpen(!isAccessibilityMenuOpen);
  };

  const isPositionOccupied = (position, currentIndex) => {
    return iconPositions.some((pos, idx) => 
      idx !== currentIndex && 
      pos.x === position.x && 
      pos.y === position.y
    );
  };

  const handleIconPositionChange = (index, newPosition) => {
    if (isPositionOccupied(newPosition, index)) {
      return;
    }
    
    const newPositions = [...iconPositions];
    newPositions[index] = newPosition;
    setIconPositions(newPositions);
  };

  const handleChromeClick = () => {
    console.log('Chrome clicked');
    setIsChromeOpen(true);
    setActiveWindows(prev => [...new Set([...prev, 'chrome'])]);
    setFocusedWindow('chrome');
  };

  const handleFileExplorerClick = () => {
    setIsFileExplorerOpen(true);
    setActiveWindows(prev => [...new Set([...prev, 'explorer'])]);
    setFocusedWindow('explorer');
  };

  const handleVSCodeClick = () => {
    setIsVSCodeOpen(true);
    setActiveWindows(prev => [...new Set([...prev, 'vscode'])]);
    setFocusedWindow('vscode');
  };

  const handleStoreClick = () => {
    setIsStoreOpen(true);
    setActiveWindows(prev => [...new Set([...prev, 'store'])]);
    setFocusedWindow('store');
  };

  const desktopIcons = [
    { icon: file_explorer, label: 'File Explorer', onClick: handleFileExplorerClick },
    { icon: chrome, label: 'Chrome', onClick: handleChromeClick },
    { icon: vscode, label: 'VS Code', onClick: handleVSCodeClick },
    { icon: msstore, label: 'Store', onClick: handleStoreClick },
  ];

  // Touch selection handlers
  const handleTouchStart = (e) => {
    if (e.target === desktopRef.current) {
      setIsDragging(true);
      const touch = e.touches[0];
      const rect = desktopRef.current.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      startPointRef.current = { x, y };
      setSelectionBox({ x, y, width: 0, height: 0 });
      setSelectedIcons([]);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent scrolling while selecting

    const touch = e.touches[0];
    const rect = desktopRef.current.getBoundingClientRect();
    const currentX = touch.clientX - rect.left;
    const currentY = touch.clientY - rect.top;

    const width = currentX - startPointRef.current.x;
    const height = currentY - startPointRef.current.y;

    const selectionRect = {
      x: width > 0 ? startPointRef.current.x : currentX,
      y: height > 0 ? startPointRef.current.y : currentY,
      width: Math.abs(width),
      height: Math.abs(height)
    };

    setSelectionBox(selectionRect);

    // Check which icons are within the selection box
    const selectedIndices = iconPositions.reduce((acc, pos, index) => {
      if (isIconInSelectionBox(pos, selectionRect)) {
        acc.push(index);
      }
      return acc;
    }, []);

    setSelectedIcons(selectedIndices);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setSelectionBox(null);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const rect = desktopRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setContextMenu({
      x,
      y,
      isDesktop: e.target === desktopRef.current
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleChromeClose = () => {
    setIsChromeOpen(false);
    setActiveWindows(prev => prev.filter(w => w !== 'chrome'));
  };

  const handleFileExplorerClose = () => {
    setIsFileExplorerOpen(false);
    setActiveWindows(prev => prev.filter(w => w !== 'explorer'));
  };

  const handleVSCodeClose = () => {
    setIsVSCodeOpen(false);
    setActiveWindows(prev => prev.filter(w => w !== 'vscode'));
  };

  const handleStoreClose = () => {
    setIsStoreOpen(false);
    setActiveWindows(prev => prev.filter(w => w !== 'store'));
  };

  return (
    <div className="text-white h-screen bg-center bg-bgi bg-cover relative">
      <div 
        ref={desktopRef}
        className="absolute inset-0 overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onContextMenu={handleContextMenu}
      >
        {desktopIcons.map((icon, index) => (
          <DesktopIcon
            key={index}
            icon={icon.icon}
            label={icon.label}
            position={iconPositions[index]}
            index={index}
            onPositionChange={handleIconPositionChange}
            isPositionOccupied={isPositionOccupied}
            isSelected={selectedIcons.includes(index)}
            onClick={icon.onClick}
            onContextMenu={({ x, y, isDesktop }) => {
              setContextMenu({
                x: x - desktopRef.current.getBoundingClientRect().left,
                y: y - desktopRef.current.getBoundingClientRect().top,
                isDesktop
              });
            }}
          />
        ))}
        {selectionBox && (
          <div
            className="absolute border border-blue-500 bg-blue-500/20"
            style={{
              left: `${selectionBox.x}px`,
              top: `${selectionBox.y}px`,
              width: `${selectionBox.width}px`,
              height: `${selectionBox.height}px`,
              pointerEvents: 'none'
            }}
          />
        )}
        
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={handleCloseContextMenu}
            isDesktop={contextMenu.isDesktop}
          />
        )}
      </div>
      
      {isChromeOpen && (
        <ChromeWindow
          onClose={handleChromeClose}
          isMaximized={isChromeMaximized}
          onMaximize={() => setIsChromeMaximized(!isChromeMaximized)}
          onMinimize={() => setIsChromeOpen(false)}
        />
      )}
      
      <TaskBar 
        onStartClick={toggleStartMenu} 
        onAccessibilityClick={toggleAccessibilityMenu}
        activeWindows={activeWindows}
        focusedWindow={focusedWindow}
        onWindowClick={(window) => {
          switch(window) {
            case 'chrome':
              setIsChromeOpen(true);
              setFocusedWindow('chrome');
              break;
            case 'explorer':
              setIsFileExplorerOpen(true);
              setFocusedWindow('explorer');
              break;
            case 'vscode':
              setIsVSCodeOpen(true);
              setFocusedWindow('vscode');
              break;
            case 'store':
              setIsStoreOpen(true);
              setFocusedWindow('store');
              break;
          }
        }}
      />
      
      <div 
        className={`justify-center bottom-14 absolute items-center flex w-screen start-menu-transition z-[60]
          ${isStartMenuOpen 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        <StartMenu 
          onAppClick={(appId) => {
            switch(appId) {
              case 'chrome':
                handleChromeClick();
                break;
              case 'explorer':
                handleFileExplorerClick();
                break;
              case 'vscode':
                handleVSCodeClick();
                break;
              case 'store':
                handleStoreClick();
                break;
            }
            setIsStartMenuOpen(false);
          }} 
        />
      </div>
      
      <div 
        className={`justify-end bottom-14 pr-4 absolute items-center flex w-screen start-menu-transition
          ${isAccessibilityMenuOpen 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        <AccessibilityMenu />
      </div>
      
      {isFileExplorerOpen && (
        <FileExplorerWindow
          onClose={handleFileExplorerClose}
          isMaximized={isFileExplorerMaximized}
          onMaximize={() => setIsFileExplorerMaximized(!isFileExplorerMaximized)}
          onMinimize={() => setIsFileExplorerOpen(false)}
        />
      )}
      
      {isVSCodeOpen && (
        <VSCodeWindow
          onClose={handleVSCodeClose}
          isMaximized={isVSCodeMaximized}
          onMaximize={() => setIsVSCodeMaximized(!isVSCodeMaximized)}
          onMinimize={() => setIsVSCodeOpen(false)}
        />
      )}
      
      {isStoreOpen && (
        <StoreWindow
          onClose={handleStoreClose}
          isMaximized={isStoreMaximized}
          onMaximize={() => setIsStoreMaximized(!isStoreMaximized)}
          onMinimize={() => setIsStoreOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
