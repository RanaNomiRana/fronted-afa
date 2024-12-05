import React, { useState } from 'react';
import axios from 'axios';

const PullData: React.FC = () => {
    const [caseNumber, setCaseNumber] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleCaseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCaseNumber(e.target.value);
    };

    const handleSubmit = async () => {
        if (!caseNumber) {
            setError('Case number is required');
            return;
        }

        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await axios.post('http://localhost:4000/pull-sd-card', { caseNumber });
            setMessage(response.data.message);
        } catch (err) {
            setError('Failed to pull data: ' + (err.response?.data?.error || err.message));
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCaseNumber(''); // Reset case number when closing modal
        setMessage('');
        setError('');
    };

    return (
        <div>
            <button onClick={openModal} style={{
                    fontSize: '16px',
                    cursor: 'pointer',
                    marginTop:'10px',
                }}>Pull</button>

            {/* Modal */}
            {isModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            width: '300px',
                            textAlign: 'center',
                        }}
                    >
                        <h2>Enter Case Number</h2>
                        <input
                            type="text"
                            value={caseNumber}
                            onChange={handleCaseNumberChange}
                            placeholder="Enter Case Number"
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        />
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#007BFF',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {isLoading ? 'Loading...' : 'Submit'}
                        </button>
                        <button
                            onClick={closeModal}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#FF4136',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginTop: '10px',
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Message display */}
            {message && <p style={{ color: 'green' }}>{message}</p>}
        </div>
    );
};

export default PullData;
