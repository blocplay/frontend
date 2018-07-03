/**
 * ======================
 * ======================
 * ======================
 * DO NOT USE THIS CLASS, IT WILL BE REMOVED!!!!
 * If you need to have instances that should be shared throughout the app,
 * use "services" instead (see config.js)
 * ======================
 * ======================
 * ======================
 */
class Application {
	/**
	 * @type {DownloadManager}
	 */
	downloadManager = null;
	
	/**
	 * @param {DownloadManager} downloadManager
	 */
	constructor(downloadManager) {
		this.downloadManager = downloadManager;
	}
}

export default Application;
