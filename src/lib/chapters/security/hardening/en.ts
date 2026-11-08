import type { HardeningText } from './types';

export const en: HardeningText = {
	title: 'Server hardening',
	intro: [
		'Before the nimbus.com server accepts visitors, review its software, accounts, and active services. Initial settings may not fit the application.',
		'An internet facing service can receive automated scans and login attempts. Each extra service needs updates and monitoring.',
		'<b>Server hardening</b> reduces opportunities for misuse. It includes updating software, disabling unnecessary services, limiting network access, and giving accounts only the permissions they need.',
		'Age alone does not prove software is vulnerable. Compare the installed version with [[security advisories|security/cve-cwe]], apply the relevant fixes, and test the application.',
		'[fyi] For a cloud VM, the provider manages physical hardware while you usually manage the operating system and applications. This division changes with the service, following [[shared responsibility|networking/shared-responsibility]].',
		'[ingat] <b>Update, restrict, review.</b> Update software, restrict services and permissions, and review the configuration regularly.',
		'Run the simulated scanner to find six configurations to improve. Keep HTTPS available so visitors can still reach nimbus.com.'
	],
	reactions: {
		scan: 'Six configurations need attention. Select findings to see the changes applied. The number on screen measures exercise progress.',
		update:
			'Security updates are installed and automatic updates enabled. These fix the vulnerabilities covered by those packages. Test the application after updating.',
		telnet:
			'Telnet is disabled. It sends login details as plain text. Use SSH for remote administration over an encrypted connection.',
		db: 'Database access is limited to the web server. Network rules reject direct requests from the internet. Database accounts and permissions still need configuration.',
		sshkey:
			'SSH now requires a key. This reduces password guessing attempts. Protect the private key with a passphrase and revoke access if it leaks.',
		root: 'The application runs as a dedicated account with limited permissions. This is <b>least privilege</b>, granting what the task needs to limit the impact of a compromise.',
		default:
			'The default password is replaced by a long, unique one. Default credentials are often available in documentation or common configuration lists.',
		web: 'nimbus.com is unavailable because its HTTPS port is closed. Reopen port 443 so visitors can use the required service.',
		done: 'All six exercise changes are complete and HTTPS is available. These settings reduce some risks. Reviews, updates, and monitoring remain necessary.'
	},
	serverLabel: 'nimbus.com server',
	scanBtn: 'Run the scanner',
	scoreLabel: 'Hardening progress',
	doors: {
		update: {
			name: 'Packages need updates',
			risk: 'A vulnerable version is installed',
			fix: 'Update',
			done: 'Up to date, auto updates on'
		},
		telnet: {
			name: 'Port 23, Telnet',
			risk: 'Old login that sends passwords as plain text',
			fix: 'Close',
			done: 'Telnet service disabled'
		},
		db: {
			name: 'Port 3306, database',
			risk: 'Reachable from the whole internet',
			fix: 'Close',
			done: 'Only the web server can reach it'
		},
		sshkey: {
			name: 'SSH login with a password',
			risk: 'Login accepts password guesses',
			fix: 'Use keys',
			done: 'Key login only'
		},
		root: {
			name: 'App runs as root',
			risk: 'The application has administrator privileges',
			fix: 'Limit permissions',
			done: 'Dedicated account with limited permissions'
		},
		default: {
			name: 'Admin panel, admin and admin',
			risk: 'The factory password, the first one bots try',
			fix: 'Change',
			done: 'Long unique password'
		}
	},
	web: {
		name: 'Port 443, HTTPS',
		note: 'Your visitors come in here',
		close: 'Close',
		reopen: 'Reopen',
		closedNote: 'Closed, nobody can open nimbus.com'
	},
	openTag: 'open',
	closedTag: 'closed',
	neededTag: 'needed',
	siteUp: 'online',
	siteDown: 'offline',
	hintIdle: 'Review the server configuration',
	hintScan: 'Select a finding to improve the configuration',
	hintDone: 'Six exercise changes complete'
};
