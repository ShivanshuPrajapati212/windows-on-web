import './App.css';
import TaskBar from './components/TaskBar';

function App() {
  return (
    <div className="text-white h-screen bg-center bg-bgi bg-cover">
      <TaskBar />
      <div className="text-5xl">Work in Progress</div>
    </div>
  );
}

export default App;
