import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import KindActTable from '../components/KindActTable';  // Import the table component

const KindActPage: React.FC = () => {
  return (
    <Container maxWidth="lg"> {/* Sets the max width of the container */}
      <Box mt={4} mb={4}> {/* Adds vertical margin */}
        {/* <Typography variant="h3" align="center" gutterBottom>
          Gratitude Entry List
        </Typography> */}
        <Box mt={4}>
          <Paper elevation={3}> {/* Adds a shadowed paper effect to the table */}
            <Box p={2}> {/* Adds padding around the table */}
              <KindActTable />  {/* Render the GratitudeEntries table here */}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default KindActPage;
