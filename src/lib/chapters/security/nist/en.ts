import type { ExperimentText } from '../../types';
export const en: ExperimentText = {
	labLabel: 'Your experiment',
	hintLabel: 'Hint',
	scope:
		'A compact CSF 2.0 scenario. Each function includes many more outcomes and activities in real practice.',
	title: 'NIST CSF 2.0',
	intro: [
		'<b>NIST</b> is the National Institute of Standards and Technology, a US measurement and standards agency. One of its security resources is the <b>Cybersecurity Framework</b>, or CSF.',
		'<b>CSF 2.0</b> helps organizations describe desired security outcomes. Its six functions operate together and continuously; checking six boxes once does not guarantee security.',
		'<b>Govern</b> sets direction and responsibility. <b>Identify</b> establishes assets and risks. <b>Protect</b> prepares safeguards. In this small team, assign Ari, inventory the servers, and test a backup before trouble starts.',
		'Now start the practice incident. <b>Detect</b> finds suspicious activity. <b>Respond</b> manages and contains its impact. <b>Recover</b> restores services to a trusted state.',
		'A backup alone is not enough. In the lab, isolate the affected server before restoring the clean copy. In real work, address the cause, preserve evidence, coordinate recovery, and verify the service.',
		'[ingat] <b>Govern, identify, protect, detect, respond, recover.</b> NIST is the organization; CSF is the framework we are using.'
	],
	reactions: {
		govern:
			'Now the decision owner is clear. Security includes responsibility as well as equipment.',
		identify:
			'Three servers are recorded. An inventory helps people know what to protect and who owns it.',
		protect:
			'A clean copy has been created and tested. Recovery capability is prepared before it is needed.',
		detect:
			'Alerts and records show unusual activity. That is a reason to investigate, not to guess every cause.',
		respond:
			'The affected server is isolated. Spread is contained while the team addresses causes and preserves evidence.',
		recover:
			'The clean copy serves requests again. Verify the service and improve the plan using what you learned.',
		incident:
			'The practice server is disrupted. Use detection, response, and recovery to handle it.',
		tooLate:
			'This scenario needs a clean copy prepared before the incident. Restart the experiment and prepare a backup first.',
		noIncident:
			'No practice incident yet. This action becomes useful after you start the disruption.',
		notReady: 'Recovery needs a tested clean backup and an isolated affected server.'
	},
	goal: 'Use the framework in a concrete incident',
	tasks: ['Govern', 'Identify', 'Protect', 'Detect', 'Respond', 'Recover'],
	hint: 'Assign an owner, inventory assets, and test a backup. Start the incident. Review alerts, isolate the server, and restore.',
	labels: {
		incidentButton: 'Start the practice incident',
		governAction: 'Assign an accountable owner',
		identifyAction: 'Inventory service assets',
		protectAction: 'Create and test a backup',
		detectAction: 'Review alerts and logs',
		respondAction: 'Isolate the affected server',
		recoverAction: 'Restore the clean copy',
		backup: 'Clean backup',
		ready: 'Team is preparing the service',
		govern: 'Ari owns the decisions',
		identify: 'Three servers inventoried',
		protect: 'Backup ready and tested',
		detect: 'Suspicious activity detected',
		respond: 'Affected server isolated',
		recover: 'Service restored and checked',
		incident: 'Incident in progress',
		tooLate: 'No clean backup from before the incident',
		noIncident: 'No practice incident yet',
		notReady: 'Prepare backup and isolation before recovery',
		owner: 'Accountable owner',
		inventory: 'Servers recorded',
		service: 'Service state',
		unknown: 'not yet known',
		running: 'running',
		affected: 'disrupted',
		isolated: 'isolated',
		restored: 'restored'
	}
};
