import type { ProtocolsText } from './types';

export const en: ProtocolsText = {
	title: 'Network protocols',
	intro: [
		'Two computers can only work together if they agree on how to talk. Who speaks first, what a message looks like, how to say "I am done". That agreement is called a <b>protocol</b>, a bit like how every phone call starts with "hello".',
		"Each job has its own protocol. <b>HTTP</b> and <b>HTTPS</b> fetch web pages, <b>SMTP</b> sends email, <b>IMAP</b> reads it, <b>FTP</b> and <b>SFTP</b> move files, and <b>SSH</b> lets you type into another computer's terminal from far away.",
		'Each protocol waits behind its own numbered door on the server, the [[port|foundations/port]] you met before. HTTPS knocks on door 443, SSH on door 22. One address, many doors.',
		'They all live on the top floor, the application layer from [[Layers and packets|networking/layers]]. Underneath, every one of them rides on the same TCP and IP, like different letters going through the same post office.',
		'[fyi] Notice some come in pairs, an old one and a safer one, like HTTP and HTTPS, or FTP and SFTP. The S means the conversation is encrypted. The old ones send everything as plain text, passwords included, for anyone on the path to read.',
		'Your turn. There are five jobs to do on nimbus.com. Pick the right protocol for each one and watch which door it knocks on.'
	],
	reactions: {
		https:
			'HTTPS, door 443. Your browser and the server agree on a lock first, then talk about the page. The little padlock in the address bar is exactly this.',
		http: 'That would load the page, but plain HTTP (door 80) lets anyone on the same WiFi read it. Browsers even label it "Not secure". Pick the locked version.',
		smtp: 'SMTP, Simple Mail Transfer Protocol. Your mail app hands the letter to the mail server on door 587, then mail servers pass it to each other on door 25 until it reaches nim@nimbus.com.',
		imap: 'IMAP keeps your mail on the server and shows you a copy, which is why your phone and laptop see the same inbox. Door 993 is its encrypted version.',
		sftp: 'SFTP moves files through an SSH connection on door 22, everything encrypted. Your photo arrives and nobody on the way can peek.',
		ftp: 'FTP (door 21) dates back to 1971 and still works, but it sends your password as plain text. Pick its safer sibling.',
		ssh: "SSH, Secure Shell, on door 22. You are now typing into the server's terminal from your own laptop.",
		wrong:
			'That protocol speaks a different language for a different job, so the server would not understand it here. Read the hint and try another.',
		done: "All five done! SSH opened the server's terminal through door 22, the very door SFTP used. Different jobs, different languages, all on one address. That is network protocols in a nutshell."
	},
	laptopLabel: 'Your laptop',
	serverLabel: 'nimbus.com',
	doorsLabel: 'Ports on the server',
	taskLabel: 'Job {n} of {total}',
	pickLabel: 'Which protocol does this job?',
	protocols: [
		{ id: 'http', name: 'HTTP', port: 80 },
		{ id: 'https', name: 'HTTPS', port: 443 },
		{ id: 'smtp', name: 'SMTP', port: 587 },
		{ id: 'imap', name: 'IMAP', port: 993 },
		{ id: 'ftp', name: 'FTP', port: 21 },
		{ id: 'sftp', name: 'SFTP', port: 22 },
		{ id: 'ssh', name: 'SSH', port: 22 }
	],
	tasks: [
		{
			text: 'Open the nimbus.com homepage',
			answer: 'https',
			close: 'http',
			hint: 'Web pages travel by a protocol whose name starts with HT, take the locked one'
		},
		{
			text: 'Send an email to nim@nimbus.com',
			answer: 'smtp',
			hint: 'Sending mail has its own protocol, the Simple Mail Transfer one'
		},
		{
			text: 'Read the reply in your inbox',
			answer: 'imap',
			hint: 'Reading mail that stays on the server is a different job from sending it'
		},
		{
			text: 'Upload a photo to the server',
			answer: 'sftp',
			close: 'ftp',
			hint: 'File Transfer Protocol, the secure one'
		},
		{
			text: 'Log in to the server terminal',
			answer: 'ssh',
			hint: 'Secure Shell, a terminal on another computer'
		}
	],
	wrongNote: '{name} is not the right fit for this job',
	doneNote: 'Every job done, five protocols, one server',
	againBtn: 'Play again'
};
