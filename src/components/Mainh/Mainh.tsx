import { FaArrowLeft, FaArrowRight, FaSyncAlt, FaMinus, FaSquare, FaTimes } from 'react-icons/fa';
import './Mainh.css';


function Mainh() {
    // Function to handle close button click
    const handleClose = () => {
      if (window.ipcRenderer) {
        window.ipcRenderer.send('close-window');
      } else {
        console.error('ipcRenderer is not available');
      }
    };
  
    // Function to handle minimize button click
    const handleMinimize = () => {
      if (window.ipcRenderer) {
        window.ipcRenderer.send('minimize-window');
      } else {
        console.error('ipcRenderer is not available');
      }
    };
  
    // Function to handle maximize button click
    const handleMaximize = () => {
      if (window.ipcRenderer) {
        window.ipcRenderer.send('maximize-window');
      } else {
        console.error('ipcRenderer is not available');
      }
    };
  
    // Function to handle back button click
    const handleBack = () => {
      if (window.ipcRenderer) {
        window.ipcRenderer.send('go-back');
      } else {
        console.error('ipcRenderer is not available');
      }
    };
  
    // Function to handle forward button click
    const handleForward = () => {
      if (window.ipcRenderer) {
        window.ipcRenderer.send('go-forward');
      } else {
        console.error('ipcRenderer is not available');
      }
    };
  
    // Function to handle reload button click
    const handleReload = () => {
      if (window.ipcRenderer) {
        window.ipcRenderer.send('reload-page');
      } else {
        console.error('ipcRenderer is not available');
      }
    };
  
    return (
      <>
        <div className="container-fluid z-3 header border  position-fixed ">
          <div className="row border d-flex align-items-center justify-content-center">
            <div className="col d-flex justify-content-start  b_f_r">
              <button className="control-button header-border m-1" onClick={handleBack}>
                <FaArrowLeft />
              </button>
              <button className="control-button header-border m-1" onClick={handleForward}>
                <FaArrowRight />
              </button>
              <button className="control-button header-border m-1" onClick={handleReload}>
                <FaSyncAlt />
              </button>
            </div>
  
            <div className="col  text-center ">
              <span className="footer">Android Forensic Analyzer Tool</span>
            </div>
  
            <div className="col d-flex justify-content-end  C-M-MAX">
              <button className="control-button header-border m-1" onClick={handleMinimize}>
                <FaMinus />
              </button>
              <button className="control-button header-border m-1" onClick={handleMaximize}>
                <FaSquare />
              </button>
              <button className="control-button header-border m-1" onClick={handleClose}>
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
  
        
        
  
  
        </>
    );
  }

  export default Mainh;