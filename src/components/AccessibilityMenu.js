import React from 'react'
import wifi_icon from '../images/wifi-logo.svg'
import speaker_icon from '../images/speaker.svg'

const AccessibilityMenu = () => {
  return (
    <div className="flex w-[20vw] h-[40vh] max-md:w-[85vw] max-md:h-[75vh] rounded-lg start-menu flex-col justify-start border-gray-500 relative transition-all duration-200 ease-in-out">
      <div className="p-6">
        {/* Quick Settings Section */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-3">
            {/* WiFi Toggle */}
            <div className="flex flex-col items-center justify-center bg-gray-700/30 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors duration-200 p-3 aspect-video">
              <img src={wifi_icon} alt="WiFi" className="w-6 h-6 mb-2" />
              <span className="text-white text-xs">WiFi</span>
            </div>
            {/* Bluetooth Toggle */}
            <div className="flex flex-col items-center justify-center bg-gray-700/30 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors duration-200 p-3 aspect-video">
              <svg className="w-6 h-6 mb-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
              </svg>
              <span className="text-white text-xs">Bluetooth</span>
            </div>
            {/* Volume Control */}
            <div className="flex flex-col items-center justify-center bg-gray-700/30 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors duration-200 p-3 aspect-video">
              <img src={speaker_icon} alt="Volume" className="w-6 h-6 mb-2" />
              <span className="text-white text-xs">Volume</span>
            </div>
            {/* Brightness Control */}
            <div className="flex flex-col items-center justify-center bg-gray-700/30 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors duration-200 p-3 aspect-video">
              <svg className="w-6 h-6 mb-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
              </svg>
              <span className="text-white text-xs">Brightness</span>
            </div>
            {/* Battery Status */}
            <div className="flex flex-col items-center justify-center bg-gray-700/30 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors duration-200 p-3 aspect-video">
              <svg className="w-6 h-6 mb-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zM11 20v-5.5H9L13 7v5.5h2L11 20z"/>
              </svg>
              <span className="text-white text-xs">Battery</span>
            </div>
            {/* Night Light */}
            <div className="flex flex-col items-center justify-center bg-gray-700/30 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors duration-200 p-3 aspect-video">
              <svg className="w-6 h-6 mb-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.43 2.3c-2.38-.59-4.68-.27-6.63.64-.35.16-.41.64-.1.86C8.3 5.6 10 8.6 10 12c0 3.4-1.7 6.4-4.3 8.2-.32.22-.26.7.09.86 1.28.6 2.71.94 4.21.94 6.05 0 10.85-5.38 9.87-11.6-.61-3.92-3.59-7.16-7.44-8.1z"/>
              </svg>
              <span className="text-white text-xs">Night light</span>
            </div>
          </div>
        </div>

        {/* Sliders Section */}
        <div className="space-y-4">
          {/* Brightness Slider */}
          <div className="flex items-center space-x-4">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
            </svg>
            <input type="range" className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
          </div>
          {/* Volume Slider */}
          <div className="flex items-center space-x-4">
            <img src={speaker_icon} alt="Volume" className="w-5 h-5" />
            <input type="range" className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccessibilityMenu
