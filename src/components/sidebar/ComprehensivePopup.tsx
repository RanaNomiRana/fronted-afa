import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import Pdfreport from './Pdfreport';

interface PreviousDataPopupProps {
  open: boolean;
  onClose: () => void;
}

const ComprehensivePopup: React.FC<PreviousDataPopupProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Typography variant="h6">Comprehensive Report</Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          style={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        
      </DialogContent>
    </Dialog>
  );
};

export default ComprehensivePopup ;
