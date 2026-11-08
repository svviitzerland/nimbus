import type { ExperimentText } from '../../types';

export const en: ExperimentText = {
	title: 'Finding bugs with DevTools',
	intro: [
		'The shop opens, but its product is missing. Start with evidence. <b>DevTools</b> is built into the browser to inspect pages, code, and traffic.',
		'Open the desktop browser’s developer tools. The <b>Network</b> tab records requests. Reload with it open to capture the page’s data traffic.',
		'Reload this lab, then open its request row. <b>404</b> means the requested resource was not found. Compare the sent path with the intended route.',
		'The path says <b>prodcut</b> instead of <b>products</b>. Fix the source path and reload. A 200 response and visible product confirm the fix.',
		'[ingat] <b>Reproduce, inspect, change, retest.</b> Console helps read errors. Network shows what was sent and received.'
	],
	reactions: {
		failed: 'You reproduced the issue. Open the 404 request in Network to inspect the exact path.',
		inspected:
			'Now you have evidence. The browser path must match a server route, including its spelling.',
		fixed: 'The product appears and the request returns 200. A small fix with a visible result.'
	},
	labLabel: 'Your experiment',
	goal: 'Find why the product is missing',
	tasks: ['Reproduce the problem', 'Inspect the failed request', 'Fix and retry'],
	hintLabel: 'Hint',
	hint: 'Reload, inspect the 404 row, select /api/products in the source, then reload again.',
	scope: 'Local simulation. All examples run in this page without contacting nimbus.com.',
	labels: {
		reload: 'Reload shop',
		browser: 'Your browser',
		shop: 'Nimbus shop',
		product: 'Nimbus notebook, 25 coins',
		empty: 'No product yet',
		source: 'Path in source code',
		inspect: 'Open the request row for details',
		waiting: 'No requests recorded'
	}
};
