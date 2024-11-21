import React, { useState, useRef, useEffect } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { TbMinus, TbSquare } from 'react-icons/tb';
import { 
  FaFolder, 
  FaChevronRight, 
  FaChevronDown,
  FaCode,
  FaSearch,
  FaCog,
  FaGithub,
  FaChevronLeft
} from 'react-icons/fa';
import vscode from '../images/vs_code.png';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';

const VSCodeWindow = ({ onClose, isMaximized, onMaximize, onMinimize }) => {
  const [position, setPosition] = useState({ x: 50, y: 25 });
  const [size, setSize] = useState({ 
    width: window.innerWidth > 768 ? 800 : window.innerWidth - 20, 
    height: window.innerHeight > 600 ? 600 : window.innerHeight - 100 
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef(null);
  const [activeFile, setActiveFile] = useState(null);
  const [explorerOpen, setExplorerOpen] = useState(true);
  const [folderState, setFolderState] = useState({});
  const [fileContents, setFileContents] = useState({});

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
      // Add other resize cases from ChromeWindow
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

  const files = {
    'portfolio': {
      type: 'folder',
      children: {
        'src': {
          type: 'folder',
          children: {
            'components': {
              type: 'folder',
              children: {
                'Header.js': {
                  type: 'file',
                  content: `import React from 'react';

const Header = () => {
  return (
    <header className="bg-gray-900 text-white">
      <nav className="container mx-auto px-6 py-4">
        <h1>Shivanshu Prajapati</h1>
        <p>Full Stack Developer</p>
      </nav>
    </header>
  );
};

export default Header;`
                },
                'Projects.js': {
                  type: 'file',
                  content: `import React from 'react';

const Projects = () => {
  const projects = [
    {
      title: 'Windows 11 Clone',
      description: 'A web-based Windows 11 clone',
      tech: ['React', 'Tailwind CSS']
    },
    // Add more projects
  ];

  return (
    <section className="projects">
      {projects.map(project => (
        <div key={project.title}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
      ))}
    </section>
  );
};

export default Projects;`
                }
              }
            },
            'styles': {
              type: 'folder',
              children: {
                'globals.css': {
                  type: 'file',
                  content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #0070f3;
  --secondary: #ff0080;
}

body {
  background: #1a1a1a;
  color: #ffffff;
}`
                },
                'components.css': {
                  type: 'file',
                  content: `.header {
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.project-card {
  transition: transform 0.2s;
}

.project-card:hover {
  transform: translateY(-5px);
}`
                }
              }
            },
            'utils': {
              type: 'folder',
              children: {
                'api.js': {
                  type: 'file',
                  content: `export const fetchGithubProjects = async () => {
  const response = await fetch('https://api.github.com/users/ShivanshuPrajapati212/repos');
  const data = await response.json();
  return data;
};

export const sendContactForm = async (formData) => {
  // Implementation for contact form
  console.log('Sending form data:', formData);
};`
                }
              }
            },
            'App.js': {
              type: 'file',
              content: `import React from 'react';
import Header from './components/Header';
import Projects from './components/Projects';
import './styles/globals.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <Projects />
      </main>
    </div>
  );
}

export default App;`
            }
          }
        },
        'public': {
          type: 'folder',
          children: {
            'index.html': {
              type: 'file',
              content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Shivanshu Prajapati - Portfolio</title>
    <meta name="description" content="Full Stack Developer Portfolio" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`
            }
          }
        },
        'config': {
          type: 'folder',
          children: {
            'tailwind.config.js': {
              type: 'file',
              content: `module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
      },
    },
  },
  plugins: [],
}`
            }
          }
        },
        'package.json': {
          type: 'file',
          content: `{
  "name": "portfolio",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.3.0",
    "@heroicons/react": "^2.0.18"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}`
        },
        'README.md': {
          type: 'file',
          content: `# Portfolio Website

A modern portfolio website built with React and Tailwind CSS.

## Features
- Responsive design
- Dark mode
- Project showcase
- Contact form
- Blog section

## Getting Started
1. Clone the repository
2. Run \`npm install\`
3. Run \`npm run dev\`

## Technologies Used
- React.js
- Tailwind CSS
- Next.js
- Vercel`
        }
      }
    }
  };

  useEffect(() => {
    // Initialize folder state
    const initFolderState = {};
    const initFileContents = {};
    
    const traverseFiles = (items, path = '') => {
      Object.entries(items).forEach(([name, item]) => {
        const fullPath = path ? `${path}/${name}` : name;
        if (item.type === 'folder') {
          initFolderState[fullPath] = true; // Start with all folders open
          traverseFiles(item.children, fullPath);
        } else {
          initFileContents[fullPath] = item.content;
        }
      });
    };
    
    traverseFiles(files);
    setFolderState(initFolderState);
    setFileContents(initFileContents);
  }, []);

  const toggleFolder = (path) => {
    setFolderState(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const handleFileContentChange = (path, newContent) => {
    setFileContents(prev => ({
      ...prev,
      [path]: newContent
    }));
  };

  const renderFileTree = (items, path = '') => {
    return Object.entries(items).map(([name, item]) => {
      const fullPath = path ? `${path}/${name}` : name;
      
      if (item.type === 'folder') {
        return (
          <div key={fullPath}>
            <div 
              className="flex items-center px-2 py-1 hover:bg-gray-700/50 cursor-pointer"
              onClick={() => toggleFolder(fullPath)}
            >
              {folderState[fullPath] ? 
                <FaChevronDown className="w-3 h-3 mr-1 max-md:w-2 max-md:h-2" /> : 
                <FaChevronRight className="w-3 h-3 mr-1 max-md:w-2 max-md:h-2" />
              }
              <FaFolder className="w-4 h-4 mr-2 text-blue-400 max-md:w-3 max-md:h-3 max-md:mr-1" />
              <span className="text-sm max-md:text-xs">{name}</span>
            </div>
            <div className={`ml-4 max-md:ml-2 ${folderState[fullPath] ? 'block' : 'hidden'}`}>
              {renderFileTree(item.children, fullPath)}
            </div>
          </div>
        );
      }

      return (
        <div 
          key={fullPath}
          className={`flex items-center px-2 py-1 hover:bg-gray-700/50 cursor-pointer ${activeFile === fullPath ? 'bg-gray-700' : ''}`}
          onClick={() => setActiveFile(fullPath)}
        >
          <FaCode className="w-4 h-4 mr-2 text-orange-400 max-md:w-3 max-md:h-3 max-md:mr-1" />
          <span className="text-sm max-md:text-xs">{name}</span>
        </div>
      );
    });
  };

  const getFileLanguage = (fileName) => {
    const ext = fileName.split('.').pop();
    switch (ext) {
      case 'js': return 'javascript';
      case 'css': return 'css';
      case 'json': return 'json';
      case 'md': return 'markdown';
      case 'html': return 'html';
      default: return 'text';
    }
  };

  useEffect(() => {
    if (activeFile) {
      Prism.highlightAll();
    }
  }, [activeFile, fileContents]);

  const handleGitHubClick = () => {
    window.open('https://github.com/ShivanshuPrajapati212', '_blank');
  };

  useEffect(() => {
    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      setDragOffset({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
    };

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      if (isDragging) {
        setPosition({
          x: touch.clientX - dragOffset.x,
          y: touch.clientY - dragOffset.y
        });
      }
    };

    if (isDragging) {
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging]);

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
      {/* Title Bar */}
      <div
        className="h-10 bg-[#1e1e1e] flex items-center justify-between select-none cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center px-4">
          <img src={vscode} alt="VS Code" className="w-4 h-4 mr-2" />
          <span className="text-sm text-gray-300">Visual Studio Code</span>
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

      {/* Activity Bar */}
      <div className="flex h-[calc(100%-2.5rem)]">
        <div className="w-12 bg-[#1e1e1e] flex flex-col items-center py-2 space-y-4">
          <button 
            className="p-2 text-white hover:bg-gray-700 rounded-md"
            onClick={() => setExplorerOpen(!explorerOpen)}
          >
            <FaFolder className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-700 rounded-md">
            <FaSearch className="w-5 h-5" />
          </button>
          <button 
            className="p-2 text-gray-500 hover:bg-gray-700 rounded-md"
            onClick={handleGitHubClick}
          >
            <FaGithub className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <button className="p-2 text-gray-500 hover:bg-gray-700 rounded-md">
            <FaCog className="w-5 h-5" />
          </button>
        </div>

        {/* Explorer - Make it more mobile-friendly */}
        <div 
          className={`${explorerOpen ? 'w-60 md:w-60 max-md:w-48' : 'w-0'} bg-[#252526] border-r border-gray-800 
            transition-all duration-200 overflow-hidden ${
            window.innerWidth <= 768 ? 'absolute left-12 h-[80%] z-10 rounded-br-lg shadow-lg' : ''
          }`}
        >
          <div className="p-2 text-sm text-gray-400 font-semibold flex items-center justify-between">
            <span>EXPLORER</span>
            {window.innerWidth <= 768 && (
              <button 
                onClick={() => setExplorerOpen(false)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <FaChevronLeft className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="text-gray-300 overflow-y-auto h-full max-md:text-xs">
            {renderFileTree(files)}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 bg-[#1e1e1e] text-gray-300 overflow-auto">
          {activeFile ? (
            <div className="relative h-full">
              <pre className="w-full h-full p-4 m-0 overflow-auto">
                <code className={`language-${getFileLanguage(activeFile.split('/').pop())}`}>
                  {fileContents[activeFile] || ''}
                </code>
              </pre>
              <textarea
                className="absolute inset-0 w-full h-full p-4 font-mono text-sm bg-transparent text-transparent caret-white resize-none leading-normal"
                value={fileContents[activeFile] || ''}
                onChange={(e) => handleFileContentChange(activeFile, e.target.value)}
                spellCheck="false"
                style={{
                  lineHeight: '1.5',
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace'
                }}
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a file to view its contents
            </div>
          )}
        </div>
      </div>

      {/* Add resize handles */}
      {!isMaximized && (
        <>
          <div 
            className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize hover:bg-blue-500/20"
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
            onTouchStart={(e) => handleTouchStart(e, 'se')}
          />
          {/* Add other resize handles as needed */}
        </>
      )}
    </div>
  );
};

export default VSCodeWindow; 