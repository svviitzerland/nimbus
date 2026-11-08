import type { LogsText } from './types';

export const en: LogsText = {
	title: 'Centralized logging',
	intro: [
		'Every program keeps a diary while it works. Each visit, each error, each slow moment becomes one line with a time on it. Those lines are called <b>logs</b>.',
		'With one server, reading the log is easy. Log in, open the file, scroll. But nimbus.com now runs on twenty servers behind a [[load balancer|traffic/load-balancer]], and any one of them could be the one that broke.',
		'So teams send every log line to one place the moment it is written. That is <b>centralized logging</b>, one search box over every server, and the lines stay there even after a server is gone.',
		'[fyi] Logs work hand in hand with [[monitoring|compute/monitoring]]. Metrics tell you something is wrong, logs tell you exactly what happened. Security teams search the very same logs to catch attackers, in a tool called a [[SIEM|security/detection]].',
		'[ingat] Centralized logging collects logs from multiple services. Use timestamps, service identities, and request IDs to trace events.',
		'A buyer just complained. Find the broken checkout. Try logging in to the servers one by one first, then try the central log.'
	],
	reactions: {
		peek: 'Three servers, six minutes, and nothing yet. Seventeen to go, and the buyer is still waiting. There has to be a faster way.',
		handFound:
			'Found it on web-14, but only after logging in again and again. On a bad day there could be a hundred servers, and some may already be gone with their logs. Now try the central log.',
		search:
			'One search, every server at once. The noise falls away and only the matching lines stay. Now spot the line that looks wrong.',
		found:
			'There it is. web-14 gave up waiting for the payment service at the exact minute the buyer complained. One search instead of twenty logins, that is why every team collects its logs in one place. Real tools for it include Elasticsearch with Kibana, Grafana Loki, and the log tools built into every cloud.'
	},
	ticketLabel: 'Support ticket',
	ticket: 'A buyer says checkout failed at about 14.01, the page just showed an error',
	modes: ['One by one', 'Central log'],
	fleetLabel: 'Twenty web servers',
	loginsTag: '{n} logins, {m} min',
	pickServer: 'Tap a server to log in and read its log',
	searchLabel: 'Search every server',
	searchPlaceholder: 'type a word, like error',
	quickLabel: 'Try',
	resultsTag: '{n} of {t} lines',
	noResults: 'No line matches that',
	tapHint: 'tap the line that looks wrong',
	foundTag: 'web-14 is the culprit',
	noteHand: 'Each login costs a couple of minutes',
	noteHandFound: 'Found, but it took a lot of logging in',
	noteCentral: 'Every line from all twenty servers, in one place',
	noteFound: 'Found in seconds, not minutes'
};
