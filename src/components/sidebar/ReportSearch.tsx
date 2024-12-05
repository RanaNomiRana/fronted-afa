import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
} from '@mui/material';
import { Search, Print } from '@mui/icons-material';

interface ReportData {
  database: string;
  report: {
    _id: string;
    caseNumber: string;
    remark: string;
    deviceName: string;
    sms: {
      totalMessages: number;
      suspiciousMessages: number;
      fraudMessages: number;
      criminalMessages: number;
      cyberbullyingMessages: number;
      threatMessages: number;
      negativeSentimentMessages: number;
    };
    calls: {
      totalCalls: number;
      incomingCalls: number;
      outgoingCalls: number;
      missedCalls: number;
    };
    contacts: {
      totalContacts: number;
    };
    createdAt: string;
  };
}

const ReportSearch: React.FC = () => {
  const [caseNumber, setCaseNumber] = useState<string>('');
  const [report, setReport] = useState<ReportData | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/find-report/${caseNumber}`);
      setReport(response.data);  // Assuming the API returns data in the structure of ReportData
      setOpen(true); // Open the popup to display the report
    } catch (error) {
      console.error('Error fetching report:', error);
      alert('Report not found. Please try again.');
    }
  };

  const handlePrint = () => {
    const content = document.getElementById('report-content')?.innerHTML;
    if (!content) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write('<html><head><title>Print Report</title></head><body>');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div style={{ padding: 5 }}>
     <TextField
  label="Case Number"
  variant="outlined"
  value={caseNumber}
  onChange={(e) => setCaseNumber(e.target.value)}
  size="small"  // Small size for the TextField
  sx={{
    '& .MuiOutlinedInput-root': {
      padding: '4px',  // Reduce padding inside the TextField
    },
    marginRight: 0,
    width: 'auto', // Adjust width if needed
  }}
/>

      <IconButton color="primary" onClick={handleSearch}>
        <Search />
      </IconButton>

      {/* Popup to display the report */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Report Details</DialogTitle>
        <DialogContent>
          {report ? (
            <div id="report-content">
              <p><strong>Case Number:</strong> {report.report.caseNumber}</p>
              <p><strong>Remark:</strong> {report.report.remark}</p>
              <p><strong>Device Name:</strong> {report.report.deviceName}</p>

              <h3>SMS Data</h3>
              <ul>
                <li>Total Messages: {report.report.sms.totalMessages}</li>
                <li>Suspicious Messages: {report.report.sms.suspiciousMessages}</li>
                <li>Fraud Messages: {report.report.sms.fraudMessages}</li>
                <li>Criminal Messages: {report.report.sms.criminalMessages}</li>
                <li>Cyberbullying Messages: {report.report.sms.cyberbullyingMessages}</li>
                <li>Threat Messages: {report.report.sms.threatMessages}</li>
                <li>Negative Sentiment Messages: {report.report.sms.negativeSentimentMessages}</li>
              </ul>

              <h3>Call Logs</h3>
              <ul>
                <li>Total Calls: {report.report.calls.totalCalls}</li>
                <li>Incoming Calls: {report.report.calls.incomingCalls}</li>
                <li>Outgoing Calls: {report.report.calls.outgoingCalls}</li>
                <li>Missed Calls: {report.report.calls.missedCalls}</li>
              </ul>

              <h3>Contacts</h3>
              <ul>
                <li>Total Contacts: {report.report.contacts.totalContacts}</li>
              </ul>

              <p><strong>Created At:</strong> {new Date(report.report.createdAt).toLocaleString()}</p>
            </div>
          ) : (
            <p>Loading report...</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="primary" onClick={handlePrint} startIcon={<Print />}>
            Print
          </Button>
          <Button variant="contained" color="secondary" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ReportSearch;
