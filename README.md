# Siwe-local

This app allows the possibility to create Siwe Messages and sign them via Metamask. 
It returns a JSON object that can be copied and used via Postman or any other similar app to login
to Unblock API as it relies on Siwe (Sign-In with Ethereum) to handle the authentication

Important: This app runs with Metamask only for the moment

## Setup and run the app

Clone the repository and run:

```
yarn
```

After the dependencies are installed start the app by running this command:

```
yarn start
```

The app will run by default on http://localhost:3000/

Before generating a signed Siwe message a wallet must be connected via Connect button. 
Afterwards the message can be generated and signed via Metamask.

Important:

To change between wallet's the user must disconnect the current wallet on Metamask widget 
(the app checks every 1 minute to see if the wallet is still connected) and click on Connect button to 
select a new wallet to generate a signed Siwe message