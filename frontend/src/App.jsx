import { useState } from 'react';
import Navbar from './components/NavBar';
import Home from './pages/Home';
import ReportProblem from './pages/ReportProblem';
import Map from './pages/Map';
import Status from './pages/Status';
import './css/App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'report':
        return <ReportProblem />;
      case 'map':
        return <Map />;
      case 'status':
        return <Status />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="app-container">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  );
}