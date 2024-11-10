import React from 'react'
import starticon from "../images/start-icon.svg";
import search_icon from "../images/search_icon.png"
import file_explorer from "../images/file_explorer.png"
import chrome from "../images/chrome.png"
import vscode from "../images/vs_code.png"
import msstore from "../images/msstore.png"

const TaskBar = () => {
  return (
    <div className='bottom-0 w-screen bg-blur flex flex-row items-center justify-center h-12 absolute border-t-[0.25px] border-gray-500 gap-4'>
      <img className='h-7 w-7' src={starticon} alt="icon"/>
      <input className='rounded-3xl h-8 bg-blur border-t-[0.25px] border-gray-500 px-5 text-sm text-white placeholder-gray-200 items-center flex' type="text" name="search" id="search_id" placeholder='Search'/>
      <ul className='flex gap-4'>
        <li className='h-7 w-7'><img src={msstore} alt="file explorer" /></li>
        <li className='h-7 w-7'><img src={file_explorer} alt="file explorer" /></li>
        <li className='h-7 w-7'><img src={chrome} alt="file explorer" /></li>
        <li className='h-7 w-7'><img src={vscode} alt="file explorer" /></li>
      </ul>
    </div>
  )
}

export default TaskBar
