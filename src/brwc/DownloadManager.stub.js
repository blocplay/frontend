/**
 * This is a stub for web build so it doesn't do anything.
 */
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
	 * @type {MockObject}
	 */
	downloadingGame = null;
	

	eventCB = null;

	constructor() {
    	this.init();
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
	}
	
	/**
     * Stops the current download.
     */
	stopDownload() {
	}

	onQuitEvent() {
	}

	getPctDone() { 
		return 0;
	}
	/** 
     * Setup everything we need
    */
	init() {
	}

	/**
     * Cleanup
     */
	shutdown() {
	}
}

export default DownloadManager;