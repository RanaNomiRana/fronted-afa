import React, { useState, useEffect } from 'react';
import { TextField, Button, CircularProgress, Typography, Paper, Box, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { jsPDF } from 'jspdf'; // Import jsPDF

interface ComprehensiveShortReportProps {
  onClose: () => void;
}

const ComprehensiveShortReport: React.FC<ComprehensiveShortReportProps> = ({ onClose }) => {
  const [reportData, setReportData] = useState<any>(null); // State for report data
  const [loading, setLoading] = useState<boolean>(true);   // State for loading spinner
  const [caseNumber, setCaseNumber] = useState<string>(''); // State for case number input
  const [remark, setRemark] = useState<string>('');         // State for remark input
  const [status, setStatus] = useState<string>('');         // State for status message

  // Fetch the short report data from the backend on component mount
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/short-report'); // Backend endpoint for fetching the report
        if (response.data) {
          setReportData(response.data);
        } else {
          setStatus('No report data available.');
        }
      } catch (error) {
        setStatus('Failed to load report data');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const handleCaseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaseNumber(e.target.value);
  };

  const handleRemarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemark(e.target.value);
  };

  const handleSaveReport = async () => {
    if (!caseNumber || !remark) {
      setStatus('Please provide a case number and remark');
      return;
    }

    setStatus('');
    if (!reportData) {
      setStatus('No report data available to save');
      return;
    }

    const reportToSave = {
      caseNumber,
      remark,
      smsData: reportData.sms,
      callData: reportData.calls,
      contactData: reportData.contacts,
      deviceName: reportData.deviceName,
    };

    try {
      await axios.post('http://localhost:3000/short-report', reportToSave); // Saving report to the backend
      setStatus('Report saved successfully!');
    } catch (error) {
      setStatus('Failed to save the report');
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <Typography variant="h6">Loading short report...</Typography>
        <CircularProgress />
      </div>
    );
  }

  // Handle missing report data
  if (!reportData || !reportData.sms || !reportData.calls || !reportData.contacts) {
    return (
      <div style={{ padding: 20 }}>
        <Typography variant="h6">No report data available. Please check the data source.</Typography>
        <Button onClick={onClose} color="secondary" fullWidth>
          Close
        </Button>
      </div>
    );
  }

  // Function to print the report content as PDF
  const printReportAsPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text('Investigation Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Device Name: ${reportData.deviceName}`, 20, 30);

    // Add SMS Data
    doc.text('SMS Data:', 20, 40);
    doc.text(`Total SMS: ${reportData.sms.totalMessages || 0}`, 20, 50);
    doc.text(`Suspicious SMS: ${reportData.sms.suspiciousMessages || 0}`, 20, 60);
    doc.text(`Fraud SMS: ${reportData.sms.fraudMessages || 0}`, 20, 70);
    doc.text(`Criminal SMS: ${reportData.sms.criminalMessages || 0}`, 20, 80);
    doc.text(`Cyberbullying SMS: ${reportData.sms.cyberbullyingMessages || 0}`, 20, 90);
    doc.text(`Threat SMS: ${reportData.sms.threatMessages || 0}`, 20, 100);
    doc.text(`Negative Sentiment SMS: ${reportData.sms.negativeSentimentMessages || 0}`, 20, 110);

    // Add Call Data
    doc.text('Call Data:', 20, 120);
    doc.text(`Total Calls: ${reportData.calls.totalCalls || 0}`, 20, 130);
    doc.text(`Incoming Calls: ${reportData.calls.incomingCalls || 0}`, 20, 140);
    doc.text(`Outgoing Calls: ${reportData.calls.outgoingCalls || 0}`, 20, 150);
    doc.text(`Missed Calls: ${reportData.calls.missedCalls || 0}`, 20, 160);

    
   

    // Save PDF
    doc.save('investigation-report.pdf');
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h5" gutterBottom>
        Investigation Report for Device: {reportData.deviceName}
      </Typography>

      <Box>
        {/* Report Overview */}
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
          <Typography variant="h6">Short Report Overview</Typography>
          <Typography variant="body1">Total SMS: {reportData.sms.totalMessages || 0}</Typography>
          <Typography variant="body1">Suspicious SMS: {reportData.sms.suspiciousMessages || 0}</Typography>
          <Typography variant="body1">Fraud SMS: {reportData.sms.fraudMessages || 0}</Typography>
          <Typography variant="body1">Criminal SMS: {reportData.sms.criminalMessages || 0}</Typography>
          <Typography variant="body1">Cyberbullying SMS: {reportData.sms.cyberbullyingMessages || 0}</Typography>
          <Typography variant="body1">Threat SMS: {reportData.sms.threatMessages || 0}</Typography>
          <Typography variant="body1">Negative Sentiment SMS: {reportData.sms.negativeSentimentMessages || 0}</Typography>

          <Typography variant="body1">Total Calls: {reportData.calls.totalCalls || 0}</Typography>
          <Typography variant="body1">Incoming Calls: {reportData.calls.incomingCalls || 0}</Typography>
          <Typography variant="body1">Outgoing Calls: {reportData.calls.outgoingCalls || 0}</Typography>
          <Typography variant="body1">Missed Calls: {reportData.calls.missedCalls || 0}</Typography>

          <Typography variant="body1">Total Contacts: {reportData.contacts.totalContacts || 0}</Typography>
        </Paper>

        {/* Case Number and Remark */}
        <Card>
          <CardContent>
            <Typography variant="h6">Add Case Number and Remark</Typography>
            <TextField
              label="Case Number"
              variant="outlined"
              fullWidth
              value={caseNumber}
              onChange={handleCaseNumberChange}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Add Remark"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              value={remark}
              onChange={handleRemarkChange}
              sx={{ marginBottom: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleSaveReport} fullWidth>
              Save Report
            </Button>
            {status && <Typography variant="body1" sx={{ marginTop: 2 }}>{status}</Typography>}
          </CardContent>
        </Card>

        <Button onClick={onClose} color="secondary" sx={{ marginTop: 2 }} fullWidth>
          Close
        </Button>
        <Button onClick={printReportAsPDF} color="primary" sx={{ marginTop: 2 }} fullWidth>
          Print Report as PDF
        </Button>
      </Box>
    </div>
  );
};

export default ComprehensiveShortReport;
