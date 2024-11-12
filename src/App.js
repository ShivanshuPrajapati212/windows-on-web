import './App.css';
import StartMenu from './components/StartMenu';
import TaskBar from './components/TaskBar';

function App() {
  return (
    <div className="text-white h-screen bg-center bg-bgi bg-cover">
        <TaskBar />
        <div className="justify-center bottom-14 absolute items-center flex w-screen">
        <StartMenu/>
        </div>
    </div>
  );
}

export default App;
