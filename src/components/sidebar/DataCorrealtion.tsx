import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Button,
  TablePagination,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Define the structure of a call log entry
interface CallLog {
  number: string;
  type: 'incoming' | 'outgoing' | 'missed';
  date: string;
  duration?: number;
}

// Define the structure of an SMS entry
interface SmsMessage {
  body: string;
  date: string;
}

// Define the structure of the data correlation
interface DataCorrelation {
  number: string;
  smsCount: number;
  messages?: SmsMessage[];
  callLogs?: CallLog[];
}

// Styled components
const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const TableHeader = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
}));

const NoData = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.spacing(2),
}));

const Spinner = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(2),
}));

const LogsContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  overflowX: 'auto',
  maxHeight: '200px',
}));

const LogItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const LogHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
}));

const PrintButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const Highlight = styled('span')({
  backgroundColor: 'yellow', // Highlight color
});

const DataCorrelationPage: React.FC = () => {
  const [data, setData] = useState<DataCorrelation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  // Search state
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<DataCorrelation[]>('http://localhost:3000/data-correlation');
        setData(response.data);
      } catch (err) {
        setError('Error fetching data correlation data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    printWindow.document.open();
    printWindow.document.write(`
      <html>
      <head>
        <title>Print Data Correlation</title>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
          }
          th {
            background-color: #f2f2f2;
          }
          .container {
            padding: 20px;
          }
          .no-data {
            text-align: center;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Data Correlation</h1>
          <table>
            <thead>
              <tr>
                <th>Number</th>
                <th>SMS Count</th>
                <th>SMS Messages</th>
                <th>Call Logs</th>
              </tr>
            </thead>
            <tbody>
              ${data.length > 0 ? data.map(entry => `
                <tr>
                  <td>${entry.number}</td>
                  <td>${entry.smsCount}</td>
                  <td>
                    ${entry.messages && entry.messages.length > 0 ? entry.messages.map(message => `
                      <div>
                        <div><strong>Body:</strong> ${message.body}</div>
                        <div><strong>Date:</strong> ${new Date(message.date).toLocaleString()}</div>
                      </div>
                    `).join('') : '<div>No SMS messages available.</div>'}
                  </td>
                  <td>
                    ${entry.callLogs && entry.callLogs.length > 0 ? entry.callLogs.map(log => `
                      <div>
                        <div><strong>Number:</strong> ${log.number}</div>
                        <div><strong>Type:</strong> ${log.type}</div>
                        <div><strong>Date:</strong> ${new Date(log.date).toLocaleString()}</div>
                        ${log.duration !== undefined ? `<div><strong>Duration:</strong> ${log.duration} seconds</div>` : ''} 
                      </div>
                    `).join('') : '<div>No call logs available.</div>'}
                  </td>
                </tr>
              `).join('') : '<tr><td colspan="4" class="no-data">No data available.</td></tr>'}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  if (loading) return <Spinner><CircularProgress /></Spinner>;
  if (error) return <NoData color="error">{error}</NoData>;

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter data based on search keyword
  const filteredData = data.filter(entry => {
    const search = searchKeyword.toLowerCase();
    // Check if the number or message body or call log number matches the search keyword
    return (
      entry.number.toLowerCase().includes(search) ||
      (entry.messages && entry.messages.some(message => message.body.toLowerCase().includes(search))) ||
      (entry.callLogs && entry.callLogs.some(log => log.number.toLowerCase().includes(search)))
    );
  });

  // Calculate paginated data
  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const highlightText = (text: string) => {
    if (!searchKeyword) return text; // No highlighting if no search keyword
    const regex = new RegExp(`(${searchKeyword})`, 'gi');
    return text.split(regex).map((part, index) =>
      regex.test(part) ? <Highlight key={index}>{part}</Highlight> : part
    );
  };

  return (
    <Container>
      <PrintButton variant="contained" color="primary" onClick={handlePrint}>Print</PrintButton>
      <SearchContainer>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </SearchContainer>
      {filteredData.length === 0 ? (
        <NoData>No data available.</NoData>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table aria-label="data correlation table">
              <TableHeader>
                <TableRow>
                  <TableCell>Number</TableCell>
                  <TableCell>SMS Count</TableCell>
                  <TableCell>SMS Messages</TableCell>
                  <TableCell>Call Logs</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{highlightText(entry.number)}</TableCell>
                    <TableCell>{entry.smsCount}</TableCell>
                    <TableCell>
                      <LogsContainer>
                        {entry.messages && entry.messages.length > 0 ? (
                          entry.messages.map((message, i) => (
                            <LogItem key={i}>
                              <LogHeader variant="body2">Body:</LogHeader>
                              <Typography variant="body2">{highlightText(message.body)}</Typography>
                              <LogHeader variant="body2">Date:</LogHeader>
                              <Typography variant="body2">{new Date(message.date).toLocaleString()}</Typography>
                            </LogItem>
                          ))
                        ) : (
                          <Typography variant="body2" color="textSecondary">No SMS messages available.</Typography>
                        )}
                      </LogsContainer>
                    </TableCell>
                    <TableCell>
                      <LogsContainer>
                        {entry.callLogs && entry.callLogs.length > 0 ? (
                          entry.callLogs.map((log, i) => (
                            <LogItem key={i}>
                              <LogHeader variant="body2">Number:</LogHeader>
                              <Typography variant="body2">{highlightText(log.number)}</Typography>
                              <LogHeader variant="body2">Type:</LogHeader>
                              <Typography variant="body2">{log.type}</Typography>
                              <LogHeader variant="body2">Date:</LogHeader>
                              <Typography variant="body2">{new Date(log.date).toLocaleString()}</Typography>
                              {log.duration !== undefined && (
                                <>
                                  <LogHeader variant="body2">Duration:</LogHeader>
                                  <Typography variant="body2">{log.duration} seconds</Typography>
                                </>
                              )}
                            </LogItem>
                          ))
                        ) : (
                          <Typography variant="body2" color="textSecondary">No call logs available.</Typography>
                        )}
                      </LogsContainer>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Container>
  );
};

export default DataCorrelationPage;
