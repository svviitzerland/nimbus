import type { DetectionText } from './types';

export const en: DetectionText = {
	title: 'Logs and SIEM',
	intro: [
		'In 1986 Cliff Stoll, an astronomer looking after the computers at a lab in California, noticed the accounting was off by 75 cents. Just 75 cents.',
		"He did not let it go. He dug through the <b>logs</b>, the diaries where computers write down everything that happens, who logged in, when, and from where. The trail led to a hacker in Germany selling secrets to the Soviet KGB. Stoll told the whole story in the book The Cuckoo's Egg.",
		'Every server keeps logs. [[Monitoring|compute/monitoring]] shows health numbers like CPU, while logs tell the story behind those numbers, line by line. The trouble is, a busy site writes millions of lines a day, and no human can read them all.',
		'That is why teams use a <b>SIEM</b> (Security Information and Event Management, people say it like "sim"). It gathers the logs from every server into one place, connects the dots, and raises an alert when a pattern looks like an attack.',
		'[fyi] Alerts only help if someone reads them. During the 2013 Target breach, their security tools did raise alerts while the attackers were inside, but nobody acted on the warnings in time.',
		'[ingat] Repeated failed logins can indicate an attack. Correlate the time, source, accounts, and other activity before drawing a conclusion.',
		'Here are the latest logs from nimbus.com. Somewhere in there, someone is trying to guess a password (a [[brute force|security/brute-force]] attack). Search the logs, find the attacker, then let the SIEM take over.'
	],
	reactions: {
		search:
			'Good instinct. Searching shrinks a mountain of lines down to the ones that matter. Now tap a line to see everything that address has been up to.',
		innocent:
			'That address looks like a real person. Normal page visits, or a couple of wrong passwords followed by a success, is just someone with sleepy fingers. Look for an address that fails over and over.',
		found:
			'Got it. One address failed to log in dozens of times in two minutes, trying names like root and admin. That is a brute force attack, a bot guessing passwords as fast as it can. Now turn your hunt into a rule.',
		siem: 'There, the SIEM caught a brand new attacker on its own, seconds after it started, while you were not even looking. You hunted once by hand, then wrote it down as a rule that keeps hunting forever. That is the whole point of a SIEM.'
	},
	searchLabel: 'Search the logs',
	tryLabel: 'Try',
	countLabel: '{n} lines',
	noMatch: 'No lines match that',
	tapHint: 'Tap any line to look at its address',
	ipLines: '{n} lines from this address',
	ipFailed: '{n} failed logins',
	ipUsers: 'Names it tried',
	markBtn: 'Mark as the attacker',
	markedTag: 'attacker',
	siemBtn: 'Hand it to the SIEM',
	ruleTitle: 'SIEM rule',
	ruleText: 'If one address fails to log in more than 10 times in a minute, raise an alert',
	liveLabel: 'live',
	alertTitle: 'Alert',
	alertText: 'Brute force from {ip}'
};
