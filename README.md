# TokenPlay Frontend
TokenPlay ElectronJS, React based Frontend

The TokenPlay frontend is provided as part of our OpenSource initiative at BlocPlay Entertainment. This source code is released under the Apache2 license. We will update this source code when we see fit.

If you would like more information on this system please contact [Vince McMullin](https://github.com/vamman), CTO.

# Disclaimer

## Alpha

TokenPlay and all of its systems are under heavy active development and we strongly advise against using these systems in production at this time.

# DApp

The Decentralized App ("Dapp") consists of the following core components:
- Home
- Store
- Messaging
- Live Events
- Profile
- Wallet

## Alpha Interface
![TokenPlay Interface](screen/screen1.PNG)

# Online Demo
[TokenPlay Demo](http://demo.tokenplay.com)

The demo currently provided online is a "click through" demo which was seen at GDC 2018. It is a UI/UX demo featuring demo material only.

# Technology Stack
The technology stack includes the following:

Client App
- Node.js
- ElectronJS (App Rendering/Logic Threading)
- React (App Rendering)
- Phoenix Framework (Messaging)
- Bitraider Framework (Distribution, Downloading, Streaming)

Developer App
- Bitraider (Uploading, Distribution, Versoning, Streaming)
- Elixir Web App (Developer Administrator)

Server
- eWallet Backend API (Account/Ledger/Transactions/Tracking)
- Gamer API Backend (Store, Games, Stats)
- EVM Backend (Payment processing via EVM. DEX, Fiat)

Decentralized
- Peer Swarm (DHT based Game Related Data)
- IPFS Filesystem (Store Images, Avatars, Game Packages)

Databases
- Apache Cassandra (Players, Achievements, Stats)
- Postgresql (Accounts, Transactions, Ledger)

Third party web APIs
- Twitch API (Streaming)
- YouTube API (Streaming)
- ESL API (eSports)

# Development
* Install node modules ```yarn install```
* Run ```yarn web```
* Visit [localhost:3000](http://localhost:3000)

# Electron Test
To test how the application looks in Electron.
* ```yarn web``` (wait until it finishes)
* ```export ELECTRON_START_URL=http://localhost:3000 && yarn electron```
* You can show the developer tools with in the "View" menu.

# Electron Build
The following instructions differentiate between the "building machine" (the computer that will build the code) and the "running machine" (the computer that will run the application in Electron). Of course, they can be the same machine.

1. On the *building machine*, install all node modules required to build the application. ```yarn install```
2. Build the files necessary for the Electron app with ```yarn build-electron```.
3. The generated files will be created in ```electron/build/```
4. On the *running machine*, [download the pre-built Electron for the platform](https://github.com/electron/electron/releases).
5. Unzip the downloaded file where you want. We will call this folder the [electron-folder].
6. Copy, from the building machine, the files *inside* ```electron/build``` (do not copy the `build` folder itself, only what is inside) to ```[electron-folder]/resources/app/``` on the running machine.
7. Run the Electron executable in [electron-folder] (ex, on Windows, double click ```[electron-folder]/electron.exe```).
8. You can create a shortcut to ```[electron-folder]/electron.exe```, put it on the desktop, rename it (like "TokenPlay") and even change its icon to give it a more "official" look.

# Tablet Prototype
Suggestion for running the prototype on an Android tablet

* After building the app (```yarn build-web```), take the files in ```dist/``` and upload them to the tablet.
* Install, on the Android tablet, a "full screen browser" (I tried "Fully Kiosk Browser" and it worked well). If using Fully Kiosk Browser, update your device's Chrome application to the latest version.
* Open, from the browser, the local file. Fully Kiosk Browser has a convenient "select file" when specifying the URL to load.
* If using Fully Kiosk Browser settings, go to Web Content Settings and toggle off "Autoplay Videos". Toggle on "Enable Fullscreen Videos". 
