import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper,
  Typography,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportData {
  deviceName: string;
  smsData: any[];
  callLogs: any[];
  contacts: any[];
  smsStats: any;
  callStats: any;
  timelineAnalysis: any[];
  smsWithUrls: any[];
  dataCorrelationResults: any[];
}

interface PDFReportProps {
  reportName: string;
}

const PDFReport: React.FC<PDFReportProps> = ({ reportName }) => {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [remarks, setRemarks] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get('http://localhost:8000/comprehensive-report');
        setReport(response.data);
      } catch (err) {
        setError('Error fetching report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const handleSaveAsPDF = () => {
    if (!report) return;

    const doc = new jsPDF();
    doc.text(`Comprehensive Report for ${report.deviceName}`, 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [['Category', 'Value']],
      body: [
        ['Total SMS', report.smsStats.totalMessages || 0],
        ['Suspicious SMS', report.smsStats.suspiciousMessages || 0],
        ['Total Calls', report.callStats.totalCalls || 0],
        ['Incoming Calls', report.callStats.incomingCalls || 0],
        ['Outgoing Calls', report.callStats.outgoingCalls || 0],
        ['Missed Calls', report.callStats.missedCalls || 0],
        // Add more data as needed
      ],
    });

    doc.text('Remarks:', 14, doc.autoTable.previous.finalY + 10);
    doc.text(remarks, 14, doc.autoTable.previous.finalY + 20);

    doc.save(`${reportName}.pdf`);
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => setRemarks(event.target.value);

  if (loading) {
    return (
      <Paper style={{ padding: 20, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6">Loading report...</Typography>
      </Paper>
    );
  }

  if (error) {
    return <Typography color="error" style={{ padding: 20 }}>{error}</Typography>;
  }

  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h4">Comprehensive Report</Typography>
      <Typography variant="h6">Device Name: {report?.deviceName}</Typography>
      <Button variant="contained" color="primary" onClick={handleOpenDialog} style={{ marginTop: 20 }}>
        Add Remark
      </Button>
      <Button variant="contained" color="secondary" onClick={handleSaveAsPDF} style={{ marginTop: 20, marginLeft: 10 }}>
        Save as PDF
      </Button>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add Remark</DialogTitle>
        <DialogContent>
          <TextField
            label="Remark"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={remarks}
            onChange={handleRemarksChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => { handleSaveAsPDF(); handleCloseDialog(); }} color="primary">
            Save with Remark
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h6" style={{ marginTop: 20 }}>SMS Data</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Body</TableCell>
              <TableCell>Is Suspicious</TableCell>
              <TableCell>Sentiment Emoji</TableCell>
              <TableCell>Category</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {report?.smsData.map((sms, index) => (
              <TableRow key={index}>
                <TableCell>{sms.address}</TableCell>
                <TableCell>{sms.date}</TableCell>
                <TableCell>{sms.type}</TableCell>
                <TableCell>{sms.body}</TableCell>
                <TableCell>{sms.isSuspicious ? 'Yes' : 'No'}</TableCell>
                <TableCell>{sms.sentimentEmoji}</TableCell>
                <TableCell>{sms.category}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add other sections such as Call Logs, Contacts, etc. similarly */}

    </Paper>
  );
};

export default PDFReport;
