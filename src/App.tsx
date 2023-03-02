import { useState, useEffect } from 'react';
import { Container, Box, Button, Typography } from '@mui/material';
import { ethers } from 'ethers';
import { generateNonce, SiweMessage } from 'siwe';
import CodeSnippet from './components/CodeSnippet';
import InfoDisclaimer from './components/InfoDisclaimer';

export default function App() {

  const [connected, setConnected] = useState(false);
  const [currentAddress, setCurrentAddress] = useState('');
  const [currentMsg, setCurrentMsg] = useState('');
  const domain = process.env.REACT_APP_DOMAIN_URL;
  const chainId = Number(process.env.REACT_APP_CHAIN_ID);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const disclaimerText = 'To Use a different wallet please disconnect the current one from Metamask widget and click on Connect to choose a different one';

  useEffect(() => {
    // Check if account is still connected via metamask every 1m
    const intervalId = setInterval(() => {
      if (!provider) {
        alert()
      }
      checkConnectionWallet();
    }, 10000)

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // reset message
    setCurrentMsg('');
    if (!domain || !chainId) {
      alert('Please set up the required env variables: REACT_APP_DOMAIN_URL and REACT_APP_CHAIN_ID');
      return;
    }
    const message = await createSiweMessage(
      await signer.getAddress(),
      'Sign in with Ethereum',
      domain,
      chainId
    );
    const signature = await signer.signMessage(message);

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
          onClick={signInWithEthereum}
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
    </Container>
  );
}
