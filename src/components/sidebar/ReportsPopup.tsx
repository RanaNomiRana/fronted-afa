import React from 'react';
import PurchaseByDate from './PurchaseByDate';

const ReportsPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="popup-overlay">
    <div className="popup-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <h2 className="text-center custom-bg text-white rounded">Purchase Reports</h2>
          </div>
          <div className="col d-flex justify-content-end">
            <button type="button" onClick={onClose} className="custom-bg rounded text-white">Close</button>
          </div>
        </div>
      </div>
      <PurchaseByDate />
    </div>
  </div>
);

export default ReportsPopup;
