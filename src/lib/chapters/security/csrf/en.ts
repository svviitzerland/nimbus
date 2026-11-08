import type { ExperimentText } from '../../types';
export const en: ExperimentText = {
	labLabel: 'Your experiment',
	hintLabel: 'Hint',
	scope:
		'A local cookie based POST model. With Strict off, the model assumes cross site cookies are allowed. Real behavior depends on cookie attributes and browser policy.',
	title: 'CSRF',
	intro: [
		'You are still signed in to nimbus.com when you open another page. Under some conditions, that page can cause your browser to send a request to nimbus.com with its session cookie attached automatically.',
		'<b>CSRF</b>, cross site request forgery, uses that behavior to cause an unintended action. A cookie identifies a session but does not prove you intended to change your profile.',
		'Send a request from the outside page in the lab. The account name changes without a form submission on Nimbus. An attacker need not read the response for the server action to occur.',
		'Enable the <b>CSRF token</b> check. The official form has a token associated with the session that the server verifies. The outside page in this model does not know that token, so its request is rejected.',
		'<b>SameSite</b> controls when a cookie accompanies cross site requests. Strict withholds it from the outside page here. Real applications can also validate Origin and use appropriate framework protections.',
		'[ingat] <b>A cookie identifies the session; a token helps verify the action’s origin.</b> Test the official form too so the protection still permits intended work.'
	],
	reactions: {
		forged:
			'The forged request carried the login cookie and changed the name. Without the token check, the server did not distinguish the intended form from an outside request.',
		blocked:
			'The token is invalid. The server returns 403 without changing the name. Now try the Nimbus form.',
		valid:
			'The Nimbus form has the expected session and token. The user’s intended change still works.',
		cookie:
			'The cookie was withheld from this cross site request. The server does not see a signed in session and returns 401.'
	},
	goal: 'Protect profile changes while keeping the form usable',
	tasks: ['Try an outside request', 'Reject a missing token', 'Test the official form'],
	hint: 'Send from outside with both protections off. Enable token checking and repeat. Select nimbus.com and send again.',
	labels: {
		source: 'Page triggering the request',
		outside: 'A page outside Nimbus',
		send: 'Send the name change',
		token: 'Server checks the CSRF token',
		strict: 'Cookie uses SameSite Strict',
		cookieNote:
			'The model begins with cross site cookies allowed. SameSite Lax has other rules and is not modeled here.',
		request: 'Request to the Nimbus server',
		account: 'Saved account name',
		waiting: 'No response yet'
	}
};
