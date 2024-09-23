import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Grid,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface Collection {
  name: string;
}

interface DataRow {
  [key: string]: any;
}

const CollectionsList: React.FC<{ database: string }> = ({ database }) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loadingCollections, setLoadingCollections] = useState<boolean>(true);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [data, setData] = useState<DataRow[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  useEffect(() => {
    const fetchCollections = async () => {
      setLoadingCollections(true);
      try {
        const response = await axios.get(`http://localhost:8000/collections/${database}`);
        setCollections(response.data);
      } catch (err) {
        setError('Error fetching collections');
      } finally {
        setLoadingCollections(false);
      }
    };

    fetchCollections();
  }, [database]);

  const handleCollectionClick = async (collectionName: string) => {
    setSelectedCollection(collectionName);
    setLoadingData(true);
    try {
      const response = await axios.get(`http://localhost:8000/data/${database}/${collectionName}`);
      setData(response.data);
      setOpenDialog(true);
    } catch (err) {
      setError('Error fetching collection data');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSearchQuery('');
  };

  if (loadingCollections) {
    return (
      <Paper style={{ padding: 20, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6">Loading collections...</Typography>
      </Paper>
    );
  }

  if (error) {
    return <Typography color="error" style={{ padding: 20 }}>{error}</Typography>;
  }

  return (
    <Paper style={{ padding: 20 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6">Collections</Typography>
          <List>
            {collections.map((col) => (
              <ListItem
                button
                key={col.name}
                onClick={() => handleCollectionClick(col.name)}
                style={{ borderBottom: '1px solid #ddd' }}
              >
                <ListItemText primary={col.name} />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="lg">
        <DialogTitle>Data for {selectedCollection}</DialogTitle>
        <DialogContent>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ marginBottom: 20 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {loadingData ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
              <CircularProgress />
              <Typography variant="h6" style={{ marginLeft: 20 }}>Loading data...</Typography>
            </div>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {data.length > 0 && Object.keys(data[0]).map(key => (
                      <TableCell key={key} style={{ fontWeight: 'bold' }}>{key}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((row, index) => (
                      <TableRow key={index}>
                        {Object.values(row).map((value, idx) => (
                          <TableCell key={idx}>{String(value)}</TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={Object.keys(data[0] || {}).length}>
                        No data found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CollectionsList;
