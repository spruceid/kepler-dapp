# Kepler DApp

An example DApp which uses SIWE to authenticate with Kepler, and provides an interface for submitting and retrieving files.

## Quickstart: Kepler+SIWE

This guide will take you through the steps of getting Kepler running and creating an orbit using this Dapp. The steps below will assume you are using a Unix shell. If you are on a Windows machine I would recommend using [WSL2](https://docs.microsoft.com/en-us/windows/wsl/about).

### Step 0: Requirements

In order to complete this quickstart guide you will all of the following tools:
- [git](https://git-scm.com)

To run Kepler:
- [rustup](https://www.rust-lang.org/tools/install)

To run this Dapp:
- [node](https://nodejs.dev) >= 12.0.0. If you have any errors when running the Dapp try using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to downgrade node to version 12.
- [yarn](https://yarnpkg.com)
- a browser with the [metamask wallet extension](https://metamask.io), and a ethereum account connected to the wallet

If you are using WSL or another minimal Linux installation you may need to install the following to run Kepler:
- pkg-config
- libssl-dev
- gcc

For example on Ubuntu you could run:
```
sudo apt-get update
sudo apt-get install pkg-config libssl-dev build-essential
```

### Step 1: Running Kepler locally

This quickstart guide will assume you are running a particular version of Kepler on your local machine. The steps below will guide you through the process of getting Kepler running.

1. Browse to a suitable directory on your machine, clone Kepler and change to that directory.
```bash
git clone https://github.com/spruceid/kepler.git
cd kepler
```

2. Install version 1.56.0 of the Rust toolchain, and set an override for the current directory to use this version (make sure you are in the kepler directory before running this command). 
```bash
# This version of the rust toolchain is currently required as there is a bug
# in the current stable version, causing Cargo to hang when building Kepler.
rustup install 1.56.0
rustup override set 1.56.0
```

3. Checkout the correct branch of Kepler.
```bash
git checkout origin/feat/siwe-kepler-quickstart
```

4. Choose a location and create a directory for Kepler to store data locally.
```bash
mkdir /tmp/kepler
```

5a. Set some required environment variables.
```bash
# Use the directory you created in step 4 here:
export KEPLER_DATABASE_PATH=/tmp/kepler
export KEPLER_ORBITS_PUBLIC=true
export RUST_LOG=INFO
```

5b. __Optional__: choose some alternative ports for kepler to use if the default ones clash with something else running on your machine:
```bash
# These are the defaults:
export KEPLER_PORT=8000
export KEPLER_RELAY_PORT=5000
```

6. Run Kepler!
```bash
cargo run
```
Note: on a fresh WSL2 instance or other minimal Linux installations you may get an error when trying to build Kepler about missing `pkg-config` or `openssl`. You should be able to resolve this by installing both, i.e.
```bash
sudo apt-get update
sudo apt-get install pkg-config openssl
# Try again
cargo run
```


### Step 2: Running the Dapp.
At this point you should have Kepler running in a shell. You should now open a new shell window (or WSL instance) to run the Dapp from.


1. Browse to a suitable directory on your machine, clone Kepler-Dapp and change to that directory.
```bash
git clone https://github.com/spruceid/kepler-dapp.git
cd kepler-dapp
```

2. Checkout this branch of kepler-dapp.
```bash
git checkout feat/siwe-kepler-quickstart
```

3. __NOTE__: if you are using WSL you should skip this step.

To avoid requests being blocked by your browser's CORS policy, you will need to add an network alias for the loopback address. Make up a domain name, and add a new entry to your hosts file (`/etc/hosts` on Unix, `C:\WINDOWS\system32\drivers\etc\hosts` on Windows).
```
#For example you could add this line to the bottom of your hosts file:
127.0.0.1	test.mydomain.com
```

4. Set the below environment variable to point to your running Kepler application, using the domain name you chose above and the Kepler port (default is 8000).
```bash
export KEPLER_URLS=http://test.mydomain.com:8000
# WSL users: if you skipped the above step, then run this instead:
export KEPLER_URLS=http://localhost:8000
```

5. Install the dependencies and run the Dapp!
```bash
yarn install
yarn run dev
```


### Step 3: Using the Dapp.

1. Open the Dapp in your browser, at http://localhost:9080/index.html unless you chose a different domain name above. Be patient as this may take a couple of minutes to load the first time.

2. Click the 'Launch App' button in the top right corner. The Dapp page will open.

3. Click the 'Connect Wallet' button in the top right corner (you will need Metamask installed for this). Two dialogue boxes will appear sequentially, asking permission for Metamask to share the public keys for your connected ethereum accounts with the webpage. Permit both to continue. The 'Connect Wallet' button should have been replaced by your ethereum public key.

4. Click the 'Create new orbit' button. A dialogue box will appear asking you to sign a SIWE message with your ethereum account. By signing this message you are requesting Kepler to create and host an orbit with your ethereum account as the only controller. Click the 'Sign' button to continue. Another dialogue box will appear asking you to sign a SIWE message. By signing this message you are delegating access to your orbit to a session key, allowing you to interact with Kepler for the duration of the session without signing any more messages. Click the 'Sign' button to continue.

5. At this point you can start interacting with your orbit. Try clicking the ![cloud upload icon](https://upload.wikimedia.org/wikipedia/commons/2/27/Noun_Project_cloud_upload_icon_411593_cc.svg "cloud upload icon") to upload a file into your orbit!
