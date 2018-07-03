/**
 * Represents an error returned by the server
 *
 * @property {string} code
 * @property {string} message
 * @property {string} userMessage
 */
class ServerError extends Error {
	static SERVER_ERROR = 'server.error';
	static NOT_FOUND = 'request.notFound';
	static INVALID_RESPONSE = 'response.invalid';
	static NETWORK_ERROR = 'request.networkError';
	static UNKNOWN_ERROR = 'unknown';
	static NOT_AUTHENTICATED = 'auth.notAuthenticated';
	static INVALID_TOKEN = 'auth.invalidToken';
	static AUTH_FAILED = 'auth.failed';

	/**
	 * @param {string|null} code
	 * @param {string|null} message
	 * @param {string|null} userMessage
	 */
	constructor(code = null, message = null, userMessage = null) {
		// TODO: Following line does not seem to work: the message is not displayed in the console
		super(`Server Error (${code})${message ? `: ${message}` : ''}`);
		this.code = code;
		this.message = message;
		this.userMessage = userMessage;
	}

	/**
	 * Returns true if this error is the same error code.
	 * @param {string} code
	 */
	is(code) {
		return this.code === code;
	}
}

export default ServerError;
