import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  Box,
  Typography,
} from '@mui/material/';

export default function ModalLoginDialog(props: any) {

  return (
    <div>
      <Dialog open={props.open} onClose={props.onClose}>
        <DialogTitle>Login on Unblock</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ marginBottom: "20px" }}>
            Please provide your Partner Key in order to login
          </DialogContentText>
          <Box>
            <TextField
              sx={{ width: "75%", marginBottom: "20px" }}
              variant="outlined"
              onChange={props.onChange}
              label="API Key"
            >
            </TextField>
          </Box>
          <Box>
            {props.url &&
              <Typography variant="body1" gutterBottom>
                {`Login will be done on this endpoint:  ${props.url}`}
              </Typography>
            }
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>Cancel</Button>
          <Button onClick={props.onSubmit} disabled={!props.apiKey}>Login</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}