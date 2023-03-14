import { Container, Box, Button, Typography } from '@mui/material';
import InfoDisclaimer from './components/InfoDisclaimer';

export default function NotFound() {
  const disclaimerNotFound = 'Metamask was not detected! Please install it then click on reload button'; 

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" align="center">
          Metamask not detected
        </Typography>
      </Box>
      <Box sx={{ my: 4 }}>
        <InfoDisclaimer text={disclaimerNotFound} />
        <Button
          onClick={() => window.location.reload()}
          variant="contained"
          sx={{ backgroundColor: '#2A73FF' }}
        >
          Reload
        </Button>
      </Box>
    </Container>
  );
}
