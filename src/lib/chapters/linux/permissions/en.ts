import type { PermissionsText } from './types';

export const en: PermissionsText = {
	title: 'Permissions and sudo',
	intro: [
		'A Linux server is a shared house. The admin, you, and the programs that run nimbus.com all live on it, and not everyone should be able to touch everything. So every file carries a few small rules called <b>permissions</b>.',
		'There are three kinds of permission. <b>r</b> (read) lets you open a file and look, <b>w</b> (write) lets you change it, and <b>x</b> (execute) lets you run it like a program.',
		"And there are three kinds of people. The file's <b>owner</b>, its <b>group</b> (a team of users who share it), and <b>others</b>, meaning everyone else. Three people times three permissions makes nine switches, shown by <b>ls -l</b> as nine letters.",
		'Above everyone sits <b>root</b>, the admin who may do anything at all. You are not root, but you may borrow its power for a single command by putting <b>sudo</b> in front (short for super user do). Very powerful, so use it with care.',
		'[fyi] On a real server sudo asks for your password first and writes every use into a log, so the team always knows who did what. Windows has the same idea in its Run as administrator prompt.',
		'Your turn. Start by running your backup script with <b>./backup.sh</b> and see what happens. Then fix it, read the admin only settings with sudo, and finally try the risky shortcut everyone is tempted by. Tapping a switch in the card types its chmod for you.'
	],
	reactions: {
		listed:
			'Read the letters left to right. The first three are the owner (you, nim), the next three the group, the last three everyone else. See it? backup.sh has <b>r</b> and <b>w</b> for you, but no <b>x</b>, so nobody may run it yet.',
		runDenied:
			'Permission denied! The script is yours, yet Linux will not run it, because nobody switched on its <b>x</b>. Have a look with <b>ls -l</b>, then add it with <b>chmod u+x backup.sh</b> (u for user, plus x).',
		chmodX:
			'There is an <b>x</b> now, and in the card the run switch is on. Try <b>./backup.sh</b> again.',
		ran: 'It runs! <b>chmod</b> (change mode) flipped one switch and the file became a program. The ./ in front simply means "the one in this folder".',
		bashTrick:
			'Sneaky, that works too. <b>bash backup.sh</b> only needs to read the file and runs the lines itself. The mission wants the file itself runnable though, so give it an x and use ./backup.sh.',
		confDenied:
			'Denied. app.conf belongs to root and holds the database password, so others may not even peek. You have admin rights on this server though, so try it with <b>sudo</b> in front.',
		sudo: "With sudo the file opened. For that one command you were root. Notice you did not change the file's rules at all, you borrowed a bigger key just once, which is much safer than opening the file up for everyone.",
		notOwner:
			"Not allowed. Only a file's owner (or root) may change its permissions, and that one belongs to root. Put <b>sudo</b> in front if you really mean it.",
		risky:
			'Careful! <b>777</b> switches on all nine, so every user and every program on this server may now rewrite that file. If someone sneaks bad code into backup.sh, you will run it yourself tonight. Take it back with <b>chmod 755</b>.',
		othersWrite:
			'Hmm, others may now change that file. That is almost never what you want on a server. Switch it back off.',
		chmod:
			'Switches flipped. Each letter is a number too, r is 4, w is 2, and x is 1, so <b>755</b> means the owner gets 7 (4+2+1) and everyone else gets 5 (read and run).',
		undo: 'Safe again. 755 lets you do everything while others may only read and run. Remember this one, it is what most scripts and programs on a server use.',
		rmrf: 'Whoa, that would erase the whole server! Linux has a safety catch for exactly this one. A good reminder that sudo does what you type, not what you meant.',
		missing:
			'Nothing with that name here. Run <b>ls -l</b> to see the files, backup.sh lives in your home folder.',
		denied:
			'Locked. Check its letters with <b>ls -l</b>, and if it belongs to root, sudo is the key.',
		error:
			'The server does not know that command. Check the spelling, or type <b>help</b> to see what it knows.',
		done: 'All done! You read permission letters, gave a script its run switch, borrowed admin power with sudo for one command, and saw why 777 is a trap. That is how you keep a shared server safe. Next up, you will use that sudo to install real software.'
	},
	missionsLabel: 'Missions',
	missions: [
		'Read the permission letters',
		'Make backup.sh runnable and run it',
		'Read app.conf with sudo',
		'Try the risky 777, then take it back'
	],
	hintBtn: 'Help',
	doneNote: 'All missions done, the server is safe',
	inputLabel: 'command',
	termHint: '# start with ./backup.sh and press Enter',
	hintUnknown: '# that command does not exist here, type help to see the list',
	didYouMean: '# maybe you meant {word}',
	hintMissing: '# nothing with that name here, ls shows what is around',
	hintDenied: '# permission denied, ls -l shows who may do what',
	cardLabel: 'Permission switches',
	permLabels: ['read', 'write', 'run'],
	ownerLabel: 'owner',
	groupLabel: 'group',
	othersLabel: 'others',
	cardNote: 'Tap a switch to type its chmod',
	dangerNote: 'Anyone on this server may rewrite this file'
};
