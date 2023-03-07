import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  MenuItem,
  TextField,
  Box,
} from '@mui/material/';

export default function ModalDialog(props: any) {

  return (
    <div>
      <Dialog open={props.open} onClose={props.onClose}>
        <DialogTitle>Select URL and Chain Id</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ marginBottom: "20px" }}>
            To generate a signed Siwe message please select the URL and Chain Id.
          </DialogContentText>
          <Box>
            <TextField
              sx={{ width: "50%", marginBottom: "20px" }}
              variant="outlined"
              value={props.url}
              onChange={props.onUrlChange}
              select
              label="URL"
            >
              <MenuItem value={"https://sandbox.getunblock.com"}>Unblock Sandbox</MenuItem>
              <MenuItem value={"https://sandbox.getunblock.com/fiat-connect"}>Unblock FC Sandbox</MenuItem>
              <MenuItem value={"https://getunblock.com"}>Unblock Prod</MenuItem>
              <MenuItem value={"https://getunblock.com/fiat-connect"}>Unblock FC Prod</MenuItem>
            </TextField>
          </Box>
          <Box>
            <TextField
              sx={{ width: "50%" }}
              variant="outlined"
              value={props.chainId}
              onChange={props.onChainChange}
              select
              label="Chain Id"
            >
              <MenuItem value={"137"}>Polygon Mainet</MenuItem>
              <MenuItem value={"80001"}>Mumbai Testnet</MenuItem>
              <MenuItem value={"42220"}>Celo Mainet</MenuItem>
              <MenuItem value={"44787"}>Celo (Alfajores Testnet)</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>Cancel</Button>
          <Button onClick={props.onSubmit}>Generate</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}