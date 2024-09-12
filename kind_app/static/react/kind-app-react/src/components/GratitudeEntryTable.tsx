import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Checkbox,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import AddButton from './AddButton';
import GratitudeEntryForm from './GratitudeEntryForm';
import { useAuth } from '../context/AuthContext';

interface GratitudeEntry {
  id: number;
  content: string;
  created_at: string;
}

const GratitudeEntryTable: React.FC = () => {
  const { csrfToken } = useAuth(); // Use the CSRF token from context
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch('/api/gratitude/');
        if (!response.ok) {
          throw new Error('Failed to fetch entries');
        }
        const data = await response.json();
        setEntries(data); // Set the fetched entries in the state
      } catch (err) {
        setError((err as Error).message); // Set any errors
      } finally {
        setLoading(false); // Mark the loading as complete
      }
    };

    fetchEntries();
  }, []);

  const handleAddClick = () => {
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleFormSubmit = async (content: string) => {
    try {
      const response = await fetch('/api/gratitude/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken || '', // Use CSRF token from context
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to add entry');
      }

      const newEntry = await response.json();
      setEntries((prevEntries) => [...prevEntries, newEntry]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(new Set(entries.map((entry) => entry.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleRowClick = (id: number) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    setSelectedIds(newSelectedIds);
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box mb={2} display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" gutterBottom>
          Gratitude Entries
        </Typography>
        <Box>
            <AddButton onClick={handleAddClick} />
        </Box>
      </Box>
      
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={entries.length > 0 && selectedIds.size === entries.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry) => (
              <TableRow 
                key={entry.id}
                hover
                onClick={() => handleRowClick(entry.id)}
                selected={selectedIds.has(entry.id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.has(entry.id)}
                    onChange={() => handleRowClick(entry.id)}
                  />
                </TableCell>
                <TableCell>{entry.id}</TableCell>
                <TableCell>{entry.content}</TableCell>
                <TableCell>
                  {new Date(entry.created_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <GratitudeEntryForm
        open={showForm}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
    </Container>
  );
};

export default GratitudeEntryTable;
