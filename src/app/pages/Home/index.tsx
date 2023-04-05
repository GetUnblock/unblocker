import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Button,
  Typography,
  SelectChangeEvent,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { ethers } from 'ethers';
import { generateNonce, SiweMessage } from 'siwe';
import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import walletConnectModule from '@web3-onboard/walletconnect';
import web3 from 'web3';
import CodeSnippet from '../../components/CodeSnippet';
import InfoDisclaimer from '../../components/InfoDisclaimer';
import ModalDialog from '../../components/ModalDialog';
import {
  CHAIN_LIST,
  chains,
  appMetadata,
  disclaimerText,
  disclaimerGenerateMessageText,
  disclaimerMessageText,
  disclaimerLogin
} from '../../utils';
import ModalLoginDialog from '../../components/ModalLoginDialog';

// Onboard setup
const injected = injectedModule();
const walletConnect = walletConnectModule({
  qrcodeModalOptions: {
    mobileLinks: [
      'rainbow',
      'metamask',
      'argent',
      'trust',
      'imtoken',
      'pillar',
    ],
  },
});

const onboard = Onboard({
  wallets: [],
  chains,
  appMetadata,
  accountCenter: {
    desktop: {
      enabled: false,
    },
    mobile: {
      enabled: false,
    },
  },
});

onboard.state.actions.setWalletModules([
  injected,
  walletConnect,
]);


