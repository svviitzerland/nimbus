import type { PackagesText } from './types';

export const en: PackagesText = {
	title: 'Package managers',
	intro: [
		'Your server is fresh and empty. To serve nimbus.com it needs a <b>web server</b>, the program that hands pages out to visitors. In the old days you hunted for a download, unpacked it by hand, and hoped every little piece it needed was there too.',
		'Linux has a much nicer way, a <b>package manager</b>. Think of an app store you drive by typing. A <b>package</b> is one program neatly boxed up, and the store it comes from is a <b>repository</b>, run by Ubuntu and checked for safety.',
		"On Ubuntu the package manager is called <b>apt</b>. <b>apt update</b> refreshes the store's list of what is on the shelves, <b>apt install</b> downloads a program plus everything it needs, and <b>apt remove</b> takes it away again. Installing changes the whole system, so it needs <b>sudo</b>, just like in [[Permissions and sudo|linux/permissions]].",
		'[fyi] Other systems have their own store clerk. Fedora and Red Hat use dnf, a Mac uses Homebrew, Windows has winget, and your phone has the Play Store or App Store. Programmers even have package managers for code, like npm for JavaScript and pip for Python.',
		'Your turn. Install <b>nginx</b> (say it like engine x), one of the most used web servers in the world, then open nimbus.com and see it say hello. Tap Help whenever you get stuck.'
	],
	reactions: {
		updated:
			'The shelf list is fresh. apt now knows the newest version of every package in the repository. It downloaded only the list, nothing is installed yet.',
		installed:
			'Installed with one line! apt fetched nginx plus nginx-common (a piece it needs), unpacked them, and even started the web server for you. Doing that by hand would take ages.',
		version:
			'nginx answers with its version, proof the program is really on the server now. Checking the version is the quickest way to know an install worked.',
		opened:
			'There is the nginx welcome page, served by your own server! Later you swap it for the real nimbus.com files, but the web server part is done.',
		needSudo:
			'Look at the end, <b>are you root?</b> Installing touches the whole system, so apt wants admin power. Put <b>sudo</b> in front and try again.',
		notInstalled:
			'Ubuntu is being helpful here. It does not have that program yet, but it tells you exactly which apt line would install it.',
		noPackage:
			'apt could not find a package with that name. Package names must be exact, check the spelling (it is nginx, with the g before the i).',
		already:
			'Nothing to do, that package is already installed and up to date. apt never downloads the same thing twice.',
		other:
			'Installed! Same one line works for any program in the store. The mission still wants nginx though.',
		abort:
			'You said no, so apt stopped and changed nothing. That question is your last chance to check what is about to be installed. Add <b>-y</b> at the end to answer yes ahead of time.',
		removed:
			'nginx is gone, and nimbus.com goes quiet with it. One line installs, one line removes. Install it again to bring the site back.',
		removedOther: 'Removed cleanly, as if it was never there.',
		upgrade:
			'<b>apt upgrade</b> brings every installed package up to the newest version. Everything is fresh already, but on a real server you run update then upgrade often, to get security fixes.',
		offline:
			'Nothing answers yet. No web server is running on this machine, so the visit has nowhere to land. Install nginx first.',
		missing: 'Nothing with that name here. Run <b>ls</b> to see what is around.',
		denied: 'Locked. That one needs admin power, so try <b>sudo</b> in front.',
		error:
			'The server does not know that command. Check the spelling, or type <b>help</b> to see what it knows.',
		done: 'All missions done! You refreshed the store, installed a real web server with one command, checked it, and opened its welcome page. Every cloud server starts life like this, a few apt lines and it is ready for work.'
	},
	missionsLabel: 'Missions',
	missions: [
		'Refresh the package list',
		'Install nginx',
		'Check that nginx is there',
		'Open nimbus.com'
	],
	hintBtn: 'Help',
	doneNote: 'All missions done, the web server is live',
	inputLabel: 'command',
	termHint: '# try sudo apt update, then press Enter',
	hintUnknown: '# that command does not exist here, type help to see the list',
	didYouMean: '# maybe you meant {word}',
	hintMissing: '# nothing with that name here, ls shows what is around',
	hintDenied: '# locked, try sudo in front',
	storeLabel: 'Ubuntu package store',
	serverLabel: 'Your server',
	openBtn: 'Open',
	reloadBtn: 'Reload',
	browserIdle: 'Tap Open to visit nimbus.com',
	offlineTitle: "This site can't be reached",
	offlineSub: 'nimbus.com refused to connect',
	hintSudo: '# installing needs admin power, put sudo in front',
	hintApt: '# try sudo apt install nginx',
	hintVersion: '# {name} is installed, try {name} -v',
	hintCurl: '# try curl localhost'
};
