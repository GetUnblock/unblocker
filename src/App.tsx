import { useState, useEffect } from 'react';
import { Container, Box, Button, Typography, SelectChangeEvent } from '@mui/material';
import { ethers } from 'ethers';
import { generateNonce, SiweMessage } from 'siwe';
import CodeSnippet from './components/CodeSnippet';
import InfoDisclaimer from './components/InfoDisclaimer';
import ModalDialog from './components/ModalDialog';
import { CHAIN_LIST } from './utils';

export default function App() {

  const [connected, setConnected] = useState(false);
  const [currentAddress, setCurrentAddress] = useState('');
  const [currentMsg, setCurrentMsg] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [url, setUrl] = useState('');
  const [chainId, setChainId] = useState('');
  const [chainDescription, setChainDescription] = useState('');
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const disclaimerText = 'Select only one wallet if you have multiple accounts on your metamask widget. To use a different wallet please disconnect the current one from Metamask widget and click on Connect to choose a different one.';

  useEffect(() => {
    // Check if account is still connected via metamask every 1m
    const intervalId = setInterval(() => {
      if (!provider) {
        alert()
      }
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

  const handleClickOpen = () => {
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
        setCurrentMsg('')
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
    setCurrentMsg('');
    setOpenModal(false);

    const message = await createSiweMessage(
      await signer.getAddress(),
      'Sign in with Ethereum',
      url,
      Number(chainId),
    );
    const signature = await signer.signMessage(message);

    // Reset URL and chainId
    setUrl('');
    setChainId('');
    if (signature) {
      setCurrentMsg(JSON.stringify({ message, signature }, null, 2));
    } else {
      alert('Unable to generate message with signature. Please try again');
    }
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
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
          <Typography variant="body1" gutterBottom>
            {`Connected to wallet with address:  ${currentAddress}`}
          </Typography>
        }
      </Box>
      <Box sx={{ my: 4 }}>
        <Button
          onClick={handleClickOpen}
          variant="contained"
          sx={{ backgroundColor: '#2A73FF' }}
          disabled={!connected}
        >
          Generate Message & Signature
        </Button>
      </Box>
      {currentMsg &&
        <>
          <Typography variant="body1" gutterBottom>
            Generated message and signature:
          </Typography>
          <CodeSnippet code={currentMsg} />
        </>
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
    </Container>
  );
}
