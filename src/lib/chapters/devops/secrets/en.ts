import type { ExperimentText } from '../../types';

export const en: ExperimentText = {
	title: 'Application secrets and key rotation',
	intro: [
		'An API key grants an application access to a service. If a secret key is included in browser JavaScript, visitors can read it in downloaded files. Inspect the browser code.',
		'For a service with a secret key, the browser calls our backend. The backend reads the key from its environment or a secret manager and calls the service. The key stays out of the browser.',
		'Move the key to the server. Now try the old copy that already leaked. It still works. Moving code does not revoke a key.',
		'<b>Rotation</b> creates a new key, updates the application, and revokes the old key. The lab button combines these steps. The old copy should fail while the app still receives 200.',
		'[ingat] <b>Move the secret, replace the key.</b> In a real application, also restrict key permissions and access to your backend endpoint.'
	],
	reactions: {
		exposed:
			'The key is visible in browser.js. An obscure name or minified code does not make it secret.',
		moved:
			'Inspect the browser code again. The backend should hold the key while the browser requests the result.',
		stillValid: 'The old copy still gets 200. A leaked key stays usable until revoked.',
		rotated: 'The server has the new key and the old key is revoked. Test both paths to verify.',
		revoked: '401. The old copy is no longer accepted. Now verify the legitimate app still works.',
		works: 'The legitimate app gets 200. Compare it with the old key copy to verify the full fix.',
		broken:
			'The browser still uses the revoked key. Route the call through the backend with the new key.'
	},
	labLabel: 'Your experiment',
	goal: 'Close the leak while keeping the app working',
	tasks: [
		'Find the browser key',
		'Move it to the server',
		'Revoke the old key',
		'Verify the app still works'
	],
	hintLabel: 'Hint',
	hint: 'Inspect the code, move the key, try the old copy, then rotate. Test the old copy and the app again.',
	scope: 'NIM_DEMO_V1 and NIM_DEMO_V2 are fake simulation keys. No external service is called.',
	labels: {
		inspect: 'Inspect browser code',
		move: 'Keep the secret on the server',
		rotate: 'Rotate and revoke old key',
		hidden: 'Inspect the code to see its contents',
		noServer: 'The browser calls the service directly',
		stolen: 'Try old key copy',
		visit: 'Run the app',
		waiting: 'No calls yet'
	}
};
