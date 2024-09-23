// src/components/Popup.tsx
import React from 'react';
import { Modal, Box, Typography } from '@mui/material';
import Form from '../Form';

interface PopupProps {
    open: boolean;
    onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ open, onClose }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography id="modal-title" variant="h6" component="h2">
                 Investigator Information
                </Typography>
                <Form onClose={onClose} />
            </Box>
        </Modal>
    );
};

export default Popup;
