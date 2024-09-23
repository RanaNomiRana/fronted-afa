import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Typography,
  Grid,
  TablePagination,
} from '@mui/material';
import { useTable, useSortBy, usePagination } from 'react-table';

interface ConnectionDetail {
  _id: string;
  deviceName?: string;
  casenumber?: string;
  additionalInfo?: string;
  investigatorId?: string;
  createdAt?: string;
}

const ConnectionDetail: React.FC = () => {
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetail[]>([]);
  const [filteredDetails, setFilteredDetails] = useState<ConnectionDetail[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);

  useEffect(() => {
    const fetchConnectionDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8000/connection-details');
        setConnectionDetails(response.data);
        setFilteredDetails(response.data);
      } catch (error) {
        console.error('Error fetching connection details:', error);
      }
    };

    fetchConnectionDetails();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = connectionDetails.filter(detail =>
      (detail.deviceName && detail.deviceName.toLowerCase().includes(lowercasedQuery)) ||
      (detail.casenumber && detail.casenumber.toLowerCase().includes(lowercasedQuery))
    );
    setFilteredDetails(filtered);
  }, [searchQuery, connectionDetails]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Device Name',
        accessor: 'deviceName',
      },
      {
        Header: 'Case Number',
        accessor: 'casenumber',
      },
      {
        Header: 'Additional Info',
        accessor: 'additionalInfo',
      },
      {
        Header: 'Investigator ID',
        accessor: 'investigatorId',
      },
      {
        Header: 'Created At',
        accessor: 'createdAt',
        Cell: ({ value }: { value: string }) => new Date(value).toLocaleString(),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page, // Use the page variable from usePagination
    prepareRow,
  } = useTable(
    {
      columns,
      data: filteredDetails,
      initialState: {
        pageIndex: pageIndex,
        pageSize: pageSize,
      },
    },
    useSortBy,
    usePagination
  );

  return (
    <Container>
      <Grid container spacing={3} className="search-field">
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Search by Device Name or Case Number"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>
      </Grid>
      <TableContainer component={Paper} className="table-container">
        <Table {...getTableProps()}>
          <TableHead className="table-head">
            {headerGroups.map(headerGroup => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <TableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="table-head-cell"
                  >
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()} className="table-row">
                  {row.cells.map(cell => (
                    <TableCell {...cell.getCellProps()} className="table-cell">{cell.render('Cell')}</TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="table-pagination">
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredDetails.length}
          rowsPerPage={pageSize}
          page={pageIndex}
          onPageChange={(event, newPage) => setPageIndex(newPage)}
          onRowsPerPageChange={(event) => setPageSize(parseInt(event.target.value, 10))}
        />
      </div>
    </Container>
  );
};

export default ConnectionDetail;