export default function Home() {
  const [connected, setConnected] = useState(false);
  const [currentAddress, setCurrentAddress] = useState('');
  const [currentMsg, setCurrentMsg] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [chainList, setChainList] = useState([] as any);
  const [chainId, setChainId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiKeyHasError, setApiKeyHasError] = useState(false);
  const [currentSession, setCurrentSession] = useState('');
  const [currentProvider, setCurrentProvider] = useState(null as any);
  const loginCodeSnippet = useRef<HTMLDivElement>(null);;

  useEffect(() => {
    // Check if account is still connected
    const intervalId = setInterval(() => {
      checkConnectionWallet();
    }, 60000)

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProvider]);

  useEffect(() => {
    // Check if account is connected
    checkConnectionWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProvider]);

  useEffect(() => {
    if (!apiKey.startsWith('API-Key ') && apiKey.length > 0) {
      setApiKeyHasError(true);
    } else {
      setApiKeyHasError(false);
    }
  }, [apiKey, apiKeyHasError]);

  useEffect(() => {
    // Scroll to login snippet
    if (loginCodeSnippet.current) {
      loginCodeSnippet.current.scrollIntoView();
    }
  }, [currentSession]);

  const handleModalOpen = () => {
    setCurrentMsg('');
    setUrl('');
    setChainList('');
    setCurrentSession('');
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setUrl('');
    setChainList('');
  };

  const handleUrlChange = (event: SelectChangeEvent) => {

    const chainResult = CHAIN_LIST.filter((obj) => {
      return obj.url === event.target.value;
    });

    // Set URL, default Chain Id & Description
    setChainList(chainResult);
    setChainId(chainResult[0].id);
    setUrl(event.target.value);
  };

  const handleChainChange = (event: SelectChangeEvent) => {

    // Set Chain Id
    setChainId(event.target.value);
  };

  const handleConnectWallet = async () => {
    // Check if connection still exists
    let currentWallet = [];

    try {
      if (currentProvider) {
        currentWallet = await currentProvider.send('eth_accounts', []);
      }

      if (currentWallet.length === 0) {
        // reset all state variables
        setCurrentAddress('');
        setConnected(false);
        setCurrentMsg('');
        setCurrentSession('');

        // Check if a connection exists and reset state before connecting again
        const [primaryWallet] = onboard.state.get().wallets;
        if (primaryWallet) {
          await onboard.disconnectWallet({ label: primaryWallet.label });
        }

        const wallets = await onboard.connectWallet();

        if (wallets[0]) {
          setCurrentProvider(new ethers.providers.Web3Provider(
            wallets[0].provider,
            'any',
          ));

          const address = web3.utils.toChecksumAddress(wallets[0].accounts[0].address);
          setCurrentAddress(address);
          setConnected(true);
        }

      } else {
        alert(`Already connected with wallet: ${currentAddress}`);
      }

    } catch (error) {
      // reset all state variables and connect to wallet again
      setCurrentAddress('');
      setConnected(false);
      setCurrentMsg('');
      setCurrentSession('');
      setCurrentProvider(null);

      const wallets = await onboard.connectWallet();

      if (wallets[0]) {
        setCurrentProvider(new ethers.providers.Web3Provider(
          wallets[0].provider,
          'any',
        ));

        const address = web3.utils.toChecksumAddress(wallets[0].accounts[0].address);
        setCurrentAddress(address);
        setConnected(true);
      }
    }
  };

  const checkConnectionWallet = async () => {
    try {
      if (currentProvider) {
        await currentProvider.send('eth_accounts', []).then((response: any) => {
          if (response.length > 0) {
            const address = web3.utils.toChecksumAddress(response[0]);
            setCurrentAddress(address);
            setConnected(true);
          } else {
            setCurrentAddress('');
            setConnected(false);
            setCurrentMsg('');
            setCurrentSession('');
            setCurrentProvider(null);
          }
        });
      }
    } catch (error) {
      setCurrentAddress('');
      setConnected(false);
      setCurrentMsg('');
      setCurrentSession('');
      setCurrentProvider(null);
    }
  };

  const createSiweMessage = (address: string, statement: string, domain: string, chainId: number) => {
    const domainUrl = new URL(domain);
    const SESSION_DURATION_MS = 1000 * 60 * 60 * 4; // 4 hours (max allowed)
    const expirationDate = new Date(Date.now() + SESSION_DURATION_MS);
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
    if (!connected && !currentProvider) {
      alert('Please connect to your wallet');
      return;
    }
    // reset message and close modal
    setOpenModal(false);

    const signer = currentProvider.getSigner();
    const walletAddress = await signer.getAddress();
    const message = createSiweMessage(
      walletAddress,
      'Sign in with Ethereum',
      url,
      Number(chainId),
    );
    try {
      // request signMessage on Metamask
      const signature = await signer.signMessage(message);
      setCurrentMsg(JSON.stringify({ message, signature }, null, 2));
    } catch {
      alert('User rejected signing the message. Please try again.');
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
    setOpenLoginModal(false);
    setLoading(true);
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
          const { user_id, unblock_session_id } = res.data;
          setCurrentSession(JSON.stringify({ user_id, unblock_session_id }, null, 2));
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          const errorId = error.response?.data?.error_id || '';
          const errorMessage = error.response?.data?.message || '';
          const errorCode = error.response?.status;
          alert(`Login failed with errorCode: ${errorCode}, error_id: ${errorId} and the following message: ${errorMessage}`);
        });
    }
    setApiKey('');
  };

  return (
    <>
      <Container>
        <Box sx={{ my: 2 }}>
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
          <InfoDisclaimer text={disclaimerGenerateMessageText} />
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
          <Box sx={{ my: 4 }}>
            <InfoDisclaimer text={disclaimerMessageText} />
            <Typography variant="body1" gutterBottom>
              Login endpoint:&nbsp;
              <Box component="span" fontWeight='bold'>
                {`${url}/auth/login`}
              </Box>
            </Typography>
            <CodeSnippet code={currentMsg} language={"json"} />
            <Button
              onClick={handleLoginModal}
              variant="contained"
              sx={{ backgroundColor: '#2A73FF' }}
              disabled={!connected}
            >
              Login
            </Button>
          </Box>
        }
        {currentSession &&
          <Box sx={{ my: 4 }}>
            <InfoDisclaimer text={disclaimerLogin} />
            <Typography component='div' ref={loginCodeSnippet}>
              Copy the User Id and Session Id below to use on any endpoint that requires&nbsp;
              <Box component="span" fontWeight='bold'>
                unblock-session-id & user_id
              </Box>
              &nbsp;fields:
            </Typography>
            <CodeSnippet code={currentSession} language={"json"} />
          </Box>
        }
        <ModalDialog
          open={openModal}
          onClose={handleClose}
          url={url}
          onUrlChange={handleUrlChange}
          onChainChange={handleChainChange}
          chainId={chainId}
          chainList={chainList}
          onSubmit={signInWithEthereum}
        />
        <ModalLoginDialog
          open={openLoginModal}
          onClose={handleLoginCloseModal}
          hasError={apiKeyHasError}
          url={url}
          apiKey={apiKey}
          onChange={handleApiChange}
          onSubmit={handleLogin}
        />
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </>
  );
}
