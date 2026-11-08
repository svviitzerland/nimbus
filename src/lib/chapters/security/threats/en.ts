import type { ThreatsText } from './types';

export const en: ThreatsText = {
	title: 'Threat modeling',
	intro: [
		'The nimbus.com shop stores accounts, orders, and backups. Data moves between customer phones, servers, databases, and partner services. Each connection grants access worth reviewing.',
		'<b>Threat modeling</b> maps what needs protection, how a system works, and what could go wrong. It helps select improvements before or during development.',
		'Start with four questions. What are we building? What can go wrong? What will we do about it? Are the improvements sufficient? Use diagrams and evidence from the system.',
		'<b>STRIDE</b> groups threats. <b>Spoofing</b> uses a false identity, <b>tampering</b> changes data without permission, and <b>repudiation</b> denies actions when evidence is inadequate.',
		'The remaining categories are <b>information disclosure</b>, exposing information, <b>denial of service</b>, making a service unavailable, and <b>elevation of privilege</b>, obtaining permissions beyond those granted.',
		'[ingat] <b>Assets, data flows, threats, controls.</b> Record what needs protection, where data moves, what could go wrong, and the appropriate protections.',
		'Mark parts of the map that need review. Read each threat and protection, including partner accounts and backups outside the shop page.'
	],
	reactions: {
		first:
			'That part is on the review list. Continue through the connections between devices, accounts, and other services.',
		vendor:
			'Partner accounts can reach the parts of the system they are granted. Limit permissions and review their activity as you would internal accounts.',
		backup:
			'A backup contains copied data. Unauthorized access to it can expose that information too.',
		compareAll:
			'Every part of this example has been reviewed. Next, assign controls, owners, and a way to test the improvements.',
		compareSome:
			'The yellow parts are not yet marked. Select them to inspect threats missing from your list.'
	},
	spots: {
		phone: {
			name: 'Customer phone',
			threat: 'A fake login page tricks the customer into typing their password (phishing).',
			fix: 'Add a second login step, so a stolen password alone is not enough.'
		},
		wifi: {
			name: 'Cafe WiFi',
			threat: 'Someone on the same WiFi listens to the traffic going past.',
			fix: 'Use HTTPS everywhere, so whatever travels is encrypted.'
		},
		login: {
			name: 'Login page',
			threat: 'A bot guesses thousands of passwords every minute.',
			fix: 'Limit the attempts and slow down repeated failures.'
		},
		server: {
			name: 'Web server',
			threat: 'An installed software version has an unpatched vulnerability.',
			fix: 'Update often and close every port nobody uses.'
		},
		db: {
			name: 'Database',
			threat: 'Customer data copied out in one go.',
			fix: 'Keep only password hashes and encrypt sensitive data.'
		},
		admin: {
			name: 'Admin laptop',
			threat: 'It holds the keys to everything, and sometimes sits unlocked on a desk.',
			fix: 'Give each person only the access they need, and lock the screen.'
		},
		vendor: {
			name: 'Partner account',
			threat: 'A partner account is misused to access connected systems.',
			fix: 'Give partners a separate, tiny account and watch what it does.'
		},
		backup: {
			name: 'Backup drive',
			threat: 'A full copy of the data, often guarded less carefully than the original.',
			fix: 'Encrypt backups and store them somewhere locked.'
		}
	},
	tapHint: 'Tap a spot on the map to mark it',
	compareBtn: "Compare with Nim's list",
	compareNeed: 'Mark {n} more to compare',
	score: 'You found {n} of {total}',
	missedLabel: 'Nim also found',
	threatLabel: 'What could go wrong',
	fixLabel: 'The fix',
	foundTag: 'yours',
	missedTag: 'missed',
	resetBtn: 'Start the map over'
};
