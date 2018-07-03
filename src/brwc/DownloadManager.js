import NBRExtPIpe from './ebrextpipe'
import { UI_CMD, EXT_UI_CTRL } from './brextdef'
import Log from './log'
import { launchProc } from './ProcessLauncher'

// if (process.env.NODE_ENV !== 'production') {
localStorage.setItem('debug', 'brwc-app:*');
// }

class DownloadManager {
    /**
	 * @type {NBRExtPIpe}
	 */
    extpipeObj = null;

    /**
	 * True if download is ongoing.
	 * @type {boolean}
	 */
    downloadInProgress = false;
	
	pendingQuit = false;

	/**
	 * This tells us that streaming or download is ready. Initially BRWC will do initialization and audit before
	 * it can safely resume streaming.
	 * @type {boolean}
	 */
	resumeDownload = false;

	/**
	 * @type {MockObject}
	 */
	downloadingGame = null;
	

	eventCB = null;

	constructor() {
    	this.init();
	}

	logCallback = (logMsg) => {
		// Log.info(logMsg);
	}

	eventCallback = (cmdName, focusCtrl, baCommandData) => {
		switch(cmdName) {
			case UI_CMD.UI_CMD_QUIT:
			case UI_CMD.UI_CMD_QUITONLAUNCH:
				if(focusCtrl === 0) { // there are two quit events passed, we need to catch the main one.
					this.onQuitEvent();
				}
				else if(focusCtrl === 5) {
					this.pendingQuit = true;
					Log.warn(`pendingQuit`);
				}
				
				this.resumeDownload = false;
				break;
			case UI_CMD.UI_CMD_ENABLECTRL:
				if((focusCtrl === EXT_UI_CTRL.extern_PAUSEBTN) || 
					(focusCtrl === EXT_UI_CTRL.extern_REPAIRBTN)) { // there are two quit events passed, we need to catch the main one.
					this.resumeDownload = true;
				}
				break;
			default:
				break;
		}

		if(this.eventCB) {
			this.eventCB(cmdName, focusCtrl, baCommandData);
		}
	}

	registerEventCB(cb) {
		this.eventCB = cb;
	}

	/**
     * Starts the download.
     * @param {string} gameID 
     * @param {string} installPath 
     */
	startDownload(game) {
		if(!this.downloadInProgress) {
			this.downloadingGame = game;
			this.downloadInProgress = true;

			this.eventCB(0, 0, 0); // special event to initialize. It also updates render in the process.

			const gameID = game.package.id;
		    const installPath = game.package.defaultDest;
			const parameters = [`id=${gameID}`, '-brnoui', `brdestpath=${installPath}`];
			launchProc('brwc/BRWC.exe', parameters);
		}
	}
	
	/**
     * Stops the current download.
     */
	stopDownload() {
		if(this.downloadInProgress && !this.pendingQuit) {
			this.extpipeObj.Quit();
		}
	}

	onQuitEvent() {
		this.downloadingGame = null;
		this.downloadInProgress = false;	
		this.pendingQuit = false;
		Log.warn(`reallyQuit`);
	}

	getPctDone() {
		if(this.downloadInProgress) {
			const pct = this.extpipeObj.GetPctDone() / 100;
			return pct.toFixed(4);
		}

		return 0;
	}
	/** 
     * Setup everything we need
    */
	init() {

		if (process.env.NODE_ENV === 'production') {
			const { app } = require('electron').remote;
			app.on('before-quit', () => {
				// NOTE: need a class that will check first if an ongoing download/stream is happening.
				this.shutdown();	
			});
		}

		this.extpipeObj = new NBRExtPIpe();
    	this.extpipeObj.Initialize(this.logCallback, this.eventCallback);
		Log.info('Application init!');
	}

	/**
     * Cleanup
     */
	shutdown() {
		this.stopDownload();
		this.extpipeObj.Shutdown();
		Log.info('Application close!');
	}
}

export default DownloadManager;