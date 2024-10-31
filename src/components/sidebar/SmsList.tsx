// src/components/SMSList.tsx
import React, { useEffect, useState } from 'react';
import './SmsList.css'; // Import CSS file for styling
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register the components needed for Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement);

// Updated SMS interface to include sentiment emoji
interface SMS {
  address: string;
  date: string;
  type: 'received' | 'sent';
  body: string;
  isSuspicious: boolean;
  contactName: string | null;
  category: 'normal' | 'fraud' | 'criminal' | 'cyberbullying' | 'threat' | 'negative_sentiment';
  sentimentEmoji: string; // New field for sentiment emoji
}

const SMSList: React.FC = () => {
  const [smsMessages, setSmsMessages] = useState<SMS[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [filteredMessages, setFilteredMessages] = useState<SMS[]>([]);

  useEffect(() => {
    const fetchSMS = async () => {
      try {
        const response = await fetch('http://localhost:3000/sms');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: SMS[] = await response.json();
        setSmsMessages(data);
        setFilteredMessages(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching SMS data:', error);
        setLoading(false);
      }
    };

    fetchSMS();
  }, []);

  useEffect(() => {
    const filtered = smsMessages.filter(sms =>
      (sms.address?.toLowerCase() || '').includes(searchKeyword.toLowerCase()) ||
      (sms.body?.toLowerCase() || '').includes(searchKeyword.toLowerCase())
    );
    setFilteredMessages(filtered);
  }, [searchKeyword, smsMessages]);

  const categoriesCount = filteredMessages.reduce((acc, sms) => {
    acc[sms.category] = (acc[sms.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = {
    labels: Object.keys(categoriesCount),
    datasets: [{
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

  // Function to highlight the search keyword in text
  const highlightText = (text: string | undefined) => {
    if (!text || !searchKeyword) return text; // Check if text is undefined
    const regex = new RegExp(`(${searchKeyword})`, 'gi');
    return text.split(regex).map((part, index) => 
      regex.test(part) ? <span key={index} className="highlight">{part}</span> : part
    );
  };

  return (
    <div className="sms-container">
      <div className="sms-list">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by address or body..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            {filteredMessages.length > 0 ? (
              filteredMessages.map((sms, index) => (
                <div
                  key={index}
                  className={`sms-item ${sms.type} ${sms.category}`}
                >
                  <div className="sms-header">
                    <span className="sms-address">
                      {highlightText(sms.address || 'Unknown')}
                    </span>
                    <span className="sms-date">{sms.date}</span>
                  </div>
                  <div className="sms-body">
                    {highlightText(sms.body)} {/* Highlighted body text */}
                    <span className="sms-emoji">{sms.sentimentEmoji}</span>
                  </div>
                  <div className="sms-category">
                    <strong>Category:</strong> {sms.category}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">No results found</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SMSList;
