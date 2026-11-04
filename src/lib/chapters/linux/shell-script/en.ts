import type { ShellScriptText } from './types';

export const en: ShellScriptText = {
	title: 'Shell scripts',
	intro: [
		'Every night you save a copy of nimbus.com, just in case. Watch Nim do it by hand. Make a backups folder, then pack the whole site into one file with <b>tar</b> (a bit like zipping it). Now imagine typing that every single night.',
		'Computers love boring jobs, so let us hand it over. A <b>shell script</b> is a plain text file full of commands, the exact ones you would type. Nim shows backup.sh with <b>cat</b>, and the card writes itself.',
		'The very first line is special. <b>#!/bin/bash</b> (people call it the shebang) tells Linux which program should read the file. Here it is bash, the same shell you type into.',
		"Line two makes a <b>variable</b>, a named box for a value. DAY holds today's date, and further down <b>$DAY</b> pours it into the file name. So every night the backup gets a new name, and nothing gets overwritten.",
		'A script is a program, so it needs its run switch, just like in [[Permissions and sudo|linux/permissions]]. Nim types <b>chmod +x backup.sh</b>, and the card says it may run.',
		'Now <b>./backup.sh</b>. Bash reads the lines top to bottom, exactly like the recipe in [[Programs and algorithms|basics/program]], and a fresh box lands on the shelf. One short command did all the typing.',
		'[ingat] A script is a recipe for the terminal. Write it once, <b>chmod +x</b> it once, then <b>./</b> runs it as often as you like.',
		'[fyi] Pair a script with <b>cron</b>, the alarm clock of Linux, and it runs at 2 in the morning while you sleep. That is how real servers do their nightly [[backups|devops/backup]].',
		'Your turn. It is the next night already. Type <b>./backup.sh</b> and watch a new box with the new date land on the shelf.'
	],
	reactions: {
		ran: 'Another night, another box, and you typed one short command. Run it again if you like, every run is the next night.',
		bashRun:
			'That works too. <b>bash backup.sh</b> asks bash to read the file, so it does not even need the run switch.',
		chmod: 'The run switch is on. Now <b>./backup.sh</b> starts it.',
		chmodOff:
			'You took the run switch away, so ./backup.sh will be refused. Put it back with <b>chmod +x backup.sh</b>.',
		read: 'That is the whole script, five plain lines. Nothing magic, just the commands you would have typed.',
		runDenied:
			'Permission denied, the script has no run switch. Give it one with <b>chmod +x backup.sh</b>.',
		missing:
			'Nothing with that name here. The script lives in your home folder, so type <b>./backup.sh</b>.',
		denied: 'Locked, only the owner or the admin may do that.',
		error: 'The server did not understand that. Try <b>./backup.sh</b>, dot and slash included.'
	},
	panels: [
		{
			tag: 'By hand',
			title: 'The same lines every night',
			body: '<b>mkdir</b> makes a folder, <b>tar</b> packs many files into one. Fine once, tiring forever, and easy to mistype at midnight.'
		},
		{
			tag: 'Script',
			title: 'Commands in a file',
			body: 'A <b>shell script</b> is a text file of commands. Running it is the same as typing every line yourself, in order.'
		},
		{
			tag: 'Shebang',
			title: 'Who reads this file',
			body: '<b>#!/bin/bash</b> goes on line one. It names the program that runs the rest, here bash.'
		},
		{
			tag: 'Variable',
			title: 'A named box',
			body: '<b>DAY=</b> stores a value, <b>$DAY</b> uses it. <b>$(date +%F)</b> runs date and drops in the answer, like 2026 11 03.'
		},
		{
			tag: 'chmod +x',
			title: 'Allowed to run',
			body: 'Without the run switch Linux refuses to start the file. One chmod and it counts as a program.'
		},
		{
			tag: './backup.sh',
			title: 'Top to bottom',
			body: '<b>./</b> means the file right here. Bash reads each line in order, and the highlight follows along.'
		},
		{
			tag: 'Make it stick',
			title: 'Write, chmod, run',
			body: 'Write the recipe once, give it its run switch once, then one short line does the whole job.'
		},
		{
			tag: 'Good to know',
			title: 'Let it run alone',
			body: '<b>cron</b> starts commands on a schedule, every night, every hour, every Monday. Scripts and cron go together.'
		},
		{
			tag: 'Your turn',
			title: "Run tonight's backup",
			body: 'Type <b>./backup.sh</b> and press Enter. Each run is a new night, so each run adds a box.'
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
	hintDenied: '# locked, the file needs its run switch',
	byHand: 'Tonight, by hand',
	runnableChip: 'may run',
	emptyShelf: 'empty for now',
	rule: 'Write it once, chmod +x once, ./ forever.',
	nightLine: '# the next night, {day}'
};
