import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './reportpage.css';
import { Button } from '@mui/material';
import { Add, Visibility, ShowChart , Edit} from '@mui/icons-material';
import PieChartComponent from './PieChartComponent';
import DataCorrelationVisualization from './DataCorrelationVisualization';
import CallLogChart from './CallLogChart';

import { ReportData, SMSStats, CallStats, TimelineAnalysisItem, SMSWithUrl, DataCorrelationResult } from './types'; // Adjust import path as needed

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const ReportPage: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch('http://localhost:3000/comprehensive-report');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: ReportData = await response.json();
        setReportData(data);
      } catch (error) {
        console.error('Error fetching report data:', error);
        setReportData(null); // Set data to null if there's an error
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!reportData) {
    return (
      <>
      <div className="error">
        No device Connected. <br />
        <Button variant="contained"  startIcon={<Visibility />}>
          Show Previous Case
        </Button>
        {/* i will add the PreviousCasePopup */}
      </div>

<div style={{ padding: 9 }}>
<Button
  variant="contained"
  startIcon={<ShowChart />}
>
  Show Previous Data
</Button>
{/* i wil add the PreviousDataPopup */}
</div>
</>
    );
  }

  const { smsStats, callStats, timelineAnalysis, smsWithUrls, dataCorrelationResults } = reportData;

  // Data for Pie Charts
  const smsChartData = smsStats ? {
    labels: ['Total Messages', 'Suspicious Messages', 'Fraud', 'Criminal', 'Cyberbullying', 'Threat', 'Negative Sentiment'],
    datasets: [
      {
        data: [
          smsStats.totalMessages,
          smsStats.suspiciousMessages,
          smsStats.fraud,
          smsStats.criminal,
          smsStats.cyberbullying,
          smsStats.threat,
          smsStats.negative_sentiment
        ],
        backgroundColor: [
          '#007bff', // Blue
          '#dc3545', // Red
          '#28a745', // Green
          '#ffc107', // Yellow
          '#6f42c1', // Purple
          '#20c997', // Teal
          '#fd7e14'  // Orange
        ],
      },
    ],
  } : {};
  
  const callChartData = callStats ? {
    labels: ['Total Calls', 'Incoming Calls', 'Outgoing Calls', 'Missed Calls'],
    datasets: [
      {
        data: [
          callStats.totalCalls,
          callStats.incomingCalls,
          callStats.outgoingCalls,
          callStats.missedCalls
        ],
        backgroundColor: [
          '#007bff', // Blue
          '#dc3545', // Red
          '#28a745', // Green
          '#ffc107'  // Yellow
        ],
      },
    ],
  } : {};

  const urlSmsChartData = smsWithUrls.length > 0 ? {
    labels: smsWithUrls.map(sms => sms.address),
    datasets: [
      {
        data: smsWithUrls.map(sms => sms.body.length),
        backgroundColor: '#28a745', // Green
      },
    ],
  } : {};

  const dataCorrelationChartData = dataCorrelationResults.length > 0 ? {
    labels: dataCorrelationResults.map(result => result.number || 'Unknown'),
    datasets: [
      {
        data: dataCorrelationResults.map(result => result.smsCount),
        backgroundColor: '#ffc107', // Yellow
      },
    ],
  } : {};

  const callLogsData = dataCorrelationResults.flatMap(result =>
    result.callLogs.map(call => ({
      number: result.number,
      date: call.date,
      duration: call.duration,
      type: call.type
    }))
  );

  const callLogsChartData = callLogsData.length > 0 ? {
    datasets: [
      {
        data: callLogsData.map(call => parseInt(call.duration.split('m')[0]) || 0), // Extract minutes from duration
        backgroundColor: '#dc3545', // Red
      },
    ],
  } : {};

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: 'black',
        }, 
      },
      tooltip: {
        bodyColor: 'white',
        titleColor: 'white',
      },
    },
  };

  return (
    <div className="report-page">
      <div className="open-form d-flex align-content-center justify-content-between flex-row">
        <div style={{ padding: 9 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
          >
            Register this Case
          </Button>

          {/* i will add the popup component */}
        </div>

        <div style={{ padding: 9 }}>
          <Button
            variant="contained"
             startIcon={<Visibility />}
          >
            Show Previous Case
          </Button>
          {/* i will add the previous case popup */}
        </div>

        <div style={{ padding: 9 }}>
          <Button
            variant="contained"
             startIcon={<ShowChart />}
          >
            Show Previous Data
          </Button>
          {/* i will add the PreviousDataPopup component */}
        </div>

        <div style={{ padding: 9 }}>
  <Button
    variant="contained"
    startIcon={<Edit />} // Add the Edit icon here
  >
    Add Remark
  </Button>
  {/* i will add the add remark component */}
</div>

      </div>

      <div className="charts-grid">
        <div className="chart-section">
          <h2>SMS Statistics</h2>
          <div className="chart-containeraf">
            {smsStats ? <Pie data={smsChartData} options={chartOptions} /> : <p>No SMS data available.</p>}
          </div>
        </div>

        <div className="chart-section">
          <h2>Call Statistics</h2>
          <div className="chart-containeraf">
            {callStats ? <Pie data={callChartData} options={chartOptions} /> : <p>No call data available.</p>}
          </div>
        </div>

        <div className="chart-section">
          <h2>Timeline Analysis</h2>
          <div className="chart-containeraf">
            {timelineAnalysis.length > 0 ? <PieChartComponent /> : <p>No timeline data available.</p>}
          </div>
        </div>

        <div className="chart-section">
          <h2>Data Correlation</h2>
          <div className="chart-containeraf">
            {dataCorrelationResults.length > 0 ? <DataCorrelationVisualization /> : <p>No data correlation results available.</p>}
          </div>
        </div>

        <div className="chart-section">
          <h2>Call Logs</h2>
          <div className="chart-containeraf">
            {callLogsData.length > 0 ? <CallLogChart /> : <p>No call logs available.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
