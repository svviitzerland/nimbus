import type { PipesGrepText } from './types';

export const en: PipesGrepText = {
	title: 'Pipes and grep',
	intro: [
		'Every visit to nimbus.com leaves one line in a log file called <b>access.log</b>. A busy site writes thousands of lines a day. Reading all of them by eye? Nim would cry.',
		'Nim opens it with <b>cat access.log</b> (cat prints a whole file). A wall of text. Each line is one visit, with the time, the address, the page, and a status number. 200 means fine, 404 means page not found, 500 means the server broke.',
		'To keep only the lines you care about, there is <b>grep</b>. <b>grep 404 access.log</b> prints just the lines that contain 404, and even colours the word for you.',
		'Now the magic part, the pipe <b>|</b> (on most keyboards it is Shift plus the backslash key). It takes what one command prints and pours it into the next one, like water through a pipe. <b>cat access.log | grep 404</b> gives the same lines, built from two small tools.',
		'Pipes can keep going. Add <b>wc -l</b> at the end (wc counts, and l means lines), <b>cat access.log | grep 404 | wc -l</b>, and the answer is a single number. 4 visitors hit a missing page today.',
		'[ingat] Picture a factory belt. cat dumps every box on the belt, grep is the worker who keeps only the boxes with a red sticker, and wc counts what reaches the end. Each tool does one small job, and | is the belt between them.',
		'Finding is half the job, sometimes you also need to change a file. <b>nano</b> is a simple text editor right inside the terminal. <b>nano todo.txt</b> opens the file, you type, then Ctrl+O saves and Ctrl+X leaves.',
		'[fyi] grep has handy switches. <b>grep -i</b> ignores upper and lower case, and <b>grep -v</b> keeps the lines that do not match. And <b>grep 404 access.log | wc -l</b> works too, one tool fewer.',
		'Your turn. How many visits broke on the server side (status 500)? Type <b>cat access.log | grep 500 | wc -l</b>.'
	],
	reactions: {
		server:
			'Two visits got a 500, and both were on /checkout. That is the page to fix first, found with one line of pipes.',
		counted404:
			'Four visits found a missing page. One line of pipes answered what would take minutes by eye.',
		counted: 'Just a number at the end of the pipe. cat, grep, and wc each did one small job.',
		piped: 'Two tools joined by a pipe. What cat printed flowed straight into grep.',
		grepped: 'grep kept only the matching lines and coloured the word.',
		noMatch: 'grep found no line with that word, so nothing came out of the pipe.',
		read: 'That is the whole log. Now imagine thousands of these.',
		nano: 'Saved. Small edits on a server are often done just like this, with nano.',
		missing: 'Nothing with that name here. The log is <b>access.log</b>.',
		denied: 'Locked, that needs the admin. Put <b>sudo</b> in front.',
		error:
			'The server did not understand that. Try <b>cat access.log | grep 500 | wc -l</b>, exactly like that.'
	},
	panels: [
		{
			tag: 'The problem',
			title: 'A wall of lines',
			body: 'Logs record every visit. They are gold when something breaks, and far too long to read line by line.'
		},
		{
			tag: 'cat',
			title: 'Print it all',
			body: '<b>cat access.log</b> prints the whole file. Look for the status number at the end of each line.'
		},
		{
			tag: 'grep',
			title: 'Find the word',
			body: '<b>grep 404 access.log</b> keeps only the lines that contain 404. Everything else is left out.'
		},
		{
			tag: 'Pipe |',
			title: 'Pour it onward',
			body: 'The <b>|</b> sends the output of the command on its left into the command on its right.'
		},
		{
			tag: 'wc -l',
			title: 'Count it',
			body: '<b>cat access.log | grep 404 | wc -l</b> prints a single number, how many lines made it through.'
		},
		{
			tag: 'Make it stick',
			title: 'The factory belt',
			body: 'cat fills the belt, grep picks the red stickers, wc counts the boxes. The pipe is the belt.'
		},
		{
			tag: 'nano',
			title: 'Edit in the terminal',
			body: '<b>nano todo.txt</b> opens a file to edit. <b>Ctrl+O</b> saves it, <b>Ctrl+X</b> closes nano.'
		},
		{
			tag: 'Good to know',
			title: 'Handy switches',
			body: '<b>grep -i</b> ignores case, <b>grep -v</b> flips the match, and grep can read a file by itself.'
		},
		{
			tag: 'Your turn',
			title: 'Count the 500s',
			body: 'Type <b>cat access.log | grep 500 | wc -l</b> and press Enter. The answer drops out of the last box.'
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
	logLabel: 'access.log',
	linesLabel: '{n} lines',
	nanoTitle: 'GNU nano, todo.txt',
	nanoLines: ['check the 404 pages', 'fix /checkout (500)'],
	nanoSave: '^O save',
	nanoExit: '^X exit',
	rule: 'One tool, one job. The pipe joins them.',
	hintNano: '# nano opens full screen, Nim types, Ctrl+O saves, Ctrl+X leaves',
	hintPipe: '# try cat access.log | grep 500 | wc -l'
};
