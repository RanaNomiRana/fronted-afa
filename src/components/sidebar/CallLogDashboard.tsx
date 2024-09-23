// src/Contacts.tsx

import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './Contacts.css'; // Import CSS file

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

interface Contact {
  number: string;
  display_name: string;
}

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);

  useEffect(() => {
    // Fetch contacts from the backend
    const fetchContacts = async () => {
      try {
        const response = await axios.get<Contact[]>('http://localhost:3000/contacts');
        setContacts(response.data);
        setFilteredContacts(response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    // Filter contacts based on search term
    setFilteredContacts(
      contacts.filter(contact =>
        (contact.display_name && contact.display_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (contact.number && contact.number.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }, [searchTerm, contacts]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=800,width=1200');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Print Contacts</title>');
      printWindow.document.write('<style>');
      printWindow.document.write(`
        .print-container {
          width: 100%;
          height: auto;
          box-shadow: none;
          padding: 20px;
          background-color: #fff;
          font-family: Arial, sans-serif;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .contacts-list {
          width: 100%;
          border-collapse: collapse;
        }
        .contacts-list th,
        .contacts-list td {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: left;
        }
        .contacts-list th {
          background-color: #f8f9fa;
        }
        .contacts-list tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .contacts-list tr:hover {
          background-color: #e9ecef;
        }
        .contacts-list td {
          white-space: nowrap;
        }
        .search-input,
        .print-button-container {
          display: none;
        }
      `);
      printWindow.document.write('</style></head><body>');
      printWindow.document.write('<div class="print-container">');
      printWindow.document.write('<div class="header"><h1>Contacts List</h1></div>');
      printWindow.document.write('<table class="contacts-list">');
      printWindow.document.write('<thead><tr><th>Name</th><th>Phone Number</th></tr></thead>');
      printWindow.document.write('<tbody>');
      filteredContacts.forEach(contact => {
        printWindow.document.write(`<tr><td>${contact.display_name || 'Unknown'}</td><td>${contact.number || 'No phone number'}</td></tr>`);
      });
      printWindow.document.write('</tbody></table>');
      printWindow.document.write('</div></body></html>');
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  // Prepare data for pie chart
  const chartData = {
    labels: filteredContacts.map(contact => contact.display_name || 'Unknown'),
    datasets: [{
      data: filteredContacts.map(() => 1), // Example: each contact is counted as 1
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    }]
  };

  return (
    <div className="contacts-container">
      <h1 className="contacts-header">Contacts</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
        placeholder="Search contacts by name or number"
      />
      <div className="print-button-container">
        <button onClick={handlePrint} className="print-button">Print All Contacts</button>
      </div>
      <div className="main-content">
        <ul className="contacts-list">
          {filteredContacts.map((contact, index) => (
            <li key={index} className="contact-item">
              <span className="contact-name">{contact.display_name || 'Unknown'}</span> - <span className="contact-phone">{contact.number || 'No phone number'}</span>
            </li>
          ))}
        </ul>
        <div className="chart-container">
          <Pie data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default Contacts;
