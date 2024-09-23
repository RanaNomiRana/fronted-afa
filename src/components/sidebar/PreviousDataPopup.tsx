import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { Close } from '@mui/icons-material';
import PreviousData from './PreviousData';

interface PreviousDataPopupProps {
  open: boolean;
  onClose: () => void;
}

const PreviousDataPopup: React.FC<PreviousDataPopupProps> = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="previous-data-popup-title"
      aria-describedby="previous-data-popup-description"
    >
      <DialogTitle id="previous-data-popup-title">
        Previous Data
        <Button
          onClick={onClose}
          style={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </Button>
      </DialogTitle>
      <DialogContent>
        {/* Content for Previous Data */}
        <div>

          <PreviousData/>

          {/* You can replace this with actual data content */}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreviousDataPopup;
