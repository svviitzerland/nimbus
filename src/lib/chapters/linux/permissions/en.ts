import type { PermissionsText } from './types';

export const en: PermissionsText = {
	title: 'Permissions and sudo',
	intro: [
		'A Linux server is a shared house. The admin, you, and the programs behind nimbus.com all live on it, and not everyone should touch everything. So every file carries a few tiny rules called <b>permissions</b>. Look at the card, that is your file backup.sh.',
		'Nim types <b>ls -l</b> (list, long) to see those rules. The odd row of letters at the start is the file telling you who may do what. Watch the letters land on the switches.',
		'Read the switches like a little table. The columns are <b>r</b> read (open and look), <b>w</b> write (change it), and <b>x</b> run (start it like a program). The rows are the <b>owner</b> (you), the <b>group</b> (a team that shares it), and <b>others</b>, everyone else.',
		'Now Nim tries to run the script with <b>./backup.sh</b> (the ./ means the one right here). Permission denied! The run switch is off for everybody, so Linux refuses.',
		'The fix is <b>chmod</b> (change mode). <b>chmod u+x</b> means for the user, add run. One switch flips on, and this time ./backup.sh runs.',
		'Admins usually write permissions as three digits, one per row. Read is worth 4, write 2, run 1, and you add them up. So <b>chmod 755</b> gives the owner everything (4+2+1), and the others read and run (4+1).',
		'[ingat] rwx is read, write, run, worth 4, 2 and 1. Add them up, and <b>7 means all three</b>, 5 means read and run, 0 means nothing at all.',
		"Some files belong to <b>root</b>, the admin who may do anything. nimbus.conf holds a password, so even reading it is denied. Put <b>sudo</b> in front and you borrow root's power for that one command.",
		'[ingat] <b>sudo</b> means "please, as the boss". It is powerful, so use it only when a command really needs it. On a real server it asks for your password and writes every use into a log.',
		'Your turn. backup.sh is yours alone, so lock it down. Type <b>chmod 700 backup.sh</b>. Seven for you (all three), zero for the group, zero for everyone else.'
	],
	reactions: {
		locked:
			'Locked down. Only the top row is on now, so you may read, change and run it, and nobody else may even peek. That is what 7, 0, 0 means.',
		chmod:
			'The switches flipped. Each digit is one row, 4 for read, 2 for write, 1 for run. For your turn, try <b>chmod 700 backup.sh</b>.',
		risky:
			'Careful! Now others may write the file, so anyone on this server could slip bad code into it, and you would run it tonight. Lock it with <b>chmod 700 backup.sh</b>.',
		ran: 'It runs, because your run switch is on. ./ simply means the file right here in this folder.',
		sudo: 'With sudo the file opened. For that one command you acted as root. You did not change the rules of the file, you borrowed a bigger key once.',
		missing:
			'No file by that name here. backup.sh lives in your home folder, so type <b>chmod 700 backup.sh</b>.',
		denied:
			'Denied. Only the owner (or root, with sudo) may open or change that one. backup.sh is yours though.',
		error: 'The server did not understand that. Try <b>chmod 700 backup.sh</b>, exactly like that.'
	},
	panels: [
		{
			tag: 'Permissions',
			title: 'Rules on every file',
			body: 'Each file has an <b>owner</b> and nine little switches that say who may read it, change it, or run it.'
		},
		{
			tag: 'ls -l',
			title: 'Nine letters',
			body: 'The letters come in three groups of three. A letter means the switch is on, a short line in its place means it is off.'
		},
		{
			tag: 'The table',
			title: 'Who times what',
			body: 'Three kinds of people (owner, group, others) times three kinds of action (read, write, run) makes nine switches.'
		},
		{
			tag: 'Denied',
			title: 'No run switch, no run',
			body: 'Even your own file will not start as a program until its <b>x</b> is on. Linux checks before it does anything.'
		},
		{
			tag: 'chmod',
			title: 'Flip a switch',
			body: '<b>u</b> is the user (owner), <b>g</b> the group, <b>o</b> the others. <b>+x</b> adds run, and a minus instead of the plus takes it away.'
		},
		{
			tag: 'Numbers',
			title: 'Three digits, three rows',
			body: 'Each row adds up its switches, 4 for read, 2 for write, 1 for run. 755 is the most common setting for scripts.'
		},
		{
			tag: 'Remember',
			title: 'Seven means all three',
			body: '4 plus 2 plus 1 is 7. 6 is read and write, 5 is read and run, 4 is read only, 0 is nothing.'
		},
		{
			tag: 'sudo',
			title: 'Borrow the boss key',
			body: '<b>root</b> may do anything. <b>sudo</b> in front of one command runs just that command as root.'
		},
		{
			tag: 'Remember',
			title: 'Please, as the boss',
			body: 'Reach for sudo only when a command needs it. Opening a file up for everyone is never the safer fix.'
		},
		{
			tag: 'Your turn',
			title: 'Only for you',
			body: 'Type <b>chmod 700 backup.sh</b> and watch the group and others rows switch off.'
		}
	],
	watchLabel: 'Nim is typing, just watch',
	tryLabel: 'Your turn, type',
	tryTip: 'Tap to let Nim type it',
	inputLabel: 'command',
	termHint: '# Nim types here first, just watch',
	hintUnknown: '# that command does not exist here',
	didYouMean: '# did you mean {word}',
	hintMissing: '# nothing with that name, ls shows what is here',
	hintDenied: '# locked, only the owner or the admin may do that',
	ownedBy: 'owned by {owner}',
	permLabels: ['read', 'write', 'run'],
	rowLabels: ['owner', 'group', 'others'],
	sumLabel: 'sum',
	deniedChip: 'Permission denied',
	ranChip: 'It ran',
	bossChip: 'sudo, acting as root',
	rule: 'Read 4, write 2, run 1. Seven means all three.',
	sudoRule: 'sudo means please, as the boss.'
};
