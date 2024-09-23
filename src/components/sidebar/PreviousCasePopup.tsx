import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import ConnectionDetail from './ConnectionDetail';

interface PreviousCasePopupProps {
  open: boolean;
  onClose: () => void;
}

const PreviousCasePopup: React.FC<PreviousCasePopupProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Previous Case Details</DialogTitle>
      <DialogContent>

        <ConnectionDetail/>
        {/* You can replace this placeholder with actual data */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreviousCasePopup;
