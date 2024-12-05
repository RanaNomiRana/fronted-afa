import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import TimelineAndPieChartComponent from './PieChartComponent'; // Import the PieChart component
import './TimelineAnalysis.css'; // Import your CSS file

interface SmsDetail {
    address: string;
    body: string;
    contactName: string | null;
    category: string;
    isSuspicious: boolean;
    sentimentEmoji: string;
}

interface CallDetail {
    number: string;
    type: string;
    duration: string;
}

interface TimelineEntry {
    date: string;
    totalMessages: number;
    suspiciousMessages: number;
    smsDetails: SmsDetail[]; // Added SMS details
    totalCalls: number;
    incomingCalls: number;
    outgoingCalls: number;
    missedCalls: number;
    callDetails: CallDetail[]; // Added Call details
}

const TimelineAnalysis: React.FC = () => {
    const [timelineData, setTimelineData] = useState<TimelineEntry[]>([]);
    const [filteredTimelineData, setFilteredTimelineData] = useState<TimelineEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    useEffect(() => {
        const fetchTimelineData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/timeline-analysis');
                setTimelineData(response.data.timeline);  // Update this to access the timeline field from response
                setFilteredTimelineData(response.data.timeline); // Update this to access the timeline field from response
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch timeline data.');
                setLoading(false);
            }
        };

        fetchTimelineData();
    }, []);

    useEffect(() => {
        const filtered = timelineData.filter(entry => {
            const entryDate = new Date(entry.date);
            const start = new Date(startDate);
            const end = new Date(endDate);

            return (!startDate || entryDate >= start) && (!endDate || entryDate <= end);
        });

        setFilteredTimelineData(filtered);
    }, [startDate, endDate, timelineData]);

    const handleStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
    };

    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        if (!printWindow) return;

        printWindow.document.open();
        printWindow.document.write(`
            <html>
            <head>
                <title>Print Timeline Analysis</title>
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
                <h1>Timeline Analysis</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Total Messages</th>
                            <th>Suspicious Messages</th>
                            <th>Total Calls</th>
                            <th>Incoming Calls</th>
                            <th>Outgoing Calls</th>
                            <th>Missed Calls</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredTimelineData.length > 0 ? filteredTimelineData.map(entry => `
                            <tr>
                                <td>${entry.date}</td>
                                <td>${entry.totalMessages}</td>
                                <td>${entry.suspiciousMessages}</td>
                                <td>${entry.totalCalls}</td>
                                <td>${entry.incomingCalls}</td>
                                <td>${entry.outgoingCalls}</td>
                                <td>${entry.missedCalls}</td>
                            </tr>
                        `).join('') : '<tr><td colspan="7">No data available</td></tr>'}
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

    // Prepare data for the pie chart
    const pieChartData = [
        { label: 'Total Messages', value: filteredTimelineData.reduce((acc, entry) => acc + entry.totalMessages, 0) },
        { label: 'Suspicious Messages', value: filteredTimelineData.reduce((acc, entry) => acc + entry.suspiciousMessages, 0) },
        { label: 'Total Calls', value: filteredTimelineData.reduce((acc, entry) => acc + entry.totalCalls, 0) },
        { label: 'Incoming Calls', value: filteredTimelineData.reduce((acc, entry) => acc + entry.incomingCalls, 0) },
        { label: 'Outgoing Calls', value: filteredTimelineData.reduce((acc, entry) => acc + entry.outgoingCalls, 0) },
        { label: 'Missed Calls', value: filteredTimelineData.reduce((acc, entry) => acc + entry.missedCalls, 0) },
    ];

    return (
        <div className="timeline-container">
            <h1>Timeline Analysis</h1>
            <div className="date-filters">
                <input
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="date-input"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="date-input"
                />
                <button onClick={handlePrint} className="print-button">Print</button>
            </div>
            <div className="timeline-content">
                <table className="timeline-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Total Messages</th>
                            <th>Suspicious Messages</th>
                            <th>Total Calls</th>
                            <th>Incoming Calls</th>
                            <th>Outgoing Calls</th>
                            <th>Missed Calls</th>
                            <th>SMS Details</th>
                            <th>Call Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTimelineData.length > 0 ? (
                            filteredTimelineData.map((entry) => (
                                <tr key={entry.date}>
                                    <td>{entry.date}</td>
                                    <td>{entry.totalMessages}</td>
                                    <td>{entry.suspiciousMessages}</td>
                                    <td>{entry.totalCalls}</td>
                                    <td>{entry.incomingCalls}</td>
                                    <td>{entry.outgoingCalls}</td>
                                    <td>{entry.missedCalls}</td>
                                    <td>
                                        {entry.smsDetails.length > 0 ? (
                                            <ul>
                                                {entry.smsDetails.map((sms, index) => (
                                                    <li key={index}>
                                                        {sms.body} - {sms.address}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            'No SMS Data'
                                        )}
                                    </td>
                                    <td>
                                        {entry.callDetails.length > 0 ? (
                                            <ul>
                                                {entry.callDetails.map((call, index) => (
                                                    <li key={index}>
                                                        {call.type} call to {call.number} - {call.duration}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            'No Call Data'
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9}>No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="chart-section">
                    <TimelineAndPieChartComponent data={pieChartData} />
                </div>
            </div>
        </div>
    );
};

export default TimelineAnalysis;
