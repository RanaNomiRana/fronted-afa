// DataCorrelationVisualization.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface CallLog {
    date: string;
    type: string;
    duration: number;
}

interface CorrelatedData {
    number: string;
    smsCount: number;
    callLogs: CallLog[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6699', '#FFCC99'];

const DataCorrelationVisualization: React.FC = () => {
    const [data, setData] = useState<CorrelatedData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/data-correlation');
                setData(response.data);
            } catch (err) {
                setError('Error fetching data');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Prepare data for Pie Chart
    const pieData = data.map(item => ({
        name: item.number,
        value: item.smsCount
    }));

    // Prepare data for Bar Chart (total SMS and call counts per number)
    const barData = data.map(item => ({
        number: item.number,
        smsCount: item.smsCount,
        totalCalls: item.callLogs.length
    }));

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ padding: '20px' }}>

           

            <div>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                        data={barData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="number" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="smsCount" fill="#8884d8" name="SMS Count" />
                        <Bar dataKey="totalCalls" fill="#82ca9d" name="Total Calls" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DataCorrelationVisualization;
