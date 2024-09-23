import React from 'react';
import Mainh from "./components/Mainh/Mainh";
import Sidebar from "./components/sidebar/Sidebar";
import './App.css';
import ItemsList from './components/ItemList';
import ComprehensiveReport from './components/sidebar/ComprehensiveReport';
import ReportPage from './components/sidebar/ReportPage';

function App() {
  return (
    <div className="d-flex flex-column">
      {/* Top Mainh Component */}
      <header>
        <Mainh />
      </header>

      {/* Main Content Area */}
        <div className="container-fluid  pt-4">
          <div className="row">
            <div className="col-2 pt-2 ">
              <Sidebar />
            </div>
            <div className="col-10  pt-3">

              <ReportPage/>
              {/* Main content goes here */}
            </div>
          </div>
        </div>

      {/* Bottom Mainh Component */}

    
    

    </div>
  );
}

export default App;
