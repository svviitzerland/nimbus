import type { CiscoSshText } from './types';

export const en: CiscoSshText = {
	title: 'SSH and enable secret',
	intro: [
		'Admins rarely walk to the router with a console cable. They log in from their own laptop over the network, that is [[remote access|cloud/remote-access]]. Someone set the nimbus router up for that long ago, look at its <b>vty lines</b>, the virtual doors for remote logins. Password cisco, transport telnet.',
		'Now Budi logs in with <b>Telnet</b>. But a stranger’s laptop sits on the same switch, quietly recording traffic. Look at what it caught.',
		'[ingat] Telnet sends session data without encryption. SSH encrypts the session and supports verifying the device’s identity.',
		'Protect privileged EXEC mode with <b>enable secret</b>. The configuration stores a password hash rather than the original password. Protection depends on the hash type and password used.',
		'SSH needs keys to seal its envelopes, and the keys need a full name. So we set <b>ip domain-name nimbus.com</b>, then <b>crypto key generate rsa</b>. IOS asks how big the key should be, and 2048 bits is a good answer today.',
		'Next a real account. <b>username budi secret</b> gives Budi his own name and password, so the router knows exactly who logged in.',
		'Finally the doors themselves. <b>line vty 0 4</b> picks the five remote login doors, <b>transport input ssh</b> lets only SSH through them, and <b>login local</b> checks the accounts we just made.',
		'Budi logs in again, now with <b>SSH</b>. The stranger still records everything, but all he gets is noise. <b>show ip ssh</b> confirms SSH is on.',
		'[fyi] This is the start of <b>hardening</b>, making a device harder to attack, see [[hardening|security/hardening]]. Pros also add the access list from [[the last lesson|netlab/cisco-acl]] to the vty lines, so only the admin laptop may even knock.',
		'Your turn. None of this survives a reboot until it is saved. Type <b>wr</b>.'
	],
	reactions: {
		task: 'Saved! Even after a power cut, nimbus comes back with SSH only, a scrambled enable secret, and Budi’s account. That is a router you can manage safely from anywhere in the office.',
		reloaded:
			'The router rebooted. If you saved first, SSH is still on. If not, it came back with the old Telnet setup, that is why we save.',
		needEnable: 'Run <b>enable</b> to enter privileged EXEC. The practice password is Nimbus2026.',
		needConfig: 'That changes the router, type <b>conf t</b> first.',
		needDo: 'In config mode, put <b>do</b> in front, like <b>do wr</b>, or type <b>end</b> first.',
		badSecret:
			'Wrong secret. That is the enable secret doing its job. The one we set is <b>Nimbus2026</b>.',
		error:
			'IOS did not understand that one. The ^ points at the word it tripped on, and <b>?</b> shows what fits.'
	},
	steps: [
		{
			title: 'Remote router access',
			body: '<code>show running-config | section line vty</code> shows only that part of the config. The <b>|</b> filters long output.'
		},
		{
			title: 'Telnet data can be read',
			body: 'Telnet sends every letter as plain text, password included. Anyone on the path can read it.'
		},
		{
			title: 'Telnet and SSH',
			tag: 'Remember it',
			body: 'Telnet sends an unencrypted session and normally uses port 23. SSH encrypts the session and normally uses port 22.'
		},
		{
			title: 'enable secret',
			body: 'Now <code>enable</code> asks for a password. In the config it shows up as a scrambled hash, never as the real word.'
		},
		{
			title: 'Device name and RSA keys',
			body: 'The key is named after the hostname plus the domain, nimbus.nimbus.com. Without a domain name, IOS refuses to make keys.'
		},
		{
			title: 'An account for each user',
			body: '<code>username budi secret Budi2026</code>. With personal accounts you know who changed what, unlike one shared password.'
		},
		{
			title: 'SSH login with local accounts',
			body: '<code>transport input ssh</code> shuts the Telnet door. <code>login local</code> asks for a username and password from the local list.'
		},
		{
			title: 'Encrypted SSH session',
			body: 'Same login, same cable, but the captured bytes are scrambled. Only Budi’s laptop and the router can read them.'
		},
		{
			title: 'Hardening',
			body: 'Strong secrets, SSH only, personal accounts, and an access list on the vty lines. Small steps that add up.'
		},
		{
			title: 'Enable SSH',
			tag: 'Try it',
			body: 'Type <code>wr</code> and press Enter. It copies the running config into the startup config.'
		}
	],
	spyLabel: 'Stranger',
	captureTitle: 'Captured data',
	captureEmpty: 'Nothing captured yet',
	captureOpen: 'password readable',
	captureSafe: 'scrambled',
	ispLabel: 'ISP',
	inputLabel: 'command',
	doneNote: 'Done',
	termHint: '! Nim types here first, your turn comes at the end',
	hintInvalid: '! IOS got lost at the ^ mark, check that word or type ? to see what fits there',
	hintIncomplete: '! almost, the command needs more words, add a space and ? to see them',
	hintAmbiguous: '! too short, more than one command starts like that, add a letter or two',
	hintUnknown: '! that is not a command here, type ? to see the list',
	didYouMean: '! maybe you meant {word}',
	hintNeedEnable: '! use enable to enter privileged EXEC',
	hintNeedConfig: '! that changes the router, type conf t first',
	hintDo: '! you are in config mode, put do in front, like do wr',
	hintSub: '! that one goes inside an interface, pool, or line, enter it first',
	hintMask: '! write the full subnet mask, for example 255.255.255.0',
	hintWild: '! careful, a wildcard is the mask flipped, 255.255.255.0 becomes 0.0.0.255'
};
