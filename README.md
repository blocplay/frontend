Update: July 3, 2018

Internal Bitbucket CL: #dbac355

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
* Install node modules `yarn install`
* If required, copy and rename `etc/env.dev.sample.js` to `etc/env.dev.js` and modify accordingly (read below for custom configurations and mock API). If you want to use the default code in this file, you will want to copy and rename `src/js/mock/mockData.sample.js` to `mockData.js`.
* Run `yarn web`
* Visit [localhost:3000](http://localhost:3000)

## Custom configurations
The app has a list of configurations in `src/js/config.js`. This file is committed so you must not modify it with values specific to your environment. But, you can overwrite any of those configurations in the env file: copy (do not simply rename, copy and rename) `etc/env.dev.sample.js` to `etc/env.dev.js` (remove .sample) and you can overwrite any configuration of `config.js` in the `config` attribute of the env file. This (renamed) file is already in the `.gitignore` and must not be committed.

## Services
The code uses the Inverse of Control pattern with a service container. For example, the class responsible to communicate with the server (with the API) is a service that is requested by the classes that need it. The services are defined in the config, in the `services` attribute. Since the services are defined in the config, they can be replaced with mock classes in a development environment. See below for information about the mock server.

## Mock server
A MockServer class is included in the code allowing you to bypass the real API. You can replace the regular ApiServer instance in the 'server' service with the MockServer. The default `etc/env.dev.sample.js` contains code showing how to use the MockServer. In you custom `etc/env.dev.js` file, use the commented code in the sample file.

This MockServer receives an object describing the data it contains. A file with sample data is provided in `src/js/mock/mockData.sample.js`. If you use the default code in `etc/env.dev.sample.js`, it loads a `mockData.js` file. Simply copy and rename `src/js/mock/mockData.sample.js` to `mockData.js` (remove .sample). This (renamed) file is already in `.gitignore` so you can modify it as you wish.

## Mock conversation socket
When in a conversation, a web socket is used to have real time exchange. Just like the Mock server comment above, this socket is a service that can be overwritten in the env file. The sample env file has code for a mock socket.

This mock socket can be used to trigger events. When using the mock socket, go in any conversation and send the "help" message. You will receive a list of messages you can send to trigger some events. For example, if you send the "typingStarted 0" message, it will simulate the user with index 0 (in the conversation) starting typing.

## Accessing the current user in a React container
You can inject (`@inject()` from mobx-react) the `auth` service and their retrieve the current user with `this.props.auth.getUser()`. But be careful, if the user is logged out, this call returns null. Since when the user is logged out, she/he will be redirected to the login, it may trigger a re-render of your component. If the render then calls `this.props.auth.getUser()`, it will return null and may generate an error. It is thus recommended that your container keeps a reference to the user on mount instead of retrieving it from the Authentication class at each render.

Example:
```jsx harmony
@inject('auth')
@observer
class MyContainer extends React.Component {
    componentWillMount() {
        this.user = this.props.auth.getUser();
    }
    
    render() {
        return <OtherComponent user={this.user} />;
    }
}
```

# WEB BUILD
* `yarn build-web`
* The generated files will be in `web/dist/`.

# ELECTRON TEST
To test (*not* to build) how the application looks in Electron.
* `yarn web` (wait until "webpack: Compiled successfully.") and keep it running
* In parallel, run `export ELECTRON_START_URL=http://localhost:3000 && yarn electron`
* You can show the developer tools with in the "View" menu.

# ELECTRON BUILD

The following instructions differentiate between the "building machine" (the computer that will build the code) and the "running machine" (the computer that will run the application in Electron). Of course, they can be the same machine.

1. On the *building machine*, install all node modules required to build the application. `yarn install`
2. Build the files necessary for the Electron app with `yarn build-electron`.
3. The generated files will be created in `electron/build/`
4. There are two ways to create the package, via `yarn dist` and `yarn package-win`. These are scripts that uses `electron-builder` and `electron-packager` respectively.
5. On the *running machine*, you can copy the `dist/win-unpacked/` or `release-builds/tokenplay-win32-x64/`.
6. Run the Electron executable in [electron-folder] (ex, on Windows, double click `[electron-folder]/TokenPlay.exe`).
7. You can create a shortcut to `[electron-folder]/TokenPlay.exe`, put it on the desktop, rename it (like "TokenPlay") and even change its icon to give it a more "official" look.
8. Or you can use the installer `dist/TokenPlay Setup 0.1.0.exe` which will create the shortcut link for you automatically.

# TABLET PROTOTYPE
Suggestion for running the prototype on an Android tablet

* After building the app (`yarn build-web`), take the files in `dist/` and upload them to the tablet.
* Install, on the Android tablet, a "full screen browser" (I tried "Fully Kiosk Browser" and it worked well). If using Fully Kiosk Browser, update your device's Chrome application to the latest version.
* Open, from the browser, the local file. Fully Kiosk Browser has a convenient "select file" when specifying the URL to load.
* If using Fully Kiosk Browser settings, go to Web Content Settings and toggle off "Autoplay Videos". Toggle on "Enable Fullscreen Videos". 
