import type { RemoteAccessText } from '../../types';

export const en: RemoteAccessText = {
	title: 'Getting into your cloud server',
	intro: [
		'Your virtual server is up and running, but it lives in a data center far away, maybe in another city or country. Very different from an <b>on premise</b> server in your own office, which you can walk up to, plug a screen and keyboard into, or reach over the local network.',
		'Since you cannot touch the machine, you get in from afar, called <b>remote access</b>. From your computer at home you connect over the internet using the server address, either an <b>IP</b> or a <b>hostname</b> (its name) like nimbus.com.',
		'There are two common doors. <b>SSH</b> for a Linux server, a terminal where you type commands. <b>RDP</b> for a Windows server, a desktop screen you can click around.',
		'Typing a password every time works, but a password can be guessed or stolen. The safer way is an <b>SSH key</b>, a matching pair of two files made on your laptop. The <b>public key</b> goes on the server, and the <b>private key</b> never leaves your laptop. When you connect, the server checks that your laptop holds the partner key, so no password ever travels over the internet.',
		'[ingat] Think of a padlock and its only key. The public key is the padlock, you can fix a copy on every server you own and anyone may look at it. The private key is the one key that opens them all, so it stays in your pocket and you never lend it out.',
		'Your server is ready in the data center. Get in through SSH, then through RDP, and see the difference.'
	],
	reactions: {
		ssh: 'Through <b>SSH</b> you get the server terminal. Type a command, the server runs it, and all the traffic is encrypted so it stays safe even over the open internet.',
		rdp: 'Through <b>RDP</b> the server desktop shows up on your laptop. You move the mouse and click like an ordinary computer, while the machine sits far away in the data center.',
		both: 'There, both are ways into the machine you rented. SSH for those who like a terminal and automation, RDP for when you need a desktop view. The machine is far, yet it feels right in front of you.'
	},
	serverLabel: 'Your server',
	dcLabel: 'in the data center',
	homeLabel: 'Your computer at home',
	lockedNote: 'Not connected yet',
	idleNote: 'Your server is ready in the data center. Get in through SSH, then RDP.',
	pickSsh: 'SSH (Linux)',
	pickRdp: 'RDP (Windows)',
	sshHost: 'nimbus.com',
	sshPrompt: 'nim@nimbus:~$',
	sshCmd: 'ssh nim@nimbus.com',
	sshConnecting: 'connecting securely...',
	sshOk: 'logged in with your SSH key, encrypted',
	sshSession: [
		{ cmd: 'whoami', out: ['nim'] },
		{
			cmd: 'sudo apt install nginx',
			out: ['Reading package lists...', 'nginx installed successfully']
		},
		{ cmd: 'sudo systemctl restart nginx', out: ['nginx is back up'] }
	],
	rdpTitle: 'Server files',
	rdpHost: 'nimbus.com',
	connecting: 'Connecting...',
	rdpHint: 'The server Windows desktop is on your screen',
	keysTitle: 'An SSH key pair',
	privateKey: 'Private key',
	privateFile: 'id_ed25519',
	privateNote: 'stays on your laptop',
	publicKey: 'Public key',
	publicFile: 'id_ed25519.pub',
	publicNote: 'goes on the server'
};
