import type { IdsText } from './types';

export const en: IdsText = {
	title: 'IDS and IPS',
	intro: [
		'Your [[firewall|networking/firewall]] is like a doorman with a guest list. It checks who is coming and which door they want. But what if a guest is on the list and carries something nasty in their bag?',
		'An <b>IDS</b> (Intrusion Detection System) looks inside the bag. It reads every request going past and compares it with a list of known attack tricks, called <b>signatures</b>. A match rings the alarm.',
		'It also learns what normal looks like. One visitor trying the login page three hundred times a minute is not normal, even when every single request looks polite.',
		'An <b>IPS</b> (Intrusion Prevention System) does all that and can also stop the request on the spot. An IDS is a security camera that calls you, an IPS is a guard who shuts the door.',
		"The hard part is tuning. Too strict, and a real visitor named O'Brien gets blocked because of the apostrophe in his name (a <b>false positive</b>). Too relaxed, and a disguised attack slips past (a <b>false negative</b>).",
		'[fyi] The idea is older than the web. In 1987 the researcher Dorothy Denning described spotting intruders by behavior that does not look normal, and in 1998 Martin Roesch released <b>Snort</b>, a free IDS still used today. In the cloud you can rent one as a ready made service.',
		'[ingat] IDS has a D for detect, it watches and tells. IPS has a P for prevent, it steps in and stops.',
		'Your turn, if you like. Switch the guard between camera mode and guard mode, and watch what happens to the very same attacks.'
	],
	reactions: {
		ids: 'Camera mode. Every attack still reaches the server, but now someone gets told about it. Useful, just slower.',
		ips: 'Guard mode. The attacks stop at the booth and never touch nimbus.com.'
	},
	steps: [
		{
			title: 'The firewall',
			body: 'A firewall checks the <b>address and door</b> of each visitor. It never opens the bag.'
		},
		{
			title: 'Signatures',
			body: 'An IDS compares every request with known attack <b>signatures</b>, like a board of wanted faces.'
		},
		{
			title: 'Not normal',
			body: 'It also flags behavior that is <b>out of the ordinary</b>, like far too many tries from one place.'
		},
		{
			title: 'Alarm or block',
			body: 'An <b>IDS</b> only raises the alarm. An <b>IPS</b> stands right in the path and blocks.'
		},
		{
			title: 'Tuning',
			body: '<b>False positive</b>, a good visitor blocked. <b>False negative</b>, a real attack missed. You trade one for the other.'
		},
		{
			tag: 'By the way',
			title: 'An old idea',
			body: 'Snort is still free. Cloud providers sell the same idea as a service, often called a <b>WAF</b> (web application firewall).'
		},
		{
			tag: 'Remember it',
			title: 'D or P',
			body: 'D is for <b>detect</b>, P is for <b>prevent</b>.'
		},
		{
			tag: 'Your turn',
			title: 'Camera or guard',
			body: 'Switch modes and watch the same two attacks arrive.'
		}
	],
	internetLabel: 'Internet',
	serverLabel: 'nimbus.com',
	firewallName: 'Firewall',
	idsName: 'IDS',
	ipsName: 'IPS',
	verdicts: {
		pass: 'Door 443, come in',
		ok: 'Looks normal',
		alarm: 'Attack, alarm sent',
		blocked: 'Attack, blocked',
		unusual: 'Not normal, alarm',
		falsePos: 'Blocked by mistake',
		falseNeg: 'Missed it'
	},
	cameraMode: 'Camera (IDS)',
	guardMode: 'Guard (IPS)'
};
