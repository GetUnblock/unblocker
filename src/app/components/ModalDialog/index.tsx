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
import { URL_LIST } from '../../utils';

export default function ModalDialog(props: any) {

  return (
    <div>
      <Dialog open={props.open} onClose={props.onClose}>
        <DialogTitle>Select URL and Chain Id</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ marginBottom: "20px" }}>
            To generate a signed Siwe message please select the desired URL.
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
              {URL_LIST.map((item: any, index) => (
                <MenuItem key={index} value={item.url}>{item.description}</MenuItem>
              ))}
            </TextField>
          </Box>
          <Box>
            {props.url && props.chainList &&
              <TextField
                sx={{ width: "50%" }}
                variant="outlined"
                onChange={props.onChainChange}
                value={props.chainId}
                disabled={props.chainList.length===1}
                label="Chain Id"
                select
              >
                {props.chainList.map((item: any, index: number) => (
                  <MenuItem key={index} value={item.id}>{item.description}</MenuItem>
                ))}
              </TextField>
            }
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#FF0000',
              '&:hover': { backgroundColor: '#E50000' },
            }}
            onClick={props.onClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#2A73FF' }}
            onClick={props.onSubmit}
            disabled={!props.url}
          >
            Generate
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}