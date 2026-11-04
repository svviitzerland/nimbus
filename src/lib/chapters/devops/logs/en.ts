import type { LogsText } from './types';

export const en: LogsText = {
	title: 'Centralized logging',
	intro: [
		'Every program keeps a diary while it works. Each visit, each error, each slow moment becomes one line with the time written in front. Those lines are called <b>logs</b>. Watch web-01 write its diary.',
		'With one server, reading the log is easy. But nimbus.com now runs on twenty servers behind a [[load balancer|traffic/load-balancer]], and any one of them could be the one that broke. Logging in to each one to read its diary takes forever.',
		'So teams send every line to one place the moment it is written. That is <b>centralized logging</b>. Watch the lines from all twenty servers flow down into a single log, side by side, in time order.',
		'There is a bonus. Servers in the cloud come and go all day. Here web-07 just got switched off, yet its lines are still safe in the central log, ready to read.',
		'A buyer says checkout failed at about 14.01. Instead of twenty logins, the central log gets one search. Watch Nim type <b>error</b> into the search box, and all the noise falls away.',
		'There it is. <b>web-14</b> gave up waiting for the payment service at 14.01, the exact minute the buyer complained. Found in seconds, not in an hour of logging in.',
		'[ingat] <b>Many servers, one search box.</b> A log is a server diary, and centralized logging puts every diary on one shelf, so you only ever look in one place.',
		'[fyi] Logs work hand in hand with [[monitoring|compute/monitoring]]. Metrics say something is wrong, logs say exactly what happened. Security teams search the very same logs to catch attackers, in a tool called a [[SIEM|security/detection]]. Real tools include Elasticsearch with Kibana and Grafana Loki.',
		'Want to search yourself? Tap a word and watch the twenty servers narrow down to the lines that match. Or just watch the logs roll in, that works too.'
	],
	reactions: {
		error:
			'Only the error lines are left, and two of them come from web-14 at 14.01. That is the checkout the buyer was talking about.',
		checkout:
			'Every checkout from every server, in time order. Most say 200, which means fine, until web-14 starts timing out. Searching for a page is a great way to follow one feature.',
		slow: 'The slow warnings show trouble building up before it broke. web-14 was already waiting seconds for the payment service just before the errors began.'
	},
	steps: [
		{
			tag: 'The diary',
			title: 'A log',
			body: 'One line per event, always with the <b>time</b> first, then which server, how serious, and what happened.'
		},
		{
			tag: 'The problem',
			title: 'Twenty diaries',
			body: 'Twenty servers means twenty separate logs. Reading them one login at a time is slow, and you never know which one to open.'
		},
		{
			tag: 'The fix',
			title: 'Centralized logging',
			body: 'Each server ships its lines to one central log as they happen, all merged and sorted by time.'
		},
		{
			tag: 'Kept safe',
			title: 'Lines outlive servers',
			body: 'A server can vanish, its lines stay behind in the central log.'
		},
		{
			tag: 'One search',
			title: 'Search every server',
			body: 'Type one word and only the matching lines remain, from all twenty servers at once.'
		},
		{
			tag: 'Found',
			title: 'The culprit',
			body: '<b>web-14</b>, 14.01, a timeout waiting for payment. Server, time, and reason in one line.'
		},
		{
			tag: 'Make it stick',
			title: 'Many servers, one search box',
			body: 'Logs are diaries. Put every diary on one shelf and you only look in one place.'
		},
		{
			tag: 'Teammates',
			title: 'Logs and metrics',
			body: 'Metrics ring the alarm, logs explain it. Security teams read the same lines to spot attackers.'
		},
		{
			tag: 'Optional',
			title: 'Search yourself',
			body: 'Tap a word. The central log keeps only the lines that contain it.'
		}
	],
	fleetLabel: 'Twenty web servers',
	centralLabel: 'Central log',
	serverLog: 'Log of {s}',
	allLog: 'All twenty servers',
	loginTag: '{n} logins so far',
	goneTag: 'off',
	searchPlaceholder: 'search',
	noResults: 'No line matches yet',
	foundTag: 'web-14',
	pickLabel: 'Search for'
};
