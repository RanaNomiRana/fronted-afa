// CallLogChart.tsx
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

interface CallLog {
  id: string;
  number: string; // Add number to display in tooltip
  duration: string; // Expecting format like "5m" for 5 minutes
}

const CallLogChart: React.FC = () => {
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCallLogs = async () => {
      try {
        const response = await fetch('http://localhost:3000/call-log');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: CallLog[] = await response.json();
        setCallLogs(data);
      } catch (error) {
        console.error('Error fetching call log data:', error);
        setError('Error fetching call log data');
      } finally {
        setLoading(false);
      }
    };

    fetchCallLogs();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Prepare data for the chart
  const totalDuration = callLogs.map(log => parseInt(log.duration.split('m')[0]) || 0);
  const chartData = {
    labels: Array(callLogs.length).fill(''), // Empty labels to hide x-axis labels
    datasets: [
      {
        label: 'Call Duration (Minutes)',
        data: totalDuration,
        backgroundColor: 'rgba(38, 194, 129, 0.7)', // Greenish color
        borderColor: 'rgba(38, 194, 129, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#333',
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const index = tooltipItem.dataIndex;
            const duration = totalDuration[index];
            const number = callLogs[index].number;
            return [`Number: ${number}`, `Duration: ${duration} min`];
          },
        },
        backgroundColor: '#333',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#fff',
        borderWidth: 1,
      },
      title: {
        display: true,
        text: 'Call Duration Analysis',
        font: {
          size: 18,
        },
        color: '#333',
      },
    },
    scales: {
      x: {
        display: false, // Hide the x-axis
      },
      y: {
        title: {
          display: true,
          text: 'Duration (Minutes)',
          color: '#333',
        },
        ticks: {
          color: '#333',
          beginAtZero: true,
        },
      },
    },
  };

  return (
    <div className="call-log-chart" style={{ maxWidth: '600px', margin: 'auto' }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default CallLogChart;
