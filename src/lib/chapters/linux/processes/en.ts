import type { ProcessesText } from './types';

export const en: ProcessesText = {
	title: 'Processes',
	intro: [
		'Every program you start, the web server, the database, even the terminal you type in, becomes a <b>process</b> while it runs. Linux gives each one a number called a <b>PID</b> (process ID), like the ticket number you get at the bank. Our nimbus.com server is running a handful right now.',
		'To see who is running, Nim types <b>ps aux</b> (ps stands for process status, aux means show everything from every user). Each line is one process, with its owner, its PID, and how much <b>CPU</b> (the brain) and <b>RAM</b> (the working memory) it uses.',
		'A list is only a photo. For a live view, Nim types <b>top</b>. It refreshes every few seconds and puts the hungriest process at the top. Look, report.py is eating almost all the CPU! (htop, the tool you installed earlier, is a friendlier top with colourful bars.)',
		'report.py got stuck in a loop and the whole site feels slow. To stop it, use <b>kill</b> with its PID, <b>kill 4242</b>. kill sends a polite message, please finish up and close. But this one is so stuck it does not even hear it.',
		'For a process that will not listen, there is <b>kill -9</b>. It is not a request anymore, Linux simply removes it on the spot, and the CPU calms down. Keep it as a last resort, because the program gets no chance to save its work.',
		'One more trick. A long job normally holds your terminal until it finishes, that is the <b>foreground</b>. Put <b>&</b> at the end, <b>./backup.sh &</b>, and it moves to the <b>background</b> so you can keep typing. <b>jobs</b> shows what runs back there, and <b>fg</b> brings it to the front again.',
		'[ingat] Picture a restaurant kitchen. Every dish on the stove is a process with its own order number (the PID). ps reads the order board, top watches which pan is smoking, and kill takes the burning pan off the fire.',
		'[fyi] Same idea, different world. On Windows it is Task Manager (Ctrl+Shift+Esc), on a Mac it is Activity Monitor, and on your phone you do the same thing when you swipe a frozen app away.',
		'Your turn. Another script, thumbs.py, just went wild and grabs the CPU. Its PID is 5150. Type <b>kill 5150</b> and watch the meter calm down.'
	],
	reactions: {
		killed: 'Gone. The process ended, its row left the list, and the CPU can breathe again.',
		killed9:
			'Removed on the spot with kill -9. No goodbye and no saving. Handy for a frozen process, risky for everything else.',
		ignored:
			'kill printed nothing, and the process is still there. It is too stuck to hear the polite ask. That is when <b>kill -9</b> comes in.',
		listed: 'Every line is one process. Find the PID column, that number is what kill needs.',
		top: 'top sorts by hunger, so the busiest process sits on top. On a real server it keeps refreshing until you press q.',
		background:
			'It runs in the background now and your terminal is free again. The number in brackets is the job number, the other one is its PID.',
		jobs: 'jobs lists what runs in the background of this terminal. <b>fg</b> would bring it back to the front.',
		pid1: 'PID 1 is systemd, the very first process, the one that starts all the others. Linux protects it, so nothing happens. Good thing too.',
		noProcess: 'No process has that PID. Check the list again with <b>ps aux</b>.',
		needSudo:
			'That process belongs to another user, so only the admin may stop it. Put <b>sudo</b> in front, like in [[Permissions and sudo|linux/permissions]].',
		missing: 'Nothing with that name here. Try <b>kill 5150</b>.',
		denied: 'Locked, that needs the admin. Put <b>sudo</b> in front.',
		error: 'The server did not understand that. Try <b>kill 5150</b>, exactly like that.'
	},
	panels: [
		{
			tag: 'Process',
			title: 'A program at work',
			body: 'A program on the disk is just a file. Once it runs it becomes a <b>process</b>, and every process gets its own <b>PID</b>.'
		},
		{
			tag: 'ps',
			title: 'Who is running',
			body: '<b>ps aux</b> lists every process once, with its owner, PID, CPU and memory. Think of it as a photo.'
		},
		{
			tag: 'top',
			title: 'The live view',
			body: '<b>top</b> (or the prettier <b>htop</b>) refreshes by itself and sorts the hungriest process to the top.'
		},
		{
			tag: 'kill',
			title: 'A polite stop',
			body: '<b>kill 4242</b> asks process 4242 to finish and close. Most programs listen, a frozen one may not.'
		},
		{
			tag: 'kill -9',
			title: 'The last resort',
			body: '<b>kill -9</b> ends the process at once, with no chance to clean up or save. Try the polite kill first.'
		},
		{
			tag: 'Background',
			title: 'Front or back',
			body: 'A job in the <b>foreground</b> holds the terminal. Add <b>&</b> to send it to the <b>background</b>, check it with <b>jobs</b>, and call it back with <b>fg</b>.'
		},
		{
			tag: 'Remember it',
			title: 'The busy kitchen',
			body: 'Dish, process. Order number, PID. Order board, ps. Smoking pan, top. Off the fire, kill.'
		},
		{
			tag: 'Good to know',
			title: 'Task Manager too',
			body: 'Windows, Mac, and phones all list running programs and let you end the frozen one. Linux just does it with words.'
		},
		{
			tag: 'Your turn',
			title: 'Stop thumbs.py',
			body: 'Type <b>kill 5150</b> and press Enter. The red row leaves the list and the CPU meter goes green.'
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
	serverLabel: 'nimbus.com server',
	cpuLabel: 'CPU',
	ramLabel: 'RAM',
	listTitle: 'Running now',
	bgLabel: 'background',
	stuckLabel: 'stuck',
	rule: 'ps lists, top watches, kill stops.',
	hintSudo: '# that process is not yours, put sudo in front',
	hintKill: '# try kill 5150',
	hintTop: '# a real top keeps refreshing, press q to leave'
};
