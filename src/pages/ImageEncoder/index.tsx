import {
    Container,
    Box,
    Typography,
} from '@mui/material';

export default function ImageEncoder() {
    return (
        <Container>
        <Box sx={{ my: 2 }}>
          <Typography variant="h4" component="h1" align="center">
            Upload and encode an image
          </Typography>
        </Box>
      </Container>
    );
}
