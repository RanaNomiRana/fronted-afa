// src/Analytics.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale } from 'chart.js';
import './Canalytis.css'; // Import CSS file

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);

interface Contact {
  number: string;
  display_name: string;
}

const Canalytics: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    // Fetch contacts from the backend
    const fetchContacts = async () => {
      try {
        const response = await axios.get<Contact[]>('http://localhost:3000/contacts');
        setContacts(response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  // Prepare data for pie chart
  const pieChartData = {
    labels: contacts.map(contact => contact.display_name || 'Unknown'),
    datasets: [{
      data: contacts.map(() => 1), // Example: each contact is counted as 1
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    }]
  };

  // Prepare data for bar chart
  const groupByInitial = (contacts: Contact[]) => {
    const initialGroups: { [key: string]: number } = {};
    contacts.forEach(contact => {
      const initial = contact.display_name?.charAt(0).toUpperCase() || 'Unknown';
      if (initial in initialGroups) {
        initialGroups[initial]++;
      } else {
        initialGroups[initial] = 1;
      }
    });
    return initialGroups;
  };

  const barChartData = () => {
    const groupedData = groupByInitial(contacts);
    return {
      labels: Object.keys(groupedData),
      datasets: [{
        label: 'Number of Contacts',
        data: Object.values(groupedData),
        backgroundColor: '#36A2EB',
      }]
    };
  };

  return (
    <div className="analytics-container">
      <h1 className="analytics-header">Analytics</h1>
      <div className="charts-container">
        <div className="pie-chart-container">
          <Pie data={pieChartData} />
        </div>
        <div className="bar-chart-container">
          <h2>Contact Count by Initial</h2>
          <Bar data={barChartData()} />
        </div>
      </div>
    </div>
  );
};

export default Canalytics;
