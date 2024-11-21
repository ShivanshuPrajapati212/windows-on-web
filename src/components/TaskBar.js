import React from "react";
import starticon from "../images/start-icon.svg";
import file_explorer from "../images/file_explorer.png";
import chrome from "../images/chrome.png";
import vscode from "../images/vs_code.png";
import msstore from "../images/msstore.png";
import wifi_icon from "../images/wifi-logo.svg";
import speaker_icon from "../images/speaker.svg";

const TaskBar = ({ onStartClick, onAccessibilityClick, activeWindows, focusedWindow, onWindowClick }) => {
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  const pinnedApps = [
    { id: 'explorer', icon: file_explorer, alt: 'File Explorer' },
    { id: 'chrome', icon: chrome, alt: 'Chrome' },
    { id: 'vscode', icon: vscode, alt: 'VS Code' },
    { id: 'store', icon: msstore, alt: 'Store' }
  ];

  return (
    <div className="bottom-0 w-screen bg-blur flex flex-row items-center justify-between max-md:justify-center h-12 absolute border-t-[0.25px] border-gray-500 gap-4">
      <div className="left ml-36 max-md:hidden"></div>
      <div className="center flex flex-row gap-4">
        <img 
          className="h-7 w-7 cursor-pointer max-md:h-6 max-md:w-6" 
          src={starticon} 
          alt="icon"
          onClick={onStartClick}
        />
        <input
          className="rounded-3xl max-sm:hidden cursor-text h-8 w-52 max-md:w-36 max-md:h-7 bg-blur border-t-[0.25px] border-gray-500 px-5 text-sm text-white placeholder-gray-200 items-center flex"
          type="text"
          name="search"
          id="search_id"
          placeholder="Search"
        />
        <ul className="flex gap-5 max-md:gap-3">
          {pinnedApps.map((app) => (
            <li 
              key={app.id}
              className={`h-7 w-7 cursor-pointer max-md:h-6 max-md:w-6 p-0.5
                ${activeWindows.includes(app.id) ? 'border-b-2 border-white' : ''}
                ${focusedWindow === app.id ? 'bg-gray-700/50 rounded-md' : ''}`}
              onClick={() => onWindowClick(app.id)}
            >
              <img src={app.icon} alt={app.alt} className="w-full h-full" />
            </li>
          ))}
        </ul>
      </div>
      <div className="right flex flex-row gap-4 items-center justify-center mr-5 max-md:hidden">
        <ul className="flex flex-column gap-2" onClick={onAccessibilityClick}>
          <img className="h-4 w-4 cursor-pointer" src={wifi_icon} alt="wifi" />
          <img className="h-4 w-4 cursor-pointer" src={speaker_icon} alt="speaker" />
        </ul>
        <ul className="text-[13px] justify-end items-end leading-4">
          <li className="self-end items-end justify-end right-0 cursor-pointer">
            {hours}:{minutes < 10 ? `0${minutes}` : minutes}
          </li>
          <li className="cursor-pointer">
            {day}/{month}/{year}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TaskBar;
