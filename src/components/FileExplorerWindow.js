import React, { useState, useRef, useEffect } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { TbMinus, TbSquare } from 'react-icons/tb';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaChevronUp,
  FaSearch,
  FaList,
  FaSort,
  FaCut,
  FaCopy,
  FaPaste,
  FaTrash,
  FaRedo,
  FaStar,
  FaFolder,
  FaFolderOpen,
  FaDesktop,
  FaDownload,
  FaImage,
  FaFileAlt,
  FaHome
} from 'react-icons/fa';
import file_explorer from '../images/file_explorer.png';
import TextViewer from './TextViewer';
import chrome from '../images/chrome.png';
import me from '../images/me.png';
import windows11 from '../images/win11.png';
import portfolio from '../images/na.png';
import ImageViewer from './ImageViewer';

const DUMMY_FILE_SYSTEM = {
  'This PC': {
    type: 'root',
    children: {
      'About Me': {
        type: 'folder',
        icon: <FaFolder />,
        children: {
          'Profile.txt': {
            type: 'file',
            icon: <FaFileAlt />,
            content: `Name: Shivanshu Prajapati
Age: 14 years
Role: Full Stack Developer

I'm a developer who started coding at the age of 12. I love building web applications and exploring new technologies. My journey in programming began with HTML and CSS, and I've since expanded my skills to include modern frameworks and tools.

Current Focus:
- Building responsive web applications
- Learning system design
- Contributing to open source
- Exploring AI and Machine Learning

Hobbies:
- Coding personal projects
- Reading tech blogs
- Playing chess
- Learning new programming languages`
          },
          'Skills.txt': {
            type: 'file',
            icon: <FaFileAlt />,
            content: `Technical Skills:

Frontend:
- React.js
- HTML5, CSS3, JavaScript
- Tailwind CSS
- Redux & Context API

Backend:
- Node.js & Express
- MongoDB
- RESTful APIs

Tools & Others:
- Git & GitHub
- VS Code
- Responsive Design
- Web Security Basics
- Linux Command Line
- Docker Basics

Soft Skills:
- Problem Solving
- Quick Learning
- Team Collaboration
- Time Management
- Project Planning`
          },
          'me.jpg': {
            type: 'file',
            icon: <FaImage />,
            content: me,
            isImage: true
          }
        }
      },
      'Projects': {
        type: 'folder',
        icon: <FaFolder />,
        children: {
          'Windows 11 Clone': {
            type: 'folder',
            icon: <FaFolder />,
            children: {
              'description.txt': {
                type: 'file',
                icon: <FaFileAlt />,
                content: `Windows 11 Clone Project

A detailed recreation of the Windows 11 interface built with modern web technologies.

Features:
- Authentic Windows 11 look and feel
- Working start menu and taskbar
- File explorer with navigation
- Window management system
- Context menus
- Dark mode support
- Mobile responsive design

Technologies Used:
- React.js for UI components
- Tailwind CSS for styling
- Custom hooks for window management
- Context API for state management
- React Icons for Windows icons

Future Enhancements:
- More system apps
- Virtual desktop support
- Settings app
- Notifications center
- Widget support`
              },
              'screenshot.png': {
                type: 'file',
                icon: <FaImage />,
                content: windows11,
                isImage: true
              }
            }
          },
          'Portfolio Website': {
            type: 'folder',
            icon: <FaFolder />,
            children: {
              'details.txt': {
                type: 'file',
                icon: <FaFileAlt />,
                content: `Personal Portfolio Website

A modern, responsive portfolio website showcasing my projects and skills.

Features:
- Clean, minimal design
- Project showcase
- Skills section
- Contact form
- Blog section
- Dark/Light mode

Tech Stack:
- Next.js
- Tailwind CSS
- Framer Motion
- MDX for blog posts
- Vercel deployment`
              },
              'preview.png': {
                type: 'file',
                icon: <FaImage />,
                content: portfolio,
                isImage: true
              }
            }
          }
        }
      },
      'Contact': {
        type: 'folder',
        icon: <FaFolder />,
        children: {
          'contact.txt': {
            type: 'file',
            icon: <FaFileAlt />,
            content: `Get in touch:

Email: shivanshuprajapati212@gmail.com
GitHub: github.com/ShivanshuPrajapati212
LinkedIn: linkedin.com/in/shivanshu-prajapati

Available for:
- Freelance projects
- Open source collaboration
- Learning opportunities
- Tech discussions

Preferred contact method: Email
Response time: Within 24 hours`
          }
        }
      },
      'Education': {
        type: 'folder',
        icon: <FaFolder />,
        children: {
          'education.txt': {
            type: 'file',
            icon: <FaFileAlt />,
            content: `Educational Background:

Current:
- Class 8th Student
- Self-taught programmer
- Online course certifications

Learning Path:
- Started with basic web development
- Moved to React and modern frameworks
- Currently learning system design
- Exploring AI/ML concepts

Online Courses:
- Web Development BootCamp
- React Advanced Patterns
- Data Structures & Algorithms
- System Design Basics`
          }
        }
      }
    }
  }
};

const FileExplorerWindow = ({ onClose, isMaximized, onMaximize, onMinimize }) => {
  const [position, setPosition] = useState(() => {
    const isMobile = window.innerWidth <= 768;
    return {
      x: isMobile ? 0 : 100,
      y: isMobile ? 0 : 50
    };
  });

  const [size, setSize] = useState(() => {
    const isMobile = window.innerWidth <= 768;
    return {
      width: isMobile ? window.innerWidth : Math.min(900, window.innerWidth - 100),
      height: isMobile ? Math.min(600, window.innerHeight - 100) : Math.min(600, window.innerHeight - 100)
    };
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentPath, setCurrentPath] = useState(['This PC']);
  const [navigationHistory, setNavigationHistory] = useState([['This PC']]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const windowRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const isMobile = window.innerWidth <= 768;

  const getCurrentFolder = () => {
    let current = DUMMY_FILE_SYSTEM;
    for (const path of currentPath) {
      current = current[path]?.children;
    }
    return current || {};
  };

  const handleFolderClick = (folderName) => {
    const newPath = [...currentPath, folderName];
    setCurrentPath(newPath);
    // Add to history
    const newHistory = [...navigationHistory.slice(0, historyIndex + 1), newPath];
    setNavigationHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleNavigateBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(navigationHistory[historyIndex - 1]);
    }
  };

  const handleNavigateForward = () => {
    if (historyIndex < navigationHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(navigationHistory[historyIndex + 1]);
    }
  };

  const handleNavigateUp = () => {
    if (currentPath.length > 1) {
      const newPath = currentPath.slice(0, -1);
      setCurrentPath(newPath);
      const newHistory = [...navigationHistory.slice(0, historyIndex + 1), newPath];
      setNavigationHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const handleQuickAccessClick = (path) => {
    setCurrentPath([path]);
    const newHistory = [...navigationHistory.slice(0, historyIndex + 1), [path]];
    setNavigationHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

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
    const isMobile = window.innerWidth <= 768;
    const minWidth = isMobile ? window.innerWidth : 600;
    const minHeight = isMobile ? 400 : 400;
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight - (isMobile ? 100 : 48);

    switch (resizeType) {
      case 'se': // southeast
        setSize({
          width: Math.min(maxWidth, Math.max(minWidth, dragOffset.width + (clientX - dragOffset.x))),
          height: Math.min(maxHeight, Math.max(minHeight, dragOffset.height + (clientY - dragOffset.y)))
        });
        break;
      case 'sw': // southwest
        const newWidthSW = Math.max(600, dragOffset.width - (clientX - dragOffset.x));
        setSize(prev => ({
          width: newWidthSW,
          height: Math.max(400, dragOffset.height + (clientY - dragOffset.y))
        }));
        setPosition(prev => ({
          x: dragOffset.left + dragOffset.width - newWidthSW,
          y: prev.y
        }));
        break;
      case 'ne': // northeast
        const newHeightNE = Math.max(400, dragOffset.height - (clientY - dragOffset.y));
        setSize({
          width: Math.max(600, dragOffset.width + (clientX - dragOffset.x)),
          height: newHeightNE
        });
        setPosition(prev => ({
          x: prev.x,
          y: dragOffset.top + dragOffset.height - newHeightNE
        }));
        break;
      case 'nw': // northwest
        const newWidthNW = Math.max(600, dragOffset.width - (clientX - dragOffset.x));
        const newHeightNW = Math.max(400, dragOffset.height - (clientY - dragOffset.y));
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
        const newHeightN = Math.max(400, dragOffset.height - (clientY - dragOffset.y));
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
          height: Math.max(400, dragOffset.height + (clientY - dragOffset.y))
        }));
        break;
      case 'e': // east
        setSize(prev => ({
          ...prev,
          width: Math.max(600, dragOffset.width + (clientX - dragOffset.x))
        }));
        break;
      case 'w': // west
        const newWidth = Math.max(600, dragOffset.width - (clientX - dragOffset.x));
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

  // Add the resize handlers from ChromeWindow
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

  // Add touch handlers
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

  // Add window resize handler
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile && !isMaximized) {
        setSize({
          width: window.innerWidth,
          height: Math.min(600, window.innerHeight - 100)
        });
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMaximized]);

  const handleItemClick = (name, item) => {
    if (item.type === 'file') {
      if (item.isImage) {
        setSelectedFile({ name, ...item, type: 'image' });
      } else {
        setSelectedFile({ name, ...item, type: 'text' });
      }
    } else {
      handleFolderClick(name);
    }
  };

  return (
    <>
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
          minWidth: window.innerWidth <= 768 ? '100%' : '600px',
          minHeight: '400px',
          maxHeight: `${window.innerHeight - (window.innerWidth <= 768 ? 100 : 48)}px`
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
            <img src={file_explorer} alt="File Explorer" className="w-4 h-4 mr-2" />
            <span className="text-sm text-gray-200">File Explorer</span>
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

        {/* Toolbar - Hide full path on mobile */}
        <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-2 space-x-2">
          <button 
            className={`p-2 rounded-md text-gray-400 ${historyIndex > 0 ? 'hover:bg-gray-700' : 'opacity-50 cursor-not-allowed'}`}
            onClick={handleNavigateBack}
            disabled={historyIndex === 0}
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>
          <button 
            className={`p-2 rounded-md text-gray-400 ${historyIndex < navigationHistory.length - 1 ? 'hover:bg-gray-700' : 'opacity-50 cursor-not-allowed'}`}
            onClick={handleNavigateForward}
            disabled={historyIndex === navigationHistory.length - 1}
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
          <button 
            className={`p-2 rounded-md text-gray-400 ${currentPath.length > 1 ? 'hover:bg-gray-700' : 'opacity-50 cursor-not-allowed'}`}
            onClick={handleNavigateUp}
            disabled={currentPath.length === 1}
          >
            <FaChevronUp className="w-4 h-4" />
          </button>
          <div className="flex-1 flex items-center bg-gray-700 rounded-md px-3 py-1.5">
            <FaHome className="w-4 h-4 text-gray-400 mr-2" />
            {isMobile ? (
              <span className="text-sm text-gray-200">{currentPath[currentPath.length - 1]}</span>
            ) : (
              <span className="text-sm text-gray-200">{currentPath.join(' > ')}</span>
            )}
          </div>
          <div className="flex items-center bg-gray-700 rounded-md px-3 py-1.5">
            <FaSearch className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent text-sm focus:outline-none text-gray-200 w-32"
            />
          </div>
        </div>

        {/* Action Bar - Make it scrollable */}
        <div className="h-10 bg-gray-800 border-b border-gray-700 overflow-x-auto">
          <div className="flex items-center px-4 space-x-4 min-w-max">
            <button className="flex items-center space-x-1 px-2 py-1 hover:bg-gray-700 rounded-md text-gray-300 whitespace-nowrap">
              <FaCut className="w-3.5 h-3.5" />
              <span className="text-sm">Cut</span>
            </button>
            <button className="flex items-center space-x-1 px-2 py-1 hover:bg-gray-700 rounded-md text-gray-300">
              <FaCopy className="w-3.5 h-3.5" />
              <span className="text-sm">Copy</span>
            </button>
            <button className="flex items-center space-x-1 px-2 py-1 hover:bg-gray-700 rounded-md text-gray-300">
              <FaPaste className="w-3.5 h-3.5" />
              <span className="text-sm">Paste</span>
            </button>
            <div className="h-4 w-px bg-gray-700" />
            <button className="flex items-center space-x-1 px-2 py-1 hover:bg-gray-700 rounded-md text-gray-300">
              <FaRedo className="w-3.5 h-3.5" />
              <span className="text-sm">Rename</span>
            </button>
            <button className="flex items-center space-x-1 px-2 py-1 hover:bg-gray-700 rounded-md text-gray-300">
              <FaTrash className="w-3.5 h-3.5" />
              <span className="text-sm">Delete</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 h-[calc(100%-7.5rem)] min-h-0">
          {/* Sidebar - Make it collapsible */}
          <div className="hidden md:block w-48 min-w-[12rem] bg-gray-800 border-r border-gray-700 flex-shrink-0 overflow-y-auto">
            <div className="p-2">
              <div className="mb-4">
                <div className="text-gray-400 text-xs font-semibold px-2 mb-2">QUICK ACCESS</div>
                {Object.entries(DUMMY_FILE_SYSTEM['This PC'].children)
                  .filter(([_, value]) => value.type === 'system')
                  .map(([name, value]) => (
                    <button
                      key={name}
                      className="w-full flex items-center space-x-2 px-2 py-1.5 rounded-md hover:bg-gray-700 text-gray-300"
                      onClick={() => handleQuickAccessClick(name)}
                    >
                      {value.icon}
                      <span className="text-sm">{name}</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* File List - Improve grid responsiveness */}
          <div className="flex-1 bg-gray-900 overflow-y-auto p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
              {Object.entries(getCurrentFolder()).map(([name, item]) => (
                <div
                  key={name}
                  className="flex flex-col items-center space-y-2 p-2 md:p-3 rounded-md hover:bg-gray-800 cursor-pointer"
                  onClick={() => handleItemClick(name, item)}
                >
                  <div className="text-blue-400 flex items-center justify-center">
                    <div className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16">
                      {React.cloneElement(item.icon, {
                        className: 'w-full h-full'
                      })}
                    </div>
                  </div>
                  <span className="text-xs md:text-sm text-gray-300 text-center break-words w-full line-clamp-2">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resize Handles */}
        {!isMaximized && window.innerWidth > 768 && (
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

      {/* Text Viewer */}
      {selectedFile && (
        selectedFile.type === 'image' ? (
          <ImageViewer
            file={selectedFile}
            onClose={() => setSelectedFile(null)}
            isMaximized={false}
            onMaximize={() => {}}
            onMinimize={() => {}}
          />
        ) : (
          <TextViewer
            file={selectedFile}
            onClose={() => setSelectedFile(null)}
            isMaximized={false}
            onMaximize={() => {}}
            onMinimize={() => {}}
          />
        )
      )}
    </>
  );
};

export default FileExplorerWindow; 