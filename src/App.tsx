import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Box, Button, Typography, SelectChangeEvent } from '@mui/material';
import { ethers } from 'ethers';
import { generateNonce, SiweMessage } from 'siwe';
import CodeSnippet from './components/CodeSnippet';
import InfoDisclaimer from './components/InfoDisclaimer';
import ModalDialog from './components/ModalDialog';
import { CHAIN_LIST } from './utils';
import ModalLoginDialog from './components/ModalLoginDialog';

export default function App() {

  const [connected, setConnected] = useState(false);
  const [currentAddress, setCurrentAddress] = useState('');
  const [currentMsg, setCurrentMsg] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [url, setUrl] = useState('');
  const [chainId, setChainId] = useState('');
  const [chainDescription, setChainDescription] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [currentSession, setCurrentSession] = useState('');
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const disclaimerText = 'Select only one wallet if you have multiple accounts on your metamask widget. To use a different wallet please disconnect the current one from Metamask widget and click on Connect to choose a different one.';
  const disclaimerMessageText = 'Copy the object below and use it on Postman or any similar tool to login on the selected URL or click on the login button.';
  const disclaimerLogin = 'Do no attempt to login more than once with the same SIWE message (nonce will be in use) - generate a new message then login';

  useEffect(() => {
    // Check if account is still connected via metamask every 1m
    const intervalId = setInterval(() => {
      checkConnectionWallet();
    }, 60000)

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Check if account is connected
    checkConnectionWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleModalOpen = () => {
    setCurrentMsg('');
    setUrl('');
    setChainId('');
    setCurrentSession('');
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setUrl('');
    setChainId('');
    setChainDescription('');
  };

  const handleUrlChange = (event: SelectChangeEvent) => {

    const chainResult = CHAIN_LIST.filter((obj) => {
      return obj.url === event.target.value;
    });

    // Set URL, Chain Id & Description
    setUrl(event.target.value);
    setChainId(chainResult[0].id);
    setChainDescription(chainResult[0].description);
  };

  const handleConnectWallet = async () => {
    await provider.send('eth_requestAccounts', [])
      .then(response => {
        setCurrentAddress(response);
        setConnected(true);
      })
      .catch(() => console.log('user rejected request'));
  };

  const checkConnectionWallet = () => {
    provider.send('eth_accounts', []).then(response => {
      if (response.length > 0) {
        setCurrentAddress(response);
        setConnected(true);
      } else {
        setCurrentAddress('');
        setConnected(false);
        setCurrentMsg('');
        setCurrentSession('');
      }
    })
  };

  const createSiweMessage = (address: string, statement: string, domain: string, chainId: number) => {
    const domainUrl = new URL(domain);
    const SESSION_DURATION_MS = 1000 * 60 * 60 * 4 // 4 hours (max allowed)
    const expirationDate = new Date(Date.now() + SESSION_DURATION_MS)
    const message = new SiweMessage({
      domain: domainUrl.hostname,
      address: address,
      statement: statement,
      uri: `${domain}/auth/login`,
      version: '1',
      chainId: chainId,
      nonce: generateNonce(),
      expirationTime: expirationDate.toISOString(),
    });
    return message.prepareMessage();
  }

  const signInWithEthereum = async () => {
    if (!connected) {
      alert('Please connect to your wallet');
      return;
    }
    // reset message and close modal
    setOpenModal(false);

    const message = await createSiweMessage(
      await signer.getAddress(),
      'Sign in with Ethereum',
      url,
      Number(chainId),
    );
    const signature = await signer.signMessage(message);

    if (signature) {
      setCurrentMsg(JSON.stringify({ message, signature }, null, 2));
    } else {
      alert('Unable to generate message with signature. Please try again');
    }
  }

  const handleLoginModal = () => {
    setOpenLoginModal(true);
  };

  const handleLoginCloseModal = () => {
    setOpenLoginModal(false);
    setApiKey('');
  };

  const handleApiChange = (event: any) => {
    setApiKey(event.target.value);
  };

  const handleLogin = async () => {
    setOpenLoginModal(false)
    // Parse loginBody
    const loginBody = JSON.parse(currentMsg);

    const config = {
      headers: {
        Authorization: apiKey,
      },
    };

    if (url && apiKey) {
      await axios.post(`${url}/auth/login`, loginBody, config)
        .then(res => {
          setCurrentSession(res.data.unblock_session_id);
        })
        .catch(error => {
          alert('Failed to login with error: ' + error +
            '\n Please try again or ensure you are not trying to login with the same SIWE message');
        });
    }

    setApiKey('');
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" align="center">
          Generate a Siwe Message and signature
        </Typography>
      </Box>
      <Box sx={{ my: 4 }}>
        <InfoDisclaimer text={disclaimerText} />
        <Button
          onClick={handleConnectWallet}
          variant="contained"
          sx={{ backgroundColor: '#2A73FF' }}
        >
          Connect to your wallet
        </Button>
      </Box>
      <Box sx={{ my: 4 }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }} gutterBottom>
          Connection Status:
        </Typography>
        {connected &&
          <Typography variant="body1">
            {`Connected to wallet with address:  ${currentAddress}`}
          </Typography>
        }
      </Box>
      <Box sx={{ my: 4 }}>
        <Button
          onClick={handleModalOpen}
          variant="contained"
          sx={{ backgroundColor: '#2A73FF' }}
          disabled={!connected}
        >
          Generate Message & Signature
        </Button>
      </Box>
      {currentMsg &&
        <>
          <InfoDisclaimer text={disclaimerMessageText} />
          <Typography variant="body1" gutterBottom>
            Login endpoint:&nbsp;
            <Box component="span" fontWeight='bold'>
              {`${url}/auth/login`}
            </Box>
          </Typography>
          <CodeSnippet code={currentMsg} />
          <Button
            onClick={handleLoginModal}
            variant="contained"
            sx={{ backgroundColor: '#2A73FF' }}
            disabled={!connected}
          >
            Login
          </Button>
        </>
      }
      {currentSession &&
        <Box sx={{ my: 4 }}>
          <InfoDisclaimer text={disclaimerLogin} />
          <Typography component='div'>
            Copy the Session ID below to use on any endpoint that requires&nbsp;
            <Box component="span" fontWeight='bold'>
              unblock-session-id
            </Box>
            &nbsp;header field:
          </Typography>
          <CodeSnippet code={currentSession} />
        </Box>
      }
      <ModalDialog
        open={openModal}
        onClose={handleClose}
        url={url}
        onUrlChange={handleUrlChange}
        chainId={chainId}
        chainDescription={chainDescription}
        onSubmit={signInWithEthereum}
      />
      <ModalLoginDialog
        open={openLoginModal}
        onClose={handleLoginCloseModal}
        url={url}
        apiKey={apiKey}
        onChange={handleApiChange}
        onSubmit={handleLogin}
      />
    </Container>
  );
}
