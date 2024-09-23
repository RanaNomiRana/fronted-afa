import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import './CallLog.css'; // Import your CSS file

interface CallLogEntry {
    id: string;
    number: string;
    date: string;
    duration: string;
    type: string;
}

const CallLog: React.FC = () => {
    const [callLog, setCallLog] = useState<CallLogEntry[]>([]);
    const [filteredCallLog, setFilteredCallLog] = useState<CallLogEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const fetchCallLog = async () => {
            try {
                const response = await axios.get('http://localhost:3000/call-log');
                setCallLog(response.data);
                setFilteredCallLog(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch call log data.');
                setLoading(false);
            }
        };

        fetchCallLog();
    }, []);

    useEffect(() => {
        const filtered = callLog.filter(entry => 
            entry.number.includes(searchTerm) || 
            entry.date.includes(searchTerm) || 
            entry.type.includes(searchTerm)
        );
        setFilteredCallLog(filtered);
    }, [searchTerm, callLog]);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        if (!printWindow) return;

        printWindow.document.open();
        printWindow.document.write(`
            <html>
            <head>
                <title>Print Call Log</title>
                <style>
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <h1>Call Log</h1>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Number</th>
                            <th>Date</th>
                            <th>Duration</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredCallLog.length > 0 ? filteredCallLog.map(entry => `
                            <tr>
                                <td>${entry.id}</td>
                                <td>${entry.number}</td>
                                <td>${entry.date}</td>
                                <td>${entry.duration}</td>
                                <td>${entry.type}</td>
                            </tr>
                        `).join('') : '<tr><td colspan="5">No results found</td></tr>'}
                    </tbody>
                </table>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    if (loading) {
        return <div className="loader">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="call-log-container">
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
            />
            <button onClick={handlePrint} className="print-button">Print</button>
            <table className="call-log-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Number</th>
                        <th>Date</th>
                        <th>Duration</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCallLog.length > 0 ? (
                        filteredCallLog.map((entry) => (
                            <tr key={entry.id}>
                                <td>{entry.id}</td>
                                <td>{entry.number}</td>
                                <td>{entry.date}</td>
                                <td>{entry.duration}</td>
                                <td>{entry.type}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>No results found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CallLog;
