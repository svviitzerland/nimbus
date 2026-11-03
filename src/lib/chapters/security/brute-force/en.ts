import type { BruteForceText } from './types';

export const en: BruteForceText = {
	title: 'Brute force',
	intro: [
		'Imagine a robot standing at the nimbus.com login page, typing password after password and never getting tired. aaaa, aaab, aaac, and on and on. That is a <b>brute force</b> attack, winning by simply trying every possibility.',
		'Computers are fast. One bot, or a whole crowd of hijacked computers working together, can try thousands of passwords every second. A short password made of only digits has so few possibilities that it falls almost at once.',
		'There is a lazier version too. Every year huge lists of real passwords leak from hacked sites, and people keep reusing the same favourites (123456, password, qwerty). Attackers try those first, or take an email and password leaked from one site and try them everywhere else. That is called <b>credential stuffing</b>.',
		'Defenders have two big weapons. <b>Length</b>, because every extra character multiplies the possibilities. And a <b>lockout</b> (or rate limit), where the site allows only a few wrong tries before making you wait, so the robot slows to a crawl.',
		'[fyi] If an attacker steals the password file itself, there is no lockout to slow them down, and they guess offline at billions per second. That is why good sites store passwords with slow [[hashing|security/hashing]], and why [[MFA|security/mfa]] matters, a guessed password alone is not enough.',
		'This guessing machine only attacks a pretend login, so make up a password (never a real one). Start short, then go longer, then switch on the lockout and watch the clock.'
	],
	reactions: {
		leaked:
			'Instant. That password sits on the leaked lists every attacker starts with, so the machine did not even need to guess, it just looked it up. Never use a famous password.',
		leakedLock:
			'Even with the lockout, a password from the leaked list falls within the first few rounds. A lockout slows the guessing, but it cannot save a password everyone already knows.',
		fast: 'Done before your coffee cools. Short passwords, or ones made of only one kind of character, have too few combinations. Add length and the number explodes.',
		medium:
			'Better, the machine needs a while now. But a patient attacker with more computers could still get there. A few more characters would push it out of reach.',
		strong:
			'Out of reach. Each extra character multiplied the work, and now the machine would run for longer than anyone could wait. Length is the cheapest superpower a password has.',
		lockOn:
			'Lockout on. After five wrong tries, nimbus.com makes everyone wait 15 minutes. You will barely notice it, but the robot drops from thousands of guesses a second to a handful every quarter hour.'
	},
	passLabel: 'Your made up password',
	passPlaceholder: 'try 1234 first',
	passHint: 'Make one up, never type a real password here',
	lockLabel: 'Lock the login for 15 minutes after 5 wrong tries',
	runBtn: 'Start the guessing machine',
	emptyPass: 'Type a password first',
	machineLabel: 'Guessing machine',
	targetLabel: 'nimbus.com login',
	lockedTag: 'locked, wait 15 min',
	kinds: { lower: 'a to z', upper: 'A to Z', digits: '0 to 9', symbols: 'symbols' },
	lengthStat: '{n} characters',
	combosStat: 'possible passwords to try',
	speedFast: '10,000 guesses a second',
	speedLock: '5 guesses every 15 minutes',
	resultLabel: 'Time to try them all',
	leakedTitle: 'Found on a leaked list',
	leakedSub: 'entry number {n}, checked first',
	verdicts: { leaked: 'leaked', fast: 'weak', medium: 'okay', strong: 'strong' },
	units: {
		instant: 'less than a second',
		seconds: '{n} seconds',
		minutes: '{n} minutes',
		hours: '{n} hours',
		days: '{n} days',
		years: '{n} years',
		million: '{n} million years',
		billion: '{n} billion years',
		forever: 'longer than the age of the universe'
	},
	historyLabel: 'Your tries',
	lockShort: 'lockout',
	goals: ['Find a password the machine cannot finish', 'Run the machine once with the lockout on']
};
