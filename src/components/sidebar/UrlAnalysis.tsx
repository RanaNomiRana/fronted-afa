// src/components/UrlAnalysis.tsx
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
} from '@mui/material';
import { makeStyles } from '@mui/styles';

interface SpamUrl {
  sender: string;
  date: string;
  body: string;
  urls: string[]; // Add URLs property
}

interface UrlAnalysisResponse {
  spamUrls: SpamUrl[];
  nonSpamUrls: SpamUrl[];
}

const useStyles = makeStyles({
  container: {
    padding: 20,
  },
  table: {
    minWidth: 650,
  },
  header: {
    backgroundColor: '#f5f5f5',
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
  },
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 20,
  },
});

const UrlAnalysis: React.FC = () => {
  const [spamData, setSpamData] = useState<SpamUrl[]>([]);
  const [nonSpamData, setNonSpamData] = useState<SpamUrl[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<UrlAnalysisResponse>('http://localhost:3000/url-analysis');
        setSpamData(response.data.spamUrls);
        setNonSpamData(response.data.nonSpamUrls);
      } catch (err) {
        setError('Error fetching URL analysis data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Box className={classes.spinner}><CircularProgress /></Box>;
  if (error) return <Typography color="error" className={classes.noData}>{error}</Typography>;

  return (
    <Box className={classes.container}>
      {spamData.length === 0 && nonSpamData.length === 0 ? (
        <Typography className={classes.noData}>No URLs detected.</Typography>
      ) : (
        <>
          <Typography variant="h6">Spam URLs</Typography>
          {spamData.length > 0 ? (
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="spam url analysis table">
                <TableHead>
                  <TableRow className={classes.header}>
                    <TableCell>Sender</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Body</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {spamData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.sender}</TableCell>
                      <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                      <TableCell>{row.body}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography className={classes.noData}>No spam URLs detected.</Typography>
          )}

          <Typography variant="h6" style={{ marginTop: '20px' }}>Non-Spam URLs</Typography>
          {nonSpamData.length > 0 ? (
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="non-spam url analysis table">
                <TableHead>
                  <TableRow className={classes.header}>
                    <TableCell>Sender</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Body</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nonSpamData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.sender}</TableCell>
                      <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                      <TableCell>{row.body}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography className={classes.noData}>No non-spam URLs detected.</Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default UrlAnalysis;
