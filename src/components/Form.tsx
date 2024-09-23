// src/components/Form.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, TextField, Box } from '@mui/material';
import { toast } from 'react-toastify'; // Import toast from react-toastify

interface FormProps {
    onClose: () => void;
}

const Form: React.FC<FormProps> = ({ onClose }) => {
    const [deviceName, setDeviceName] = useState<string>('');
    const [casenumber, setCasenumber] = useState<string>('');
    const [additionalInfo, setAdditionalInfo] = useState<string>('');
    const [investigatorId, setInvestigatorId] = useState<string>(''); // New state for Investigator ID
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchDeviceName = async () => {
            try {
                const response = await axios.get('http://localhost:3000/device-name');
                setDeviceName(response.data.deviceName);
            } catch (error) {
                console.error('Error fetching device name:', error);
                toast.error('Failed to fetch device name'); // Show error toast
            } finally {
                setLoading(false);
            }
        };

        fetchDeviceName();
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/store-additional-info', {
                deviceName,
                casenumber,
                additionalInfo,
                investigatorId // Include Investigator ID in the POST request
            });

            // Handle success response
            toast.success(response.data || 'Additional information stored successfully');
            onClose(); // Close the popup after successful submission
        } catch (error) {
            console.error('Error storing additional information:', error);

            // Handle errors based on status code and response
            if (axios.isAxiosError(error) && error.response) {
                const { status, data } = error.response;

                switch (status) {
                    case 400:
                        toast.error(data.message || 'Device name, Connector ID, and Investigator ID are required');
                        break;
                    case 409:
                        toast.error(data.message || 'A record with this Case NO# already exists');
                        break;
                    case 500:
                        toast.error(data.message || 'Error storing additional information');
                        break;
                    default:
                        toast.error('Error storing additional information');
                        break;
                }
            } else {
                toast.error('Error storing additional information'); // Generic error message
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Show a loading message or spinner while fetching data
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}
        >
            <TextField
                label="Investigator ID"
                variant="outlined"
                value={investigatorId}
                onChange={(e) => setInvestigatorId(e.target.value)}
            />
            <TextField
                label="Case Number"
                variant="outlined"
                value={casenumber}
                onChange={(e) => setCasenumber(e.target.value)}
                required
            />
            <TextField
                label="Device Name"
                variant="outlined"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                required
                disabled // Disable the field if you want to prevent user modification
            />
            <TextField
                label="Additional Info"
                variant="outlined"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
            />
            <Button type="submit" variant="contained">Submit</Button>
        </Box>
    );
};

export default Form;
