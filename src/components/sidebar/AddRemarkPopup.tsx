import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

interface AddRemarkPopupProps {
  open: boolean;
  onClose: () => void;
  onAddRemark: (remark: string) => void;
}

const AddRemarkPopup: React.FC<AddRemarkPopupProps> = ({ open, onClose, onAddRemark }) => {
  const [remark, setRemark] = useState('');

  const handleAddRemark = () => {
    onAddRemark(remark);
    setRemark('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Remark</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Remark"
          type="text"
          fullWidth
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAddRemark}>Add Remark</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRemarkPopup;
