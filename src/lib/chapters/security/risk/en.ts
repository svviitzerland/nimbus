import type { ExperimentText } from '../../types';
export const en: ExperimentText = {
	labLabel: 'Your experiment',
	hintLabel: 'Hint',
	scope: 'Local model with teaching data. No requests reach a real network.',
	title: 'Assets, threats, vulnerabilities, and risk',
	intro: [
		'Before looking for flaws, decide what you are protecting. That is an <b>asset</b>. At Nimbus, it could be customer data, an admin account, or the ability to accept orders.',
		'A <b>threat</b> can harm an asset. Someone trying to steal data is a threat. A <b>vulnerability</b> is a weakness they can exploit, such as a server returning documents without checking permission.',
		'An <b>exploit</b> is a way to use a flaw. <b>Impact</b> is the resulting harm. In this lab, an unauthorized request can expose a private invoice. Send it and see what comes back.',
		'<b>Risk</b> considers likelihood and impact in your situation. A public product description and a private customer invoice do not have the same consequences when disclosed.',
		'Restrict public access, then try again. This reduces exposure to this threat but leaves the flaw. Enable permission checks and reopen access to test the actual fix.',
		'[ingat] <b>Protect the asset, identify the threat, close the weakness, consider the impact.</b> Risk helps choose actions. We map the routes in [[threat modeling|security/threats]].'
	],
	reactions: {
		privateLeak:
			'A private invoice came back without permission. You have seen the impact, not just the name of a flaw.',
		publicLeak:
			'The product catalog is public. This request does not reveal the same secrets, but the missing permission check still needs review.',
		limited:
			'An outside visitor has no route in this model. Visitors on allowed networks still need permission checks.',
		blocked:
			'The server checked permission and refused the request. Fixing the cause differs from hiding the entrance.'
	},
	goal: 'Separate a weakness from its risk context',
	tasks: ['Observe disclosure', 'Restrict exposure', 'Fix permission checks'],
	hint: 'Send a request. Disable public access and send again. Restore public access, enable permission checks, and retest.',
	labels: {
		probe: 'Send an unauthorized request',
		exposed: 'Endpoint is publicly reachable',
		sensitive: 'Store private invoices',
		patched: 'Check permission before returning data',
		threat: 'Unauthorized visitor',
		fixed: 'Permissions checked',
		vulnerable: 'No permission check',
		asset: 'Asset on the server',
		private: 'Customer invoices',
		public: 'Public product catalog',
		waiting: 'No experiment yet',
		privateLeak: '200 OK, private invoice disclosed',
		publicLeak: '200 OK, public catalog returned',
		limited: 'Outside connection cannot reach the endpoint',
		blocked: '403 Forbidden, no data returned'
	}
};
