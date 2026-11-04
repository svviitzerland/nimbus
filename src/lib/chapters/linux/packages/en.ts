import type { PackagesText } from './types';

export const en: PackagesText = {
	title: 'Package managers',
	intro: [
		'Your nimbus.com server is fresh and almost empty. To show a website it needs a <b>web server</b> program, and the favourite is called <b>nginx</b> (say "engine x"). So how do you get a program onto a computer that has no browser and no mouse?',
		'You order it from a shop. Programs for Linux come as <b>packages</b>, a neat box with the program inside plus everything it needs. A <b>package manager</b> is the app store you talk to from the terminal. On Ubuntu it is called <b>apt</b>.',
		'Step one, <b>apt update</b>. It does not install anything, it only fetches the newest list of what the shop has on its shelves. Watch the little list fly over.',
		'Step two, <b>apt install nginx</b>. apt finds the box, downloads it, unpacks it and sets it up, and it brings along the extra pieces nginx depends on (called <b>dependencies</b>). Watch it land in the rack.',
		'Notice both commands began with <b>sudo</b>. Installing changes the whole server, so only the admin may do it. Nim leaves sudo out on purpose, and apt refuses (that red lock), just like in [[Permissions and sudo|linux/permissions]].',
		'Did it work? Most programs answer <b>-v</b> or <b>--version</b> with their version number. Nim types <b>nginx -v</b>, and the server replies. Installed and ready.',
		'[ingat] Update first, then install. It is like checking the newest menu before you order. And installing changes the whole house, so it always wants sudo.',
		"[fyi] Every system has its own shop. Fedora uses dnf, a Mac uses brew, and programmers grab code libraries with npm or pip. Your phone's app store is the same idea with buttons.",
		'Your turn. Install a little tool called <b>htop</b>, a live view of what the server is busy with. Type <b>sudo apt install htop</b> and watch the box arrive.'
	],
	reactions: {
		installed:
			'Delivered! htop is on the server now. Type <b>htop</b> to peek at what is running. On a real server it fills the screen and you leave with q.',
		other:
			'Delivered. One command, and the program plus its dependencies are on the server. That is the whole magic of a package manager.',
		already: 'apt checked and that one is already installed, newest version too. Nothing to do.',
		updated: 'The shop list is fresh again. Now apt knows the newest versions on every shelf.',
		removed: 'Gone, the box left the rack. apt remove takes a program away as cleanly as it came.',
		ran: 'It answers, so it is installed and working.',
		notInstalled:
			'The server does not have that program yet, and it even tells you how to get it. Ask apt with sudo.',
		needSudo:
			'apt refused, are you root? Installing needs the admin. Put <b>sudo</b> in front, like <b>sudo apt install htop</b>.',
		noPackage:
			'The shop has no box with that name. Check the spelling, the one you want is <b>htop</b>.',
		missing: 'Nothing with that name here. Try <b>sudo apt install htop</b>.',
		denied: 'Locked, that needs the admin. Put <b>sudo</b> in front.',
		error:
			'The server did not understand that. Try <b>sudo apt install htop</b>, exactly like that.'
	},
	panels: [
		{
			tag: 'The problem',
			title: 'An empty server',
			body: 'A fresh server can do very little. Everything else, a web server, a database, small tools, gets installed on top.'
		},
		{
			tag: 'Package',
			title: 'A program in a box',
			body: 'A <b>package</b> holds the program and its setup. The shop, called a <b>repository</b>, is run by Ubuntu and checked for safety.'
		},
		{
			tag: 'apt update',
			title: 'Fresh list',
			body: 'apt downloads the newest list of packages and versions. Nothing is installed yet, the server just knows what is available.'
		},
		{
			tag: 'apt install',
			title: 'The box arrives',
			body: 'apt downloads the package, unpacks it, and sets it up. Its <b>dependencies</b> come along by themselves.'
		},
		{
			tag: 'sudo',
			title: 'Admin only',
			body: 'Installing touches files every user shares, so apt needs root. Without sudo it stops before it changes anything.'
		},
		{
			tag: 'Check',
			title: 'Ask for the version',
			body: '<b>nginx -v</b> prints the version. If the command is missing, Ubuntu even suggests the install line for you.'
		},
		{
			tag: 'Remember',
			title: 'Menu first, then order',
			body: '<b>sudo apt update</b>, then <b>sudo apt install</b> and a name. <b>sudo apt remove</b> takes it away again.'
		},
		{
			tag: 'Good to know',
			title: 'Many shops, one idea',
			body: 'dnf, brew, npm and pip all work the same way. Ask for a name, the manager fetches the box and what it needs.'
		},
		{
			tag: 'Your turn',
			title: 'Install htop',
			body: 'Type <b>sudo apt install htop</b> and press Enter. A new box lands in the rack.'
		}
	],
	watchLabel: 'Nim is typing, just watch',
	tryLabel: 'Your turn, type',
	tryTip: 'Tap to let Nim type it',
	inputLabel: 'command',
	termHint: '# Nim types here first, just watch',
	hintUnknown: '# that command does not exist here',
	didYouMean: '# did you mean {word}',
	hintMissing: '# nothing with that name here',
	hintDenied: '# locked, only the admin may do that',
	storeLabel: 'Ubuntu package shop',
	serverLabel: 'nimbus.com server',
	netLabel: 'internet',
	rule: 'Update first, then install, with sudo.',
	hintSudo: '# installing needs the admin, put sudo in front',
	hintApt: '# try sudo apt install htop'
};
