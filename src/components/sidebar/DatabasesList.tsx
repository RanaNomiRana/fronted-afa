// src/components/DatabaseList.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, CircularProgress, Typography, Paper, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';

interface Database {
  name: string;
}

// Define styles using makeStyles
const useStyles = makeStyles({
  paper: {
    padding: 16,
    maxWidth: 600,
    margin: 'auto',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },
  listItem: {
    borderBottom: '1px solid #ddd',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  listItemText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
  searchField: {
    marginBottom: 16,
  },
});

const DatabaseList: React.FC<{ onSelect: (database: string) => void }> = ({ onSelect }) => {
  const classes = useStyles();
  const [databases, setDatabases] = useState<Database[]>([]);
  const [filteredDatabases, setFilteredDatabases] = useState<Database[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        const response = await axios.get('http://localhost:8000/databases');
        setDatabases(response.data);
        setFilteredDatabases(response.data); // Initialize filtered list
      } catch (err) {
        setError('Error fetching databases');
      } finally {
        setLoading(false);
      }
    };

    fetchDatabases();
  }, []);

  useEffect(() => {
    // Filter databases based on the search query
    if (searchQuery) {
      setFilteredDatabases(
        databases.filter(db => db.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    } else {
      setFilteredDatabases(databases);
    }
  }, [searchQuery, databases]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  if (loading) return <div className={classes.loadingContainer}><CircularProgress /></div>;
  if (error) return <Typography className={classes.errorText}>{error}</Typography>;

  return (
    <Paper className={classes.paper}>
      <TextField
        className={classes.searchField}
        label="Search Databases"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <List>
        {filteredDatabases.map((db) => (
          <ListItem button key={db.name} className={classes.listItem} onClick={() => onSelect(db.name)}>
            <ListItemText primary={db.name} classes={{ primary: classes.listItemText }} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default DatabaseList;
