import './App.css';
import { useState } from 'react';
import StartMenu from './components/StartMenu';
import TaskBar from './components/TaskBar';

function App() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  const toggleStartMenu = () => {
    setIsStartMenuOpen(!isStartMenuOpen);
  };
  
  return (
    <div className="text-white h-screen bg-center bg-bgi bg-cover">
      <TaskBar onStartClick={toggleStartMenu} />
      <div 
        className={`justify-center bottom-14 absolute items-center flex w-screen start-menu-transition
          ${isStartMenuOpen 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        <StartMenu />
      </div>
    </div>
  );
}

export default App;
