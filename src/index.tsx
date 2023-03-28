import * as ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Buffer } from 'buffer';
import App from './App';
import NotFound from './NotFound';
import theme from './theme';
import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement!);
const ethereum = window.ethereum;
const isMetaMask = window.ethereum ? window.ethereum.isMetaMask : false;

window.Buffer = window.Buffer || Buffer;

root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {(ethereum && isMetaMask) ?
      <BrowserRouter>
        <App />
      </BrowserRouter>
      : <NotFound />
    }
  </ThemeProvider>,
);
