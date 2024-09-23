// src/components/SMSAnalytics.tsx
import React, { useEffect, useState, useRef } from 'react';
import './SmsList.css'; // Import CSS file for styling
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import Draggable from 'react-draggable';

// Register the components needed for Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

interface SMS {
  address: string;
  date: string;
  type: 'received' | 'sent';
  body: string;
  isSuspicious: boolean;
  contactName: string | null;
  category: 'normal' | 'fraud' | 'criminal' | 'cyberbullying' | 'threat' | 'negative_sentiment';
}

const SMSAnalytics: React.FC = () => {
  const [smsMessages, setSmsMessages] = useState<SMS[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const chartRef = useRef<any>(null); // Reference to the Bar chart

  useEffect(() => {
    // Fetch SMS messages from the API
    const fetchSMS = async () => {
      try {
        const response = await fetch('http://localhost:3000/sms');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: SMS[] = await response.json();
        setSmsMessages(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching SMS data:', error);
        setLoading(false);
      }
    };

    fetchSMS();
  }, []);

  // Prepare data for the bar chart
  const categoriesCount = smsMessages.reduce((acc, sms) => {
    acc[sms.category] = (acc[sms.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = {
    labels: Object.keys(categoriesCount),
    datasets: [{
      label: 'SMS Count by Category',
      data: Object.values(categoriesCount),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
      ],
      borderColor: '#fff',
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const category = context.label;
            const count = context.raw;
            const addresses = smsMessages
              .filter(sms => sms.category === category)
              .map(sms => sms.address || 'Unknown')
              .join(', ');

            return `Category: ${category}, Count: ${count}, Addresses: ${addresses}`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  // Handle click on chart to filter SMS messages by category
  const handleCategoryClick = (event: any) => {
    const activeElement = event.active[0];
    if (activeElement) {
      const category = activeElement._model.label;
      setSelectedCategory(category);
    }
  };

  // Define detected categories
  const detectedCategories = ['fraud', 'criminal', 'cyberbullying', 'threat', 'negative_sentiment'];

  // Filter messages based on selected category and detected categories
  const filteredMessages = selectedCategory
    ? smsMessages.filter(sms => sms.category === selectedCategory && detectedCategories.includes(sms.category))
    : smsMessages.filter(sms => detectedCategories.includes(sms.category));

  // Function to print the page
  const handlePrint = () => {
    const canvas = chartRef.current?.chartInstance?.toBase64Image();
    const printWindow = window.open('', '', 'height=800,width=1200');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Preview</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
              .chart-container { padding: 20px; }
              .draggable-chart { width: 100%; margin-bottom: 20px; }
              .details-container { width: 100%; }
              .address-item.fraud,
              .address-item.criminal,
              .address-item.cyberbullying,
              .address-item.threat,
              .address-item.negative_sentiment {
                color: red;
              }
              @page { size: auto; margin: 20mm; }
            </style>
          </head>
          <body>
            <div class="chart-container">
              <h1>SMS Analytics</h1>
              <div class="draggable-chart">
                ${canvas ? `<img src="${canvas}" alt="Chart" style="width: 100%; height: auto;" />` : ''}
              </div>
              <div class="details-container">
                <h3>Details in Detected Categories: ${selectedCategory || 'All'}</h3>
                <ul>
                  ${filteredMessages.map(sms => `
                    <li class="address-item ${sms.category}">
                      <strong>Address:</strong> ${sms.address || 'Unknown'}<br />
                      <strong>Date:</strong> ${sms.date}<br />
                      <strong>Type:</strong> ${sms.type}<br />
                      <strong>Body:</strong> ${sms.body}<br />
                      <strong>Suspicious:</strong> ${sms.isSuspicious ? 'Yes' : 'No'}<br />
                      <strong>Contact Name:</strong> ${sms.contactName || 'N/A'}
                    </li>
                  `).join('')}
                </ul>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="chart-container">
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <>
          <button className="print-button" onClick={handlePrint}>Print</button>
          <Draggable>
            <div className="draggable-chart">
              <Bar 
                data={chartData} 
                options={chartOptions}
                ref={chartRef}
                onElementsClick={handleCategoryClick}
              />
            </div>
          </Draggable>
          <div className="details-container">
            <h3>Details in Detected Categories: {selectedCategory || 'All'}</h3>
            <div className="address-list">
              <ul>
                {filteredMessages.map((sms, index) => (
                  <li
                    key={index}
                    className={`address-item ${sms.category}`}
                  >
                    <strong>Address:</strong> {sms.address || 'Unknown'}<br />
                    <strong>Date:</strong> {sms.date}<br />
                    <strong>Type:</strong> {sms.type}<br />
                    <strong>Body:</strong> {sms.body}<br />
                    <strong>Suspicious:</strong> {sms.isSuspicious ? 'Yes' : 'No'}<br />
                    <strong>Contact Name:</strong> {sms.contactName || 'N/A'}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SMSAnalytics;
