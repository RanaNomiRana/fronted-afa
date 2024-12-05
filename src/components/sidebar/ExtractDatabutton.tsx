import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Report } from '@mui/icons-material';
import ComprehensiveShortReport from './ComprehensiveShortReport';

const ExtractDataButton: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false); // Type the state for dialog open status

  // Function to open the dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function to close the dialog
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ padding: 9 }}>
      <Button
      variant="contained"
      startIcon={<Report />}
      onClick={handleClickOpen}
    >
      Make Report
    </Button>

      {/* Dialog to show ExtractData component */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Inv Report</DialogTitle>
        <DialogContent>
          <ComprehensiveShortReport onClose={handleClose}/>
        </DialogContent>
        <DialogActions>
         
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExtractDataButton;
