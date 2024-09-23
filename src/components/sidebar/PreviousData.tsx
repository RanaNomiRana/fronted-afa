// src/App.tsx
import React, { useState } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import DatabaseList from './DatabasesList';
import CollectionsList from './CollectionsList';

const PreviousData: React.FC = () => {
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null);

  return (
    <Container>
      
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <DatabaseList onSelect={(db) => setSelectedDatabase(db)} />
        </Grid>
        <Grid item xs={8}>
          {selectedDatabase ? (
            <CollectionsList database={selectedDatabase} />
          ) : (
            <Typography>Select a database to see collections</Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default PreviousData;
