import React, { useState } from 'react';
import { Modal, TextField, Button } from '@mui/material';

interface AddRemarkModalProps {
  open: boolean;
  onClose: () => void;
}

const AddRemarkModal: React.FC<AddRemarkModalProps> = ({ open, onClose }) => {
  const [caseNo, setCaseNo] = useState('');
  const [remark, setRemark] = useState('');

  const handleSave = () => {
    // Add logic to save the remark (e.g., send it to a server)
    console.log('Case No:', caseNo);
    console.log('Remark:', remark);
    onClose(); // Close the modal after saving
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ padding: '20px', backgroundColor: 'white', margin: '10% auto', maxWidth: '400px', borderRadius: '8px' }}>
        <h2>Add Remark</h2>
        <TextField
          label="Case No"
          fullWidth
          margin="normal"
          value={caseNo}
          onChange={(e) => setCaseNo(e.target.value)}
        />
        <TextField
          label="Remark"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          placeholder="Add remark about this case"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: '10px' }}>
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default AddRemarkModal;
