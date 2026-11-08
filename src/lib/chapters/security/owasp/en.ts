import type { SecurityCatalogText } from '../../types';
export const en: SecurityCatalogText = {
	labLabel: 'Your experiment',
	hintLabel: 'Hint',
	scope:
		'Local examples for OWASP Top 10 2025 categories, not a scanner or security certification. Each control addresses only the modeled condition.',
	title: 'OWASP Top 10',
	intro: [
		'<b>OWASP</b> is the Open Worldwide Application Security Project, a community and foundation helping people build safer software. You will encounter its resources when developing and testing applications.',
		'The <b>OWASP Top 10</b> introduces important web application risk categories. This lab uses the <b>2025</b> edition. It builds awareness rather than providing an exhaustive testing list or a guarantee of security.',
		'Choose a category. Run the experiment with its control off, inspect the outcome, enable the control, and repeat. An ownership check, for example, changes another account’s invoice access from accepted to denied.',
		'Categories provide a map. <b>ASVS</b> helps define what to verify. <b>WSTG</b> helps plan security tests. The <b>Cheat Sheet Series</b> provides focused implementation guidance.',
		'[ingat] <b>The Top 10 names problem groups; request evidence shows what happened.</b> Explain the cause, impact, and fix in a report, rather than only labeling it A01.'
	],
	reactions: {
		exposed:
			'The experiment shows behavior without the control. Record the input and output before changing anything.',
		fixed:
			'The control changes this scenario’s outcome. Test legitimate requirements too before considering the fix complete.'
	},
	goal: 'Connect ten categories to concrete behavior',
	tasks: ['Observe the initial behavior', 'Test a control', 'Compare three categories'],
	hint: 'Run a category without its control, enable the control, and repeat. Do the same with two other categories. All ten are available to explore.',
	labels: {
		run: 'Run experiment',
		compared: 'categories compared',
		category: 'OWASP 2025 category',
		result: 'Server outcome',
		waiting: 'No result yet',
		resources: 'Choose the resource for the task',
		asvs: 'ASVS, requirements for application security verification.',
		wstg: 'WSTG, guidance for web security testing.',
		cheatsheet: 'Cheat Sheet Series, focused control implementation guidance.'
	},
	cases: [
		{
			id: 'A01',
			title: 'Broken Access Control',
			request: 'GET /invoices/102\nSession user = Nim',
			scene: 'Nim requests Ari’s invoice. Being signed in does not authorize every invoice.',
			control: 'Check invoice ownership',
			explanation: 'Check object authorization on the server for every request.',
			before: '200 OK\nowner = Ari\ntotal = 40',
			after: '403 Forbidden\nNo invoice returned'
		},
		{
			id: 'A02',
			title: 'Security Misconfiguration',
			request: 'GET /debug',
			scene: 'Production debug mode exposes internal configuration to visitors.',
			control: 'Disable the public debug endpoint',
			explanation: 'Secure configuration limits information and capabilities visitors do not need.',
			before: '200 OK\nDB_HOST = internal-db\nmode = debug',
			after: '404 Not Found\nNo debug configuration returned'
		},
		{
			id: 'A03',
			title: 'Software Supply Chain Failures',
			request: 'BUILD nimbus.com\nDependency artifact digest = changed',
			scene: 'A dependency artifact received during the build differs from the approved artifact.',
			control: 'Pin versions and verify artifact integrity',
			explanation:
				'Know dependency provenance and verify what enters the build. A lockfile alone does not prove a package is safe.',
			before: 'BUILD accepted\nUnverified dependency included',
			after: 'BUILD rejected\nArtifact digest mismatch'
		},
		{
			id: 'A04',
			title: 'Cryptographic Failures',
			request: 'OBSERVE /profile response in transit',
			scene: 'Profile data travels without protection for its contents.',
			control: 'Use verified TLS',
			explanation:
				'Transport protection secures the journey. Storage and key management require separate checks.',
			before: 'Visible profile\nname = Nim\naddress = Nimbus Street 1',
			after: 'Encrypted application payload\nProfile not readable on the wire'
		},
		{
			id: 'A05',
			title: 'Injection',
			request: "SEARCH products\ninput = ' OR 1=1",
			scene: 'Search text is concatenated into a database command and becomes an instruction.',
			control: 'Use query parameters',
			explanation: 'Parameters keep input data separate from SQL command structure.',
			before: 'Query changed\nAll product rows returned',
			after: 'Input treated as a literal value\n0 matching products'
		},
		{
			id: 'A06',
			title: 'Insecure Design',
			request: 'REDEEM coupon NIM10 for the second time',
			scene: 'The one coupon per account rule exists in the UI but not in the server transaction.',
			control: 'Enforce coupon limits in the server transaction',
			explanation: 'Design must address business rule abuse, not just valid input syntax.',
			before: '200 OK\nDiscount applied again',
			after: '409 Conflict\nCoupon already redeemed by this account'
		},
		{
			id: 'A07',
			title: 'Authentication Failures',
			request: 'LOGIN with a stolen password only',
			scene: 'In this case the attacker has the password but not the second factor.',
			control: 'Require the appropriate second factor',
			explanation:
				'MFA limits password only attacks. Prefer phishing resistant methods and protect account recovery.',
			before: 'Session created\nPassword alone accepted',
			after: 'Second factor required\nNo authenticated session created'
		},
		{
			id: 'A08',
			title: 'Software or Data Integrity Failures',
			request: 'INSTALL update with a modified payload',
			scene:
				'An update package was modified after publication. Its signature no longer matches the payload.',
			control: 'Verify the signature from a trusted publisher',
			explanation:
				'Verify update integrity and provenance before execution. Signing an already malicious package does not make it safe.',
			before: 'INSTALL accepted\nModified payload executed',
			after: 'INSTALL blocked\nSignature verification failed'
		},
		{
			id: 'A09',
			title: 'Security Logging and Alerting Failures',
			request: 'OBSERVE 20 failed sign-ins in one minute',
			scene:
				'Repeated login failures are neither recorded nor monitored. The team loses evidence to investigate.',
			control: 'Record failures and trigger a measured alert',
			explanation:
				'Logs supply evidence and alerts direct attention. Suspicious activity is not itself proof of compromise.',
			before: '0 stored events\nNo alert',
			after: '20 failure events recorded\nAlert queued for investigation'
		},
		{
			id: 'A10',
			title: 'Mishandling of Exceptional Conditions',
			request: 'CHECKOUT when the payment service times out',
			scene: 'The payment service times out, but the application assumes the payment succeeded.',
			control: 'Handle timeout without marking payment complete',
			explanation:
				'On errors, preserve security rules and consistency. Record state for review and safe retry.',
			before: 'Order marked PAID\nNo payment confirmation',
			after: 'Payment remains PENDING\nRetry requires reconciliation'
		}
	]
};
