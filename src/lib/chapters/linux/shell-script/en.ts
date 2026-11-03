import type { ShellScriptText } from './types';

export const en: ShellScriptText = {
	title: 'Shell scripts',
	intro: [
		'Every night before bed you back up nimbus.com by hand. Make a folder, pack the whole website into one archive file, check that it is there. Three commands, every single night. Skip one night, and of course that is the night the disk dies.',
		'A <b>shell script</b> fixes this. It is simply a text file with your commands written in order, one per line. Run the file and the shell types them all for you, top to bottom, exactly the same every time.',
		"Two small extras make a script feel smart. The first line, <b>#!/bin/bash</b> (people call it a shebang), says which program should read the file. And a <b>variable</b> like DAY=$(date +%F) stores today's date, so every backup gets its own name.",
		'[fyi] Pair a script with <b>cron</b>, the alarm clock of Linux, and it runs at 2 in the morning while you sleep. That is how real servers do their nightly [[backup|devops/backup]].',
		"Your turn. Do tonight's backup by hand once to feel the pain. Then write those steps into backup.sh, make it runnable like in [[Permissions and sudo|linux/permissions]], and run it."
	],
	reactions: {
		mkdir:
			"Folder made. Now the long one, pack /var/www/nimbus into an archive with today's date in its name.",
		hand: "Tonight's backup is done, but look how long that tar line was, with the date typed by hand. Now write it into a script so you never type it again. Type <b>nano backup.sh</b> or open the nano tab.",
		handAgain:
			'Another night, another long line typed by hand. This is exactly what scripts are for.',
		write:
			'Saved! backup.sh now holds every step, in an order that works. It is just a text file for now though.',
		saved: 'Saved again.',
		order:
			'Saved, but that order will trip up. Look at the yellow note in the editor, then fix the lines and save again. Or run it anyway and watch what goes wrong.',
		chmod: 'backup.sh can run now, the same x switch from the permissions lesson.',
		exec: 'backup.sh can run now, the same x switch from the permissions lesson. Run it with <b>./backup.sh</b>.',
		runDenied:
			'Permission denied, a new file never gets the x switch by itself. Give it one with <b>chmod +x backup.sh</b>.',
		brokenRun:
			'It ran, line by line, but something is off. A script does exactly what it says, in exactly that order, so fix the order in nano and save again.',
		emptyDay:
			'See that archive called nimbus-.tar.gz? The tar line ran before DAY was set, so the date was empty. Variables must be set before you use them.',
		bashRun:
			'That works, bash read the file and ran it. Now try it the proper way, <b>./backup.sh</b>, after giving it the x switch.',
		ran: 'One command, and the whole backup happened, folder, archive, and a friendly message. Tap Next night to see the real payoff.',
		run: 'One command, and the whole backup happened, folder, archive, and a friendly message.',
		again:
			'A new night, still one short command, and the new archive got its own date by itself. That is the magic of a script.',
		nextDay: 'A new night has come. Run <b>./backup.sh</b> again, one command instead of three.',
		nextDayHand:
			'A new night, and the backup is due again. By hand it is three commands, every night, forever.',
		missing: 'Nothing with that name here. Run <b>ls</b> to see what is around.',
		denied: 'Locked. Check its permission letters with <b>ls -l</b>.',
		error:
			'The server does not know that command. Check the spelling, or type <b>help</b> to see what it knows.',
		done: 'All missions done! You turned three boring commands into one file that does them perfectly every time, with the right date. Scripts like this run backups, deploy websites, and set up whole servers, and they are the first step toward automating everything.'
	},
	missionsLabel: 'Missions',
	missions: [
		"Do tonight's backup by hand",
		'Write the steps into backup.sh',
		'Make backup.sh runnable',
		'Run it with ./backup.sh'
	],
	hintBtn: 'Help',
	doneNote: 'All missions done, the backup runs itself',
	inputLabel: 'command',
	termHint: '# start with mkdir -p ~/backups, then press Enter',
	hintUnknown: '# that command does not exist here, type help to see the list',
	didYouMean: '# maybe you meant {word}',
	hintMissing: '# nothing with that name here, ls shows what is around',
	hintDenied: '# permission denied, a new script needs chmod +x',
	termTab: 'Terminal',
	editorEmpty: 'Empty file, tap the lines below in the order they should run',
	poolLabel: 'Tap a line to add it',
	saveBtn: 'Save',
	editorHint: 'Tap a line in the file to take it out',
	orderNotes: {
		shebang: 'The shebang, #!/bin/bash, has to be the very first line',
		day: 'DAY is used before it is set, so the date would be empty',
		mkdir: 'tar runs before the backups folder exists'
	},
	emptyShelf: 'No backups yet, nimbus.com is unprotected',
	nextDayBtn: 'Next night',
	days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	nightLine: '# a new night, {day}',
	hintNano: '# the script to edit is backup.sh, try nano backup.sh'
};
