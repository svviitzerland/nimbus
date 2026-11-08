import type { CvssText } from '../../types';

export const en: CvssText = {
	title: 'CVSS',
	intro: [
		'One vulnerability might expose a single invoice. Another might give control of an entire server. <b>CVSS</b>, the Common Vulnerability Scoring System, describes technical severity through metrics and a score from 0 to 10.',
		'Start with evidence. At nimbus.com, try to <b>read data</b>, <b>change a price</b>, and <b>stop the service</b>. These probe confidentiality, integrity, and availability, the [[CIA|security/cia]] concepts we met earlier.',
		'Entry requirements matter too. In the second case, the flaw requires an application admin account. In the third, someone without an account can cause the same impact. Compare them.',
		'After testing a case, reveal its assessment. CVSS considers both impact <b>and</b> exploitation requirements. Counting changed boxes alone does not determine a score.',
		'You may encounter <b>CVSS 2.0, 3.0, 3.1, and 4.0</b> in different reports. Version 2.0 is an older version still found in historical records. Read the version stated by the report publisher.',
		'A <b>vector</b> records the metric choices behind a score. Tap its parts to explore their meaning. Versions may use different metrics and calculations. Changing versions requires more than editing the vector prefix.',
		'This exercise compares <b>Base scores</b>. Assessments for a particular time or environment use additional groups that differ by version. Use [[risk context|security/vulnerability-management]] when deciding remediation priority.',
		'[ingat] <b>Record the version, vector, and score together.</b> The score describes assessed severity, not attack probability or a percentage of security.'
	],
	reactions: {
		restored:
			'The service is running again. Evidence of the earlier outage is kept for the assessment.',
		explore:
			'Choose an action to collect evidence for this case. Watch the server response and the changes that actually occur.',
		invoice_read:
			'The number and total of one invoice are exposed without permission. Confidentiality impact is limited in this case. We have not found a way to change data or stop the service.',
		invoice_write:
			'The price change is rejected. An invoice disclosure does not automatically grant write access. Assess impact from the available evidence.',
		invoice_stop:
			'The service stays available and the stop command is rejected. This flaw has no availability impact in the scenario.',
		admin_needed:
			'The request is rejected before reaching the import feature. This case requires an application admin account. Sign in as an admin and repeat the check.',
		admin_ready:
			'The application admin account is active. This is a privilege needed before exploitation, not one gained afterward.',
		full_read:
			'The import flaw exposes protected data. This case assumes access to all server data, so confidentiality impact is high.',
		full_write:
			'The price changes from 25 to 1. This demonstrates write access. The scenario specifies that all server data can be changed, so integrity impact is high.',
		full_stop:
			'The practice server’s service stops. This scenario allows disruption of the entire service, so availability impact is high.',
		scored_invoice:
			'The invoice evidence shows a limited disclosure. Compare versions to see how the same scenario is assessed under different rules.',
		scored_admin:
			'Impact is high, but an application admin account is needed beforehand. That requirement affects scoring. Compare it with the case requiring no account.',
		scored_public:
			'High impact is possible without an account. This differs from requiring an admin account, and the assessment reflects that.',
		version2:
			'CVSS 2.0 uses Authentication to count authentication requirements. It does not distinguish low and high privileges like versions 3 and 4. The severity labels here use NVD’s version 2 bands.',
		version30:
			'CVSS 3.0 separates initial privileges, user interaction, and Scope. All impacts in this case stay within one security authority, so Scope is Unchanged.',
		version31:
			'CVSS 3.1 clarifies version 3.0 guidance and updates parts of the calculation. These three Base examples score the same in 3.0 and 3.1. That does not make every rule in the versions identical.',
		version4:
			'CVSS 4.0 adds Attack Requirements and separates vulnerable and subsequent system impacts. These three cases have no subsequent system impact.',
		finished:
			'You tested all three cases and compared versions. When reading an advisory, inspect the evidence and vector behind the score before deciding what to do next.'
	},
	cases: {
		invoice: {
			name: 'Invoice',
			title: 'One invoice is exposed',
			brief:
				'The invoice page skips a permission check. Test what a visitor without an account can do.',
			result:
				'Only one invoice number and total are exposed. No data changes or service disruption.'
		},
		admin: {
			name: 'Needs admin',
			title: 'A flaw in the import feature',
			brief:
				'The import feature has a flaw that can give control of the server. Find out who can reach it.',
			result: 'High impact across the server, requiring an application admin account beforehand.'
		},
		public: {
			name: 'No account',
			title: 'The import feature is public',
			brief:
				'The same import flaw is now reachable without an account. Test its impact and compare with the previous case.',
			result: 'High impact across the server without requiring an account beforehand.'
		}
	},
	versions: {
		'2.0':
			'An older version. Authentication counts required authentications rather than privilege levels. NVD’s version 2 bands use Low, Medium, and High.',
		'3.0':
			'Introduced Privileges Required, User Interaction, and Scope. Its severity scale includes Critical.',
		'3.1':
			'Clarifies 3.0 guidance and updates rounding and Environmental calculations. These Base examples score the same as 3.0.',
		'4.0':
			'Uses Attack Requirements and separate vulnerable and subsequent system impacts. The scoring calculation also changes.'
	},
	labels: {
		restore: 'Start service',
		restoreHint: 'The service stopped. Start it again to continue testing.',
		exposed: 'Exposed',
		cases: 'Choose a case',
		case: 'Case',
		tested: 'assessed',
		probe: 'Try it on the practice server',
		read: 'Read data',
		write: 'Change price',
		stop: 'Stop service',
		readDetail: 'Check confidentiality',
		writeDetail: 'Check integrity',
		stopDetail: 'Check availability',
		untried: 'Not tested',
		login: 'Admin login needed',
		limited: 'One invoice exposed',
		fullRead: 'All data exposed',
		fullWrite: 'Price changed',
		fullStop: 'Service stopped',
		denied: 'Rejected',
		signIn: 'Sign in as admin',
		visitor: 'Visitor without an account',
		administrator: 'Application admin',
		client: 'Test browser',
		network: 'Over the network',
		server: 'nimbus.com server',
		running: 'Service running',
		offline: 'Service stopped',
		file: 'Invoice 101',
		files: 'All server data',
		sealed: 'Data not yet exposed',
		invoiceData: 'Order total 25 coins',
		price: 'Product price',
		coins: 'coins',
		assess: 'Reveal CVSS assessment',
		collect: 'Try all three actions to collect evidence.',
		evidence: 'Evidence from this case',
		compare: 'Compare versions',
		nextCase: 'Try the next case',
		scale: 'Severity score',
		none: 'None',
		low: 'Low',
		medium: 'Medium',
		high: 'High',
		critical: 'Critical',
		vector: 'Read the vector',
		vectorHint: 'Tap a part to explore its meaning.',
		assumptions: 'Assessment assumptions',
		assumptionText:
			'All cases use a network path, with no additional conditions or other user’s actions. Impacts stay within one security authority. No subsequent system is affected.',
		versionHint:
			'The case stays the same. The assessment version changes. This is not an automatic vector conversion.',
		complete: 'Three cases complete',
		compareHint: 'Tap another version to compare its assessment.',
		source: 'Read this version’s reference',
		scope:
			'Local simulation with hypothetical cases. It sends no real requests and stops no real servers.',
		response: 'Probe response',
		waiting: 'Choose an action to begin',
		metric: 'Metric meaning',
		value: 'This case’s choice',
		N: 'None',
		L: 'Low',
		H: 'High',
		P: 'Partial',
		C: 'Complete',
		AV_N: 'Network',
		AC_L: 'Low complexity',
		AT_N: 'No additional conditions',
		Au_N: 'No authentication',
		Au_S: 'One authentication',
		PR_N: 'No prior privileges',
		PR_H: 'Application admin privileges',
		UI_N: 'No other user’s action',
		S_U: 'Same security authority'
	},
	metrics: {
		AV: 'The path used to reach the flaw. Every case here can be reached over a network.',
		AC: 'The complexity of exploiting the flaw. These cases require no complex steps or conditions. Detailed definitions differ by version.',
		AT: 'Additional deployment or execution conditions. This case has no extra requirement such as winning a race condition.',
		Au: 'The number of authentications required. In version 2, one authentication does not distinguish a regular account from an admin.',
		PR: 'Privileges needed before exploiting the flaw. These differ from privileges gained afterward.',
		UI: 'Whether another user must act for exploitation to succeed. The attacker is not counted as that other user.',
		S: 'Whether impact crosses the vulnerable component’s security authority. Each case here stays within one authority.',
		C: 'Confidentiality impact, how much information can be exposed without permission.',
		I: 'Integrity impact, how much data can be changed without permission.',
		A: 'Availability impact, how much a service can be disrupted.',
		VC: 'Confidentiality impact on the system containing the flaw.',
		VI: 'Integrity impact on the system containing the flaw.',
		VA: 'Availability impact on the system containing the flaw.',
		SC: 'Confidentiality impact on a subsequent system. This scenario has none.',
		SI: 'Integrity impact on a subsequent system. This scenario has none.',
		SA: 'Availability impact on a subsequent system. This scenario has none.'
	}
};
