import logo from '../assets/UnblockLogo.png';

export const URL_LIST = [
  {
    url: "https://sandbox.getunblock.com",
    description: "Unblock Sandbox",
  },
  {
    url: "https://sandbox.getunblock.com/fiat-connect",
    description: "Unblock Fiat-Connect Sandbox",
  },
  {
    url: "https://api.getunblock.com",
    description: "Unblock Prod",
  },
  {
    url: "https://api.getunblock.com/fiat-connect",
    description: "Unblock Fiat-Connect Prod",
  }
];

export const CHAIN_LIST = [
  {
    id: "137",
    description: "Polygon Mainnet",
    url: "https://api.getunblock.com",
  },
  {
    id: "80002",
    description: "Amoy Testnet",
    url: "https://sandbox.getunblock.com",
  },
  {
    id: "10",
    description: "Optimism Mainnet",
    url: "https://api.getunblock.com",
  },
  {
    id: "420",
    description: "Optimism Testnet",
    url: "https://sandbox.getunblock.com",
  },
  {
    id: "42220",
    description: "Celo Mainnet",
    url: "https://api.getunblock.com/fiat-connect",
  },
  {
    id: "44787",
    description: "Celo (Alfajores Testnet)",
    url: "https://sandbox.getunblock.com/fiat-connect",
  }
];

// Onboard settings
export const chains = [
  {
    id: 137,
    token: 'MATIC',
    label: 'Matic Mainnet',
    rpcUrl: 'https://polygon-mainnet.infura.io'
  },
  {
    id: 80001,
    token: 'MATIC',
    label: 'Polygon Mumbai',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com/',
  },
  {
    id: 10,
    token: 'ETH',
    label: 'Optimism Mainnet',
    rpcUrl: 'https://optimism-mainnet.infura.io'
  },
  {
    id: 420,
    token: 'ETH',
    label: 'Optimism Goerli Testnet',
    rpcUrl: 'https://goerli.optimism.io/'
  },
  {
    id: 42220,
    token: 'MATIC',
    label: 'Celo Mainnet',
    rpcUrl: 'https://celo-mainnet.infura.io'
  },
  {
    id: 44787,
    token: 'MATIC',
    label: 'Celo Alfajores',
    rpcUrl: 'https://alfajores-forno.celo-testnet.org'
  },
]

export const appMetadata = {
  name: 'Unblocker',
  icon: logo,
  description: 'Unblocker using Onboard',
  recommendedInjectedWallets: [
    { name: 'MetaMask', url: 'https://metamask.io' }
  ]
}

// Disclaimer's text values

export const disclaimerText = 'Select only one wallet if you have multiple wallets. To use a different wallet please disconnect the current one from Metamask or WalletConnect and click on Connect to choose a different one.';
export const disclaimerGenerateMessageText = `You might see a warning when signing the message with MetaMask since Unblocker creates a message to be signed for a different domain than Unblocker domain: ${new URL(window.location.href).hostname}`;
export const disclaimerMessageText = 'Copy the object below and use it on Postman or any similar tool to login on the selected URL or click on the login button.';
export const disclaimerLogin = 'Do no attempt to login more than once with the same SIWE message (nonce will be in use) - generate a new message then login. Unblock Session Id has a duration of 4 hours - after this threshold is reached please generate a new message & login';
