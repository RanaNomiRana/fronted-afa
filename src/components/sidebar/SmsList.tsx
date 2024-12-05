import React, { useEffect, useState } from 'react';
import './SmsList.css'; // Import CSS file for styling
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

interface SMS {
  address: string;
  date: string;
  type: 'received' | 'sent';
  body: string;
  isSuspicious: boolean;
  contactName: string | null;
  category: 'normal' | 'fraud' | 'criminal' | 'cyberbullying' | 'threat' | 'negative_sentiment';
  sentimentEmoji: string;
}

const SMSList: React.FC = () => {
  const [smsMessages, setSmsMessages] = useState<SMS[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [filteredMessages, setFilteredMessages] = useState<SMS[]>([]);

  const [selectedType, setSelectedType] = useState<'all' | 'received' | 'sent'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchSMS = async () => {
      try {
        const response = await axios.get('http://localhost:3000/sms');
        const data: SMS[] = response.data;

        const validSmsData = data.filter(sms => sms.address && sms.body);
        setSmsMessages(validSmsData);
        setFilteredMessages(validSmsData);
      } catch (error) {
        console.error('Error fetching SMS data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSMS();
  }, []);

  useEffect(() => {
    const filtered = smsMessages.filter(sms => {
      const matchesKeyword =
        (sms.address?.toLowerCase() || '').includes(searchKeyword.toLowerCase()) ||
        (sms.body?.toLowerCase() || '').includes(searchKeyword.toLowerCase());

      const matchesType = selectedType === 'all' || sms.type === selectedType;

      const matchesCategory = selectedCategory === 'all' || sms.category === selectedCategory;

      return matchesKeyword && matchesType && matchesCategory;
    });

    setFilteredMessages(filtered);
  }, [searchKeyword, selectedType, selectedCategory, smsMessages]);

  const categoriesCount = filteredMessages.reduce((acc, sms) => {
    acc[sms.category] = (acc[sms.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = {
    labels: Object.keys(categoriesCount),
    datasets: [
      {
        data: Object.values(categoriesCount),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  const highlightText = (text: string | undefined) => {
    if (!text || !searchKeyword) return text;
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

            <div className="filters">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as 'all' | 'received' | 'sent')}
              >
                <option value="all">All Types</option>
                <option value="received">Received</option>
                <option value="sent">Sent</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="normal">Normal</option>
                <option value="fraud">Fraud</option>
                <option value="criminal">Criminal</option>
                <option value="cyberbullying">Cyberbullying</option>
                <option value="threat">Threat</option>
                <option value="negative_sentiment">Negative Sentiment</option>
              </select>
            </div>

            {filteredMessages.length > 0 ? (
              filteredMessages.map((sms, index) => (
                <div key={index} className={`sms-item ${sms.type} ${sms.category}`}>
                  <div className="sms-header">
                    <span className="sms-address">
                      {highlightText(sms.address || 'Unknown')}
                    </span>
                    <span className="sms-date">{sms.date}</span>
                  </div>
                  <div className="sms-body">
                    {highlightText(sms.body || 'No message content')}
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

      {filteredMessages.length > 0 && (
        <div className="chart-container">
          <h2>SMS Category Distribution</h2>
          <Pie data={chartData} />
        </div>
      )}
    </div>
  );
};

export default SMSList;
