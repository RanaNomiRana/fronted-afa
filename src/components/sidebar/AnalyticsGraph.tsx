import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import './AnalyticsGraph.css'; // Import the CSS file

// Register chart components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Define TypeScript types for call log data
interface CallLog {
  duration: string;
  number: string;
  date: string;
  type: string;
}

// Component props type
interface AnalyticsGraphProps {}

// AnalyticsGraph component
const AnalyticsGraph: React.FC<AnalyticsGraphProps> = () => {
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch call log data from API
    axios.get<CallLog[]>('http://localhost:3000/call-log')
      .then(response => {
        setCallLogs(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching call logs:', error);
        setError('Error fetching call logs');
        setLoading(false);
      });
  }, []);

  // Process data to count call types
  const callTypeCounts = callLogs.reduce((acc, log) => {
    acc[log.type] = (acc[log.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Prepare data for the chart
  const chartData = {
    labels: Object.keys(callTypeCounts),
    datasets: [
      {
        label: 'Call Types',
        data: Object.values(callTypeCounts),
        backgroundColor: '#42a5f5',
        borderColor: '#1e88e5',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="analytics-graph-container">
      <h1>Call Log Analytics</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && <Bar data={chartData} />}
    </div>
  );
};

export default AnalyticsGraph;
