import type { ExperimentText } from '../../types';

export const en: ExperimentText = {
	title: 'Access control and IDOR',
	intro: [
		'Nim has signed in to nimbus.com. The server knows who Nim is. That is <b>authentication</b>. Does it mean Nim may read every invoice? No.',
		'<b>Authorization</b> checks permission for a specific action and resource. Invoice 101 belongs to Nim; 102 belongs to Ari. Try both before enabling the ownership check.',
		'Changing a number in a request should not reveal another person’s data. If it does, the flaw may be <b>IDOR</b>, object access without sufficient authorization.',
		'Put the check on the <b>server</b>. Compare the invoice owner with the user from the verified session. Hiding a browser button is not enough.',
		'[ingat] <b>Login answers who. Authorization answers what is allowed.</b> Retry Ari’s invoice, then confirm Nim can still read their own.'
	],
	reactions: {
		own: 'Invoice 101 belongs to Nim. This request should return 200.',
		leaked:
			'Ari’s invoice is visible through Nim’s session. The flaw is missing authorization, not just a guessable invoice number.',
		blocked:
			'403. The server recognizes Nim but denies access to Ari’s invoice. Switch to 101 to verify legitimate access still works.'
	},
	labLabel: 'Your experiment',
	goal: 'Keep Ari’s invoice private',
	tasks: ['Read your invoice', 'Test another account’s invoice', 'Enforce ownership'],
	hintLabel: 'Hint',
	hint: 'Request 101, then 102. Enable the ownership check and request 102 again. Finally verify 101 still returns 200.',
	scope: 'Local simulation. All examples run in this page without contacting nimbus.com.',
	labels: {
		invoice: 'Invoice number',
		send: 'Request invoice',
		session:
			'Verified session belongs to Nim. Changing an invoice number does not change this identity.',
		guard: 'Check ownership on the server',
		request: 'Browser request',
		response: 'Server response',
		waiting: 'Send a request to see the result'
	}
};
