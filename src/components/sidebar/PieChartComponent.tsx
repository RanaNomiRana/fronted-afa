import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

interface CallDetail {
    number: string;
    type: string;
    duration: string;
}

interface TimelineData {
    date: string;
    totalMessages: number;
    suspiciousMessages: number;
    smsDetails: any[];
    totalCalls: number;
    incomingCalls: number;
    outgoingCalls: number;
    missedCalls: number;
    callDetails: CallDetail[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6699', '#FFCC99'];

const TimelineAndPieChartComponent: React.FC = () => {
    const [data, setData] = useState<TimelineData[]>([]);
    const [pieData, setPieData] = useState<any[]>([]);
    const [lineData, setLineData] = useState<any[]>([]);

    useEffect(() => {
        const fetchTimelineData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/timeline-analysis');
                const fetchedData: TimelineData[] = response.data.timeline;
                setData(fetchedData);

                // Aggregate data for the pie chart
                const totalMessages = fetchedData.reduce((sum, entry) => sum + entry.totalMessages, 0);
                const suspiciousMessages = fetchedData.reduce((sum, entry) => sum + entry.suspiciousMessages, 0);
                const totalCalls = fetchedData.reduce((sum, entry) => sum + entry.totalCalls, 0);
                const incomingCalls = fetchedData.reduce((sum, entry) => sum + entry.incomingCalls, 0);
                const outgoingCalls = fetchedData.reduce((sum, entry) => sum + entry.outgoingCalls, 0);
                const missedCalls = fetchedData.reduce((sum, entry) => sum + entry.missedCalls, 0);

                setPieData([
                    { name: 'Total Messages', value: totalMessages },
                    { name: 'Suspicious Messages', value: suspiciousMessages },
                    { name: 'Total Calls', value: totalCalls },
                    { name: 'Incoming Calls', value: incomingCalls },
                    { name: 'Outgoing Calls', value: outgoingCalls },
                    { name: 'Missed Calls', value: missedCalls },
                ]);

                // Prepare data for the line chart
                setLineData(fetchedData.map(entry => ({
                    date: entry.date,
                    totalMessages: entry.totalMessages,
                    suspiciousMessages: entry.suspiciousMessages,
                    totalCalls: entry.totalCalls,
                    incomingCalls: entry.incomingCalls,
                    outgoingCalls: entry.outgoingCalls,
                    missedCalls: entry.missedCalls,
                })));
            } catch (error) {
                console.error('Error fetching timeline data:', error);
            }
        };

        fetchTimelineData();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <div>
                {/* Pie Chart Section */}
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={100}
                            fill="#8884d8"
                            label
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div>
                {/* Line Chart Section */}
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line type="monotone" dataKey="totalMessages" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="suspiciousMessages" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="totalCalls" stroke="#ffc658" />
                        <Line type="monotone" dataKey="incomingCalls" stroke="#ff7300" />
                        <Line type="monotone" dataKey="outgoingCalls" stroke="#ff6666" />
                        <Line type="monotone" dataKey="missedCalls" stroke="#d0ed57" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TimelineAndPieChartComponent;
