import type { LinuxFilesText } from './types';

export const en: LinuxFilesText = {
	title: 'The Linux file system',
	intro: [
		'Your nimbus.com website lives on a <b>server</b>, a computer in a data center. Like most servers on the internet it runs <b>Linux</b> (this one is Ubuntu). It has no desktop and no mouse, only a <b>terminal</b>, a window where you type commands. You reach it through SSH, the remote door from [[remote access|cloud/remote-access]].',
		'Every file on Linux lives in one big tree of folders. The very top is called <b>root</b> and is written as a single slash, <b>/</b>. Every other folder grows out of it, like branches out of a trunk.',
		'First question in any new place, where am I? The command <b>pwd</b> answers it (print working directory). Watch Nim type it. You are in /home/nim, your very own home folder.',
		'Next, look around. <b>ls</b> lists what is inside a folder, the same idea as in [[CLI vs GUI|foundations/cli-gui]]. Nim asks for the top with <b>ls /</b>, and the first branches light up. home holds the users, etc holds settings, and var holds things that keep changing, like logs.',
		'Now walk. <b>cd</b> (change directory) moves you into a folder. A path like /var/log/nimbus simply walks down from the top, one folder at a time. Follow the pin.',
		'Last, read. <b>cat</b> prints a file on the screen. Nim lists the folder, then reads error.log, and there is the reason nimbus.com stopped last night. The disk was full.',
		'[ingat] Four commands, four little questions. <b>pwd</b> asks where am I, <b>ls</b> asks what is here, <b>cd</b> says go there, and <b>cat</b> says show me.',
		'[fyi] Windows does this differently, every drive gets its own tree (C, D, and so on). On Linux a second disk or a USB stick simply shows up as one more folder in the same tree.',
		'Your turn, and it is a tiny one. You are deep inside /var/log/nimbus. Type <b>cd ~</b> to jump straight back home. That wavy sign <b>~</b> always means your home folder.'
	],
	reactions: {
		home: 'Whoosh, back home in /home/nim. Look at the prompt, it shows <b>~</b> again. Wherever you get lost on a server, cd ~ brings you back.',
		moved:
			'You moved, and the pin moved with you. The prompt always shows where you stand, so you never have to guess. Type <b>cd ~</b> whenever you want to go home.',
		looked:
			'That is ls showing what lives here. Folders are blue, plain files are white. Want to walk into one? Use cd.',
		read: 'cat printed the whole file. Logs, settings, notes, on Linux almost everything is plain text you can read like this.',
		pwd: 'pwd tells you exactly where you are, the same path the pin points at.',
		rootHome:
			'Locked. <b>/root</b> is the home folder of the admin called root, and nobody else may go in. Same name as the top of the tree, very different place. More on locks in [[Permissions and sudo|linux/permissions]].',
		missing:
			'Nothing with that name lives there. Try <b>ls</b> to see what is around. And Linux cares about capitals, so Log and log are two different names.',
		denied:
			'Locked, that one is for the admin only. You will learn the keys in [[Permissions and sudo|linux/permissions]].',
		error: 'The server does not know that command. Check the spelling, or try <b>cd ~</b>.'
	},
	panels: [
		{
			tag: 'Server',
			title: 'A computer without a screen',
			body: 'A <b>server</b> runs day and night in a data center. You talk to it by typing into a <b>terminal</b>, and it answers with text.'
		},
		{
			tag: 'Root',
			title: 'The top of the tree',
			body: 'Everything starts at <b>/</b>. A path is the list of folders you walk through from the top, split by slashes.'
		},
		{
			tag: 'pwd',
			title: 'Where am I',
			body: '<b>pwd</b> prints the folder you are standing in. The pin on the tree marks the same spot.'
		},
		{
			tag: 'ls',
			title: 'What is here',
			body: '<b>ls</b> lists a folder. In the terminal, folders show in blue and plain files in white.'
		},
		{
			tag: 'cd',
			title: 'Go there',
			body: '<b>cd</b> plus a path moves you. The prompt changes too, it always shows where you are.'
		},
		{
			tag: 'cat',
			title: 'Show me',
			body: '<b>cat</b> prints a whole file. Logs like this one are plain text, made to be read by people.'
		},
		{
			tag: 'Remember',
			title: 'Four questions',
			body: 'pwd, where am I. ls, what is here. cd, go there. cat, show me.'
		},
		{
			tag: 'Good to know',
			title: 'One tree, not drives',
			body: 'Extra disks join the tree as folders, often under <b>/mnt</b> or <b>/media</b>. There is never a drive C.'
		},
		{
			tag: 'Your turn',
			title: 'Go home',
			body: 'Type <b>cd ~</b> and press Enter, then watch the pin fly back to /home/nim.'
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
	hintDenied: '# locked, only the owner or the admin may open it',
	hereLabel: 'You are in',
	cheats: [
		{ cmd: 'pwd', means: 'where am I' },
		{ cmd: 'ls', means: 'what is here' },
		{ cmd: 'cd', means: 'go there' },
		{ cmd: 'cat', means: 'show me' }
	]
};
