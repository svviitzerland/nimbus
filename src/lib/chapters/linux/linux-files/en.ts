import type { LinuxFilesText } from './types';

export const en: LinuxFilesText = {
	title: 'The Linux file system',
	intro: [
		'The practice nimbus.com server runs Ubuntu Linux. You access its <b>terminal</b> through [[SSH|cloud/remote-access]]. Terminal commands let you inspect files and manage applications.',
		'The Linux directory hierarchy starts at <b>/</b>, the root directory. Other directories are below it, such as /home, /etc, and /var.',
		'First question in any new place, where am I? The command <b>pwd</b> answers it (print working directory). Watch Nim type it. You are in /home/nim, your very own home folder.',
		'<b>ls</b> lists directory contents. Run <b>ls /</b> to see the top-level directories. /home holds user directories, /etc holds configuration, and /var contains changing data such as logs.',
		'<b>cd</b> changes directory. The path <b>/var/log/nimbus</b> means the nimbus directory inside log, inside var. Watch the position marker as the command runs.',
		'Last, read. <b>cat</b> prints a file on the screen. Nim lists the folder, then reads error.log, and there is the reason nimbus.com stopped last night. The disk was full.',
		'[ingat] pwd prints the current directory, ls lists its contents, cd changes directory, and cat reads file contents.',
		'[fyi] Windows does this differently, every drive gets its own tree (C, D, and so on). On Linux a second disk or a USB stick simply shows up as one more folder in the same tree.',
		'Your turn, and it is a tiny one. You are deep inside /var/log/nimbus. Type <b>cd ~</b> to jump straight back home. That wavy sign <b>~</b> always means your home folder.'
	],
	reactions: {
		home: 'Whoosh, back home in /home/nim. Look at the prompt, it shows <b>~</b> again. Wherever you get lost on a server, cd ~ brings you back.',
		moved:
			'You moved, and the pin moved with you. The prompt always shows where you stand, so you never have to guess. Type <b>cd ~</b> whenever you want to go home.',
		looked:
			'That is ls showing what lives here. Folders are blue, plain files are white. Want to walk into one? Use cd.',
		read: 'cat displays this file’s contents. It is useful for reading short text files such as this log example.',
		pwd: 'pwd tells you exactly where you are, the same path the pin points at.',
		rootHome:
			'Access to <b>/root</b> was denied. It is the root user’s home directory, distinct from the top-level <b>/</b>. See [[Permission and sudo|linux/permissions]] for access rules.',
		missing:
			'Nothing with that name lives there. Try <b>ls</b> to see what is around. And Linux cares about capitals, so Log and log are two different names.',
		denied:
			'Locked, that one is for the admin only. You will learn the keys in [[Permissions and sudo|linux/permissions]].',
		error: 'The server does not know that command. Check the spelling, or try <b>cd ~</b>.'
	},
	panels: [
		{
			tag: 'Server',
			title: 'Accessing files through a terminal',
			body: 'A <b>server</b> runs day and night in a data center. You talk to it by typing into a <b>terminal</b>, and it answers with text.'
		},
		{
			tag: 'Root',
			title: 'Root directory',
			body: 'Everything starts at <b>/</b>. A path is the list of folders you walk through from the top, split by slashes.'
		},
		{
			tag: 'pwd',
			title: 'Checking the current directory',
			body: '<b>pwd</b> prints the folder you are standing in. The pin on the tree marks the same spot.'
		},
		{
			tag: 'ls',
			title: 'Listing files',
			body: '<b>ls</b> lists a folder. In the terminal, folders show in blue and plain files in white.'
		},
		{
			tag: 'cd',
			title: 'Changing directories',
			body: '<b>cd</b> plus a path moves you. The prompt changes too, it always shows where you are.'
		},
		{
			tag: 'cat',
			title: 'Reading a file',
			body: '<b>cat</b> prints a whole file. Logs like this one are plain text, made to be read by people.'
		},
		{
			tag: 'Remember',
			title: 'Four basic commands',
			body: 'pwd, where am I. ls, what is here. cd, go there. cat, show me.'
		},
		{
			tag: 'Good to know',
			title: 'Linux directory structure',
			body: 'Extra disks join the tree as folders, often under <b>/mnt</b> or <b>/media</b>. There is never a drive C.'
		},
		{
			tag: 'Your turn',
			title: 'Returning to the home directory',
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
