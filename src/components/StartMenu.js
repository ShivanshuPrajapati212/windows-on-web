import React from 'react'
import file_explorer from "../images/file_explorer.png";
import chrome from "../images/chrome.png";
import vscode from "../images/vs_code.png";
import msstore from "../images/msstore.png";
import shutdown from "../images/shutdown.svg";


const StartMenu = () => {
  return (
    <div className={`flex w-[35vw] h-[75vh] max-md:w-[85vw] max-md:h-[75vh] rounded-lg start-menu flex-column items-center justify-center max-md:justify-center border-gray-500 relative transition-all duration-200 ease-in-out`}>
      <div className="w-full h-full flex flex-col p-4">
        {/* Search Bar */}
        <div className="w-full mb-4">
          <input 
            type="text"
            placeholder="Type here to search"
            className="w-full p-2 rounded-3xl bg-gray-700/50 text-white border border-gray-600/30 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto mb-16">
          {/* Pinned Apps */}
          <div className="mb-6">
            <h2 className="text-white text-sm mb-3 font-semibold">Pinned</h2>
            <div className="grid grid-cols-6 gap-1 max-md:gap-1">
              {/* Updated App Icons with consistent hover effect */}
              <div className="flex flex-col items-center hover:bg-gray-700/50 rounded-md cursor-pointer transition-colors duration-200 p-2">
                <img src={msstore} alt="MS Store" className="w-8 h-8 mb-1" />
                <span className="text-white text-xs">Store</span>
              </div>
              <div className="flex flex-col items-center hover:bg-gray-700/50 rounded-md cursor-pointer transition-colors duration-200 p-2">
                <img src={chrome} alt="Chrome" className="w-8 h-8 mb-1" />
                <span className="text-white text-xs">Chrome</span>
              </div>
              <div className="flex flex-col items-center hover:bg-gray-700/50 rounded-md cursor-pointer transition-colors duration-200 p-2">
                <img src={vscode} alt="VS Code" className="w-8 h-8 mb-1" />
                <span className="text-white text-xs">VS Code</span>
              </div>
              <div className="flex flex-col items-center hover:bg-gray-700/50 rounded-md cursor-pointer transition-colors duration-200 p-2">
                <img src={file_explorer} alt="Explorer" className="w-8 h-8 mb-1" />
                <span className="text-white text-xs">Explorer</span>
              </div>
            </div>
          </div>

          {/* All Apps Button */}
          <button className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700/50 rounded-md mb-4 transition-colors duration-200">
            All apps {'>'}
          </button>

          {/* Recommended */}
          <div>
            <h2 className="text-white text-sm mb-3 font-semibold">Recommended</h2>
            <div className="space-y-1">
              <div className="flex items-center hover:bg-gray-700/50 rounded-md cursor-pointer transition-colors duration-200 p-2">
                <img src={vscode} alt="VS Code" className="w-6 h-6 mr-3" />
                <div className="flex flex-col">
                  <span className="text-white text-sm">workspace.code-workspace</span>
                  <span className="text-gray-400 text-xs">Recently added</span>
                </div>
              </div>
              <div className="flex items-center hover:bg-gray-700/50 rounded-md cursor-pointer transition-colors duration-200 p-2">
                <img src={chrome} alt="Chrome" className="w-6 h-6 mr-3" />
                <div className="flex flex-col">
                  <span className="text-white text-sm">github.com</span>
                  <span className="text-gray-400 text-xs">Recently visited</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile and Power Options */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-800/30 rounded-b-lg">
          <div className="flex items-center justify-around">
            <div className="flex items-center space-x-3 mr-12 hover:bg-gray-700/50 rounded-md cursor-pointer transition-colors duration-200 p-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-sm">JD</span>
              </div>
              <span className="text-white text-sm">John Doe</span>
            </div>
            <button className="hover:bg-gray-700/50 p-2 rounded-md ml-12 transition-colors duration-200">
              <img src={shutdown} className='h-7 w-7 text-white' alt="Shutdown" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StartMenu
